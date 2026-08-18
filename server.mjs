import http from "node:http";
import { exec } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

globalThis.window = globalThis;
await import("./data.js");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const cacheDir = path.join(root, "data", "avatar-cache");
const port = Number(process.env.PORT || 4173);
const configuredHost = process.env.GMS_HOST || process.env.HOST;
const host = process.argv.includes("--lan")
  ? "0.0.0.0"
  : configuredHost && /^(?:\d{1,3}\.){3}\d{1,3}$/.test(configuredHost)
    ? configuredHost
    : "127.0.0.1";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const classAliases = {
  "night lord": "NightLord",
  "bishop": "Bishop",
  "dawn warrior": "DawnWarrior",
  "shade": "Shade",
  "buccaneer": "Buccaneer",
  "hero": "Hero",
  "wind archer": "WindArcher",
  "blaster": "Blaster",
  "bow master": "Bowmaster",
  "cannon master": "Cannoneer",
  "blade master": "DualBlade",
  "zero": "Zero",
  "zero (alpha)": "Zero",
  "zero (beta)": "Zero",
  "zero alpha": "Zero",
  "zero beta": "Zero",
  "bowmaster": "Bowmaster",
  "marksman": "Marksman",
  "pathfinder": "Pathfinder",
  "wild hunter": "WildHunter",
  "mercedes": "Mercedes",
  "night walker": "NightWalker",
  "shadower": "Shadower",
  "dual blade": "DualBlade",
  "phantom": "Phantom",
  "cadena": "Cadena",
  "hoyoung": "Hoyoung",
  "khali": "Khali",
  "ark": "Ark",
  "corsair": "Corsair",
  "mechanic": "Mechanic",
  "angelic buster": "AngelicBuster",
  "fire/poison": "FirePoison",
  "ice/lightning mage": "IceLightning",
  "luminous": "Luminous",
  "evan": "Evan",
  "battle mage": "BattleMage",
  "blaze wizard": "BlazeWizard",
  "kinesis": "Kinesis",
  "illium": "Illium",
  "lara": "Lara",
  "kanna": "Kanna",
  "lynn": "Lynn",
  "arch mage (i/l)": "IceLightning",
  "arch mage: ice/lightning": "IceLightning",
  "arch mage ice/lightning": "IceLightning",
  "ice/lightning arch mage": "IceLightning",
  "arch mage (f/p)": "FirePoison",
  "arch mage: fire/poison": "FirePoison",
  "arch mage fire/poison": "FirePoison",
  "erel": "ErelLight",
  "hayato": "Hayato",
  "sia astelle": "Sia",
  "sia": "Sia",
  "demon slayer": "DemonSlayer",
  "demon avenger": "DemonAvenger",
  "xenon": "Xenon",
};

Object.entries(window.CLASS_STYLES || {}).forEach(([classKey, style]) => {
  [classKey, style.label, style.short].filter(Boolean).forEach((alias) => {
    classAliases[String(alias).toLowerCase()] ??= classKey;
  });
});

let browserPromise = null;
let pagePromise = null;
let fetchQueue = Promise.resolve();

await fs.mkdir(cacheDir, { recursive: true });

async function findBrowserLaunchOptions() {
  const configured = process.env.CHROME_PATH || process.env.CHROME_BIN;
  if (configured) return { executablePath: configured };
  if (process.platform === "win32") {
    const edgeCandidates = [
      path.join(process.env.PROGRAMFILES || "C:\\Program Files", "Microsoft", "Edge", "Application", "msedge.exe"),
      path.join(process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
    ];
    for (const candidate of edgeCandidates) {
      try {
        await fs.access(candidate);
        return { channel: "msedge" };
      } catch {
        // Try the next Edge path.
      }
    }
  }
  const candidates =
    process.platform === "win32"
      ? [
          path.join(process.env.PROGRAMFILES || "C:\\Program Files", "Google", "Chrome", "Application", "chrome.exe"),
          path.join(process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Google", "Chrome", "Application", "chrome.exe"),
          path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
        ]
      : process.platform === "darwin"
        ? [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
            "/usr/bin/chromium",
            "/usr/bin/google-chrome",
            "/usr/bin/chromium-browser",
          ]
        : ["/usr/bin/chromium", "/usr/bin/google-chrome", "/usr/bin/chromium-browser"];
  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return { executablePath: candidate };
    } catch {
      // Try the next platform path.
    }
  }
  return {};
}

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = (async () => {
      const launchOptions = await findBrowserLaunchOptions();
      try {
        return await chromium.launch({
          headless: true,
          ...launchOptions,
          args: ["--disable-blink-features=AutomationControlled"],
        });
      } catch (error) {
        if (!launchOptions.executablePath && !launchOptions.channel && /Executable doesn't exist/i.test(error.message)) {
          throw new Error(
            "A compatible browser was not found. Install Chrome or Edge, or set CHROME_PATH to a Chromium executable.",
          );
        }
        throw error;
      }
    })();
  }
  return browserPromise;
}

async function getPage() {
  if (!pagePromise) {
    pagePromise = getBrowser().then(async (browser) => {
      const context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
        viewport: { width: 1440, height: 1000 },
      });
      const page = await context.newPage();
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
      });
      return page;
    });
  }
  return pagePromise;
}

function safeName(value) {
  const trimmed = String(value || "").trim();
  if (!/^[^\s]{1,24}$/u.test(trimmed) || /[<>#?&/\\]/u.test(trimmed)) {
    throw new Error("Invalid character name");
  }
  return trimmed;
}

function safeRegion(value) {
  const region = String(value || "NA").toUpperCase();
  return region === "EU" ? "EU" : "NA";
}

function profileUrl(name, region) {
  const encoded = encodeURIComponent(name);
  return region === "EU"
    ? `https://mapleranks.com/u/eu/${encoded}`
    : `https://mapleranks.com/u/${encoded}`;
}

function mapClassKey(rawClass) {
  const normalized = String(rawClass || "").trim().toLowerCase();
  const exact = classAliases[normalized];
  if (exact) return exact;
  const alias = Object.keys(classAliases).find((key) => key.includes(normalized) || normalized.includes(key));
  return alias ? classAliases[alias] : null;
}

function mapleRanksHashKey(name) {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(index);
    hash &= hash;
  }
  let seed = Math.abs(hash);
  const key = new Uint8Array(16);
  for (let index = 0; index < key.length; index += 1) {
    seed = (1664525 * seed + 1013904223) % 4294967296;
    key[index] = 255 & seed;
  }
  return key;
}

function decodeMapleRanksPayload(payload, name) {
  const bytes = Uint8Array.from(Buffer.from(payload, "base64"));
  const prefixLength = bytes[0];
  const body = bytes.slice(1 + prefixLength);
  const key = mapleRanksHashKey(name.toLowerCase());
  const decoded = new Uint8Array(body.length);
  for (let index = 0; index < body.length; index += 1) {
    decoded[index] = body[index] ^ key[index % key.length];
  }
  return JSON.parse(new TextDecoder().decode(decoded));
}

function mapleRanksExpMetrics(decoded, requestedName) {
  const character = decoded?.a8a52f2a;
  const exp = decoded?.f0936776;
  const values = exp?.a97740e6?.data?.datasets?.[0]?.data;
  if (!character || !Array.isArray(values) || character.c0b8373f?.toLowerCase() !== requestedName.toLowerCase()) {
    throw new Error("MapleRanks character exp data not found");
  }
  const sevenDayValues = values.slice(-7).filter((value) => Number.isFinite(Number(value)));
  const sevenDayExp = sevenDayValues.reduce((sum, value) => sum + Number(value), 0);
  const averageSevenDayExp = sevenDayValues.length ? sevenDayExp / sevenDayValues.length : 0;
  const level = Number(character.ce118b77);
  const levelTable = exp?.a90a3acb?.b675813d || {};
  const requiredForNextLevel = Number(levelTable[String(level + 1)]);
  const nextLevelDays =
    averageSevenDayExp > 0 && Number.isFinite(requiredForNextLevel)
      ? requiredForNextLevel / averageSevenDayExp
      : null;
  return {
    name: character.c0b8373f,
    level,
    levelPercent: Number(character.f0936776) || null,
    world: character.de2fb364 || character.a665cc21 || "",
    lastUpdated: character.ad8fa1c6 || null,
    currentExp: Number(character.a0e4e779) || 0,
    yesterdayExp: Number(values.at(-1)) || 0,
    sevenDayExp,
    averageSevenDayExp,
    requiredForNextLevel,
    nextLevelDays,
  };
}

async function fetchCharacter(name, region) {
  const page = await getPage();
  const url = profileUrl(name, region);
  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(attempt === 0 ? 6500 : 9000);
      const result = await page.evaluate(async (characterName) => {
        const expectedAlt = characterName.toLowerCase();
        const image = [...document.images].find((item) => item.alt.toLowerCase() === expectedAlt);
        if (!image || !image.src.startsWith("blob:")) {
          const challenge = document.body.innerText.includes("Just a moment");
          return { error: challenge ? "Cloudflare challenge" : "Character image not found" };
        }
        const response = await fetch(image.src);
        const blob = await response.blob();
        const bytes = new Uint8Array(await blob.arrayBuffer());
        let binary = "";
        for (let index = 0; index < bytes.length; index += 1024) {
          binary += String.fromCharCode(...bytes.subarray(index, index + 1024));
        }
        const dataUrl = `data:${blob.type || "image/png"};base64,${btoa(binary)}`;
        const description = document.querySelector('meta[name="description"]')?.content || "";
        const levelMatch = description.match(/level\s+(\d+)/i) || document.body.innerText.match(/Lv\.\s*(\d+)/i);
        const classWorldMatch =
          description.match(/level\s+\d+\s+([^.]*?)\s+in\s+([^.]+)\./i) ||
          document.body.innerText.match(/([A-Za-z /&]+?)\s+in\s+([A-Za-z]+)/i);
        return {
          name: characterName,
          level: levelMatch ? Number(levelMatch[1]) : null,
          rawClass: classWorldMatch?.[1]?.trim() || "",
          world: classWorldMatch?.[2]?.trim() || "",
          avatarDataUrl: dataUrl,
          imageWidth: image.width,
          imageHeight: image.height,
        };
      }, name);

      if (result.error) throw new Error(result.error);
      result.classKey = mapClassKey(result.rawClass) || "Unknown";
      return result;
    } catch (error) {
      lastError = error;
      if (attempt === 0) continue;
    }
  }

  throw lastError || new Error("Unable to load character");
}

async function fetchCharacterExp(name, region) {
  const page = await getPage();
  const url = profileUrl(name, region);
  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(attempt === 0 ? 6500 : 9000);
      const payload = await page.evaluate(() => window.__MR__ || null);
      if (!payload) {
        throw new Error(document?.body?.innerText?.includes("Just a moment")
          ? "Cloudflare challenge"
          : "MapleRanks exp payload not found");
      }
      return mapleRanksExpMetrics(decodeMapleRanksPayload(payload, name), name);
    } catch (error) {
      lastError = error;
      if (attempt === 0) continue;
    }
  }

  throw lastError || new Error("Unable to load character exp");
}

const mapleBotKey = "0081a87cab06abc65de027850c191f16";

function decryptMapleBot(encrypted) {
  const raw = Buffer.from(encrypted, "base64").toString("utf8");
  const { iv, encrypted: cipherText } = JSON.parse(raw);
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(mapleBotKey, "utf8"),
    Buffer.from(iv, "hex"),
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(cipherText, "hex")),
    decipher.final(),
  ]).toString("utf8");
  return JSON.parse(decrypted);
}

async function fetchMapleBotCharacter(name, region) {
  const response = await fetch(
    `https://maplebot.io/api/character/${encodeURIComponent(name)}?region=${region}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",
        Referer: "https://maplebot.io/tools/hexa-tracker",
        Origin: "https://maplebot.io",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
      },
    },
  );
  if (!response.ok) throw new Error(`MapleBot HTTP ${response.status}`);
  const body = await response.json();
  if (!body.encrypted) throw new Error("MapleBot encrypted payload missing");
  const decoded = decryptMapleBot(body.encrypted);
  const character = decoded?.data?.character;
  if (!character) throw new Error("MapleBot character data missing");
  return {
    name: character.name || name,
    level: character.level || null,
    rawClass: character.job || "",
    world: character.world || "",
    classKey: mapClassKey(character.job) || "Unknown",
    avatarDataUrl: character.imageUrl || "",
    imageWidth: null,
    imageHeight: null,
  };
}

async function getCharacterData(name, region) {
  const safe = `${region}-${encodeURIComponent(name)}`;
  const cacheFile = path.join(cacheDir, `${safe}.json`);
  try {
    const cached = JSON.parse(await fs.readFile(cacheFile, "utf8"));
    if (cached.classKey !== "Unknown") return cached;
  } catch {
    // A missing file or legacy Unknown cache should be refreshed.
  }
  let data;
  try {
    data = await fetchMapleBotCharacter(name, region);
  } catch (mapleBotError) {
    data = await fetchCharacter(name, region);
  }
  await fs.writeFile(cacheFile, JSON.stringify(data));
  return data;
}

function sendJson(response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  });
  response.end(body);
}

async function serveStatic(response, requestUrl) {
  const pathname = decodeURIComponent(requestUrl.split("?")[0]);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(root, requested));
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new Error("Not a file");
    const data = await fs.readFile(filePath);
    const extension = path.extname(filePath);
    const isCodeAsset = [".html", ".css", ".js", ".mjs", ".json"].includes(extension);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": isCodeAsset ? "no-cache, no-store, must-revalidate" : "public, max-age=86400",
    });
    response.end(data);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (requestUrl.pathname === "/api/character-exp") {
    fetchQueue = fetchQueue
      .then(async () => {
        const name = safeName(requestUrl.searchParams.get("name"));
        const region = safeRegion(requestUrl.searchParams.get("region"));
        const data = await fetchCharacterExp(name, region);
        sendJson(response, 200, data);
      })
      .catch((error) => {
        sendJson(response, error.message.includes("Invalid character name") ? 400 : 404, {
          error: error.message || "Unable to load character exp",
        });
      });
    await fetchQueue;
    return;
  }

  if (requestUrl.pathname === "/api/character") {
    fetchQueue = fetchQueue
      .then(async () => {
        const name = safeName(requestUrl.searchParams.get("name"));
        const region = safeRegion(requestUrl.searchParams.get("region"));
        const data = await getCharacterData(name, region);
        sendJson(response, 200, data);
      })
      .catch((error) => {
        sendJson(response, error.message.includes("Invalid character name") ? 400 : 404, {
          error: error.message || "Unable to load character",
        });
      });
    await fetchQueue;
    return;
  }

  if (requestUrl.pathname === "/api/clear-avatar-cache") {
    try {
      await fs.rm(cacheDir, { recursive: true, force: true });
      await fs.mkdir(cacheDir, { recursive: true });
      sendJson(response, 200, { ok: true });
    } catch (error) {
      sendJson(response, 500, { error: error.message });
    }
    return;
  }

  await serveStatic(response, requestUrl.pathname);
});

server.listen(port, host, () => {
  const addresses = Object.values(os.networkInterfaces())
    .flat()
    .filter((network) => network?.family === "IPv4" && !network.internal)
    .map((network) => network.address);
  if (host === "0.0.0.0" && addresses.length) {
    console.log("Local network URLs:");
    addresses.forEach((address) => console.log(`  http://${address}:${port}`));
  }
  console.log(`MapleStory progress server running at http://${host}:${port}`);
  if (process.argv.includes("--open")) {
    const url = `http://127.0.0.1:${port}`;
    const openCommand =
      process.platform === "win32"
        ? `start "" "${url}"`
        : process.platform === "darwin"
          ? `open "${url}"`
          : `xdg-open "${url}"`;
    exec(openCommand, (error) => {
      if (error) console.error(`Unable to open browser: ${error.message}`);
    });
  }
});

async function shutdown() {
  server.close();
  if (pagePromise) {
    try {
      const page = await pagePromise;
      await page.context().browser()?.close();
    } catch {
      // Browser may already be closed.
    }
  } else if (browserPromise) {
    try {
      (await browserPromise).close();
    } catch {
      // Browser may already be closed.
    }
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
