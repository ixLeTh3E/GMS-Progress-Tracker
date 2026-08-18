(() => {
  "use strict";

  const STORAGE_KEY = "gms-progress-board-v1";
  let assignmentCleanupPending = false;
  let bossPlanCleanupPending = false;
  const API_BASE = window.location.protocol === "file:" ? "http://127.0.0.1:4173" : "";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const iconPaths = {
    layout: '<path d="M4 4h6v6H4z"/><path d="M14 4h6v10h-6z"/><path d="M4 14h6v6H4z"/><path d="M14 18h6v2h-6z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    checklist: '<path d="M9 11l2 2 4-4"/><path d="M8 6H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4"/><path d="M12 12h9"/><path d="M12 17h7"/>',
    egg: '<path d="M12 2c3 3.2 7 7.7 7 12a7 7 0 0 1-14 0c0-4.3 4-8.8 7-12z"/><path d="M9 12c0 4 3 5 3 5s3-1 3-5"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 6.3"/><path d="M20 4v7h-7"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 21h14"/>',
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    alert: '<path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    grip: '<circle cx="8" cy="6" r="1.3"/><circle cx="16" cy="6" r="1.3"/><circle cx="8" cy="12" r="1.3"/><circle cx="16" cy="12" r="1.3"/><circle cx="8" cy="18" r="1.3"/><circle cx="16" cy="18" r="1.3"/>',
    scan: '<path d="M3 7V4a1 1 0 0 1 1-1h3"/><path d="M17 3h3a1 1 0 0 1 1 1v3"/><path d="M21 17v3a1 1 0 0 1-1 1h-3"/><path d="M7 21H4a1 1 0 0 1-1-1v-3"/><path d="M7 8h10v8H7z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.1.1l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1-.1l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    sword: '<path d="m4 20 6-6"/><path d="m14 10 5-5 1 1-5 5z"/><path d="m8 14-2 2 2 2 2-2z"/>',
    hex: '<path d="M12 2 3.5 7v10L12 22l8.5-5V7z"/><path d="M12 7 7.5 9.5v5L12 17l4.5-2.5v-5z"/>',
    hammer: '<path d="m14 6 4 4"/><path d="M3 21 13 11"/><path d="m11 4 3-1 7 7-1 3-5-5-4-4z"/><path d="M5 13 3 21l8-2z"/>',
    sparkles: '<path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5z"/><path d="m5 5-1 2-2 1 2 1 1 2 1-2 2-1-2-1z"/><path d="m18 14-1 2-2 1 2 1 1 2 1-2 2-1-2-1z"/>',
    gauge: '<path d="M12 3a9 9 0 0 1 8 13"/><path d="M12 12 16 8"/><path d="M21 16a9 9 0 0 1-18 0"/>',
    cube: '<path d="m12 2 8 4.5v9L12 20l-8-4.5v-9z"/><path d="m12 2 8 4.5L12 11 4 6.5z"/><path d="M12 11v9"/><path d="M4 6.5v9L12 20"/>',
    circle: '<circle cx="12" cy="12" r="9"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/>',
    settings: '<path d="M4 6h10"/><path d="M18 6h2"/><circle cx="16" cy="6" r="2"/><path d="M4 12h2"/><path d="M10 12h10"/><circle cx="8" cy="12" r="2"/><path d="M4 18h13"/><path d="M20 18h0"/><circle cx="19" cy="18" r="2"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 15H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/>',
  };

  function icon(name, size = 18) {
    const body = iconPaths[name] || iconPaths.circle;
    return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  function deepCopy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cloneSeed() {
    return deepCopy(window.SEED_DATA);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function t(key, params = {}) {
    const source = window.GMS_I18N?.[state.language]?.[key] || window.GMS_I18N?.zh?.[key] || key;
    return String(source).replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ""));
  }

  function localized(item, field = "name", fallbackField = field) {
    if (!item) return "";
    return state.language === "en" && item[`${field}En`] ? item[`${field}En`] : item[fallbackField] || "";
  }

  function localizedText(textZh, textEn) {
    return state.language === "en" && textEn ? textEn : textZh || "";
  }

  function potentialDisplayLabel(value) {
    if (state.language !== "zh") return String(value ?? "");
    return String(value ?? "")
      .replaceAll("CD Reduction", "冷却缩减")
      .replaceAll("3 Lines Crit Dmg%", "3 条暴击伤害")
      .replaceAll("2 Lines Crit Dmg%", "2 条暴击伤害")
      .replaceAll("1 Line Crit Dmg%", "1 条暴击伤害")
      .replaceAll("Lines All Stat", "条全属")
      .replaceAll("Line All Stat", "条全属")
      .replaceAll("Lines Main Stat", "条主属")
      .replaceAll("Line Main Stat", "条主属")
      .replaceAll(" and ", " + ")
      .replaceAll("Main Stat", "主属")
      .replaceAll("All Stat", "全属")
      .replaceAll("Stat", "主属");
  }

  function classCategory(style) {
    if (state.language === "en") {
      const map = {
        盗贼: "Thief",
        战士: "Warrior",
        弓箭手: "Archer",
        海盗: "Pirate",
        法师: "Mage",
      };
      return map[style.category] || style.category;
    }
    return style.category;
  }

  function characterClassName(character) {
    const style = getClassStyle(character.classKey);
    return style.label || character.classKey;
  }

  function statusLabel(status) {
    return t(`status.${status === "in-progress" ? "progress" : status}`);
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function dailyKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  function utcPeriodStart(date, dayOfWeek) {
    const copy = new Date(date);
    copy.setUTCHours(window.GMS_CONFIG.resetUtcHour, 0, 0, 0);
    const diff = (copy.getUTCDay() - dayOfWeek + 7) % 7;
    copy.setUTCDate(copy.getUTCDate() - diff);
    return copy.toISOString().slice(0, 10);
  }

  function eventWeeklyKey(date = new Date()) {
    return utcPeriodStart(date, window.GMS_CONFIG.eventResetDay);
  }

  function weeklyKey(date = new Date()) {
    return utcPeriodStart(date, window.GMS_CONFIG.weeklyResetDay);
  }

  function bossWeeklyKey(date = new Date()) {
    return utcPeriodStart(date, window.GMS_CONFIG.bossResetDay);
  }

  function nextReset(dayOfWeek = null, hour = 0) {
    const now = new Date();
    const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, 0, 0, 0));
    if (dayOfWeek !== null) {
      const diff = (dayOfWeek - next.getUTCDay() + 7) % 7;
      next.setUTCDate(next.getUTCDate() + diff);
    }
    if (next.getTime() <= now.getTime()) {
      next.setUTCDate(next.getUTCDate() + (dayOfWeek === null ? 1 : 7));
    }
    return next;
  }

  function timeTo(next) {
    const diff = Math.max(0, next.getTime() - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return `${days}d ${pad(hours)}h`;
    return `${pad(hours)}:${pad(minutes)}`;
  }

  function formatClock(date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(Math.round(value));
  }

  function formatMeso(value) {
    if (value >= 1000) {
      const billions = value / 1000;
      return `${billions >= 10 ? billions.toFixed(1) : billions.toFixed(2)}B`;
    }
    return `${Math.round(value)}M`;
  }

  function formatExp(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return "—";
    if (numeric >= 1e12) return `${(numeric / 1e12).toFixed(2).replace(/\.?0+$/, "")}T`;
    if (numeric >= 1e9) return `${(numeric / 1e9).toFixed(2).replace(/\.?0+$/, "")}B`;
    return `${(numeric / 1e6).toFixed(2).replace(/\.?0+$/, "")}M`;
  }

  function combatPowerMeta(value) {
    const combatPower = Math.max(0, Number(value) || 0);
    let tier = 0;
    let color = "#7b8494";
    if (combatPower >= 800) {
      tier = 7;
      color = "#e8a92f";
    } else if (combatPower >= 700) {
      tier = 6;
      color = "#e06a58";
    } else if (combatPower >= 600) {
      tier = 5;
      color = "#d9853f";
    } else if (combatPower >= 500) {
      tier = 4;
      color = "#856fdd";
    } else if (combatPower >= 400) {
      tier = 3;
      color = "#4d9fd6";
    } else if (combatPower >= 300) {
      tier = 2;
      color = "#35a986";
    } else if (combatPower > 0) {
      tier = 1;
      color = "#66817a";
    }
    return {
      display: `${formatNumber(combatPower)}M`,
      color,
      tier,
    };
  }

  function getClassStyle(classKey) {
    return window.CLASS_STYLES[classKey] || {
      short: String(classKey || "MS").slice(0, 2).toUpperCase(),
      color: "#8f96a8",
      category: "角色",
    };
  }

  function createInitialState() {
    const seed = cloneSeed();
    const starterCharacter = deepCopy(seed.characters[0]);
    const starterCharacterId = starterCharacter.id;
    const initialState = {
      version: 4,
      language: "zh",
      collapsedHexaGroups: [],
      hexaStatCollapsed: false,
      lastView: "overview",
      lastCharacterId: null,
      lastDetailTab: "gear",
      lastDailyTaskId: null,
      lastWeeklyTaskId: null,
      lastMuleCharacterId: null,
      lastTaskCharacterFilter: "all",
      lastTaskGroupFilter: "all",
      lastEquipmentIndex: 0,
      characters: [starterCharacter],
      taskDefinitions: seed.taskDefinitions,
      bossCatalog: seed.bossCatalog,
      dailyBossCatalog: seed.dailyBossCatalog,
      dailyBossPlans: seed.dailyBossPlans?.[starterCharacterId]
        ? { [starterCharacterId]: deepCopy(seed.dailyBossPlans[starterCharacterId]) }
        : {},
      weeklyTaskAssignments: {},
      bossMulePlans: {},
      mulePlans: seed.mulePlans?.[starterCharacterId]
        ? { [starterCharacterId]: deepCopy(seed.mulePlans[starterCharacterId]) }
        : {},
      dailyTaskAssignments: {},
      dailyKey: dailyKey(),
      eventKey: eventWeeklyKey(),
      weeklyKey: weeklyKey(),
      bossWeeklyKey: bossWeeklyKey(),
      dailyCompletions: {},
      eventCompletions: {},
      weeklyCompletions: {},
      bossCompletions: {},
      dailyBossCompletions: {},
      dailyWapUsage: {},
      dataSource: {
        type: "sample",
        url: "",
        lastSync: null,
        note: "示例数据",
      },
    };
    ensureEquipmentSchema(initialState.characters);
    ensureCharacterFlags(initialState.characters);
    return initialState;
  }

  function ensureHexaSchema(characters) {
    const defaultHexa = cloneSeed().characters[0].hexa;
    const defaultHexaStats = cloneSeed().characters[0].hexaStats;
    if (!Array.isArray(characters) || !Array.isArray(defaultHexa)) return;
    characters.forEach((character) => {
      if (Array.isArray(character.hexa) && character.hexa.length === defaultHexa.length) return;
      const oldItems = Array.isArray(character.hexa) ? character.hexa : [];
      character.hexa = defaultHexa.map((item, index) => {
        const oldItem = oldItems[index];
        if (!oldItem) return deepCopy(item);
        return {
          ...deepCopy(item),
          level: oldItem.level ?? item.level,
          targetLevel: oldItem.targetLevel ?? item.targetLevel,
          status: oldItem.status ?? item.status,
        };
      });
      if (!Array.isArray(character.hexaStats) || character.hexaStats.length !== defaultHexaStats.length) {
        character.hexaStats = deepCopy(defaultHexaStats);
      }
    });
  }

  function ensureProfessionSchema(characters) {
    const defaultProfessions = cloneSeed().characters[0].professions;
    if (!Array.isArray(characters)) return;
    characters.forEach((character) => {
      if (!Array.isArray(character.professions)) {
        character.professions = deepCopy(defaultProfessions);
        return;
      }
      const professions = character.professions.filter((item) => item.type !== "fishing");
      character.professions = (professions.length ? professions : deepCopy(defaultProfessions)).map((item, index) => {
        const template = defaultProfessions[index] || {};
        const type = item.type || template.type || "herbalism";
        const maxLevel = window.professionMaxLevel(type);
        const oldLevel = Number(item.level);
        const isLegacy = Number.isFinite(oldLevel) && oldLevel > 20;
        let level = oldLevel;
        let experience = Number(item.experience) || 0;

        if (isLegacy) {
          const ratio = Math.max(0, Math.min(1, oldLevel / 500));
          const rawLevel = ratio * maxLevel;
          level = Math.max(1, Math.min(maxLevel, Math.floor(rawLevel)));
          const fraction = rawLevel - level;
          experience = Math.round(fraction * window.professionMasteryGoal(level, type));
          if (String(item.masteryEn || "").toLowerCase() === "meister" || oldLevel >= 480) {
            level = maxLevel;
            experience = 0;
          }
        }

        const normalizedLevel =
          oldLevel === 0
            ? 0
            : Math.max(1, Math.min(maxLevel, Math.round(level) || 1));
        let targetLevel = Number(item.targetLevel);
        if (!Number.isFinite(targetLevel)) targetLevel = normalizedLevel;
        targetLevel = Math.max(normalizedLevel, Math.min(maxLevel, Math.round(targetLevel)));
        const experienceGoal = window.professionMasteryGoal(normalizedLevel, type);
        const normalizedExperience = Math.max(0, Math.min(experienceGoal, Math.round(experience) || 0));
        const rank = window.professionRankMeta(type, normalizedLevel);
        const mergedItem = {
          ...deepCopy(template),
          ...deepCopy(item),
        };
        if (!["mining", "herbalism"].includes(type)) {
          delete mergedItem.focus;
          delete mergedItem.focusEn;
        }

        return {
          ...mergedItem,
          type,
          level: normalizedLevel,
          targetLevel,
          experience: normalizedExperience,
          experienceGoal,
          mastery: rank.zh,
          masteryEn: rank.en,
        };
      });
    });
  }

  function ensureEquipmentSchema(characters) {
    const defaultEquipment = cloneSeed().characters[0].equipment;
    if (!Array.isArray(characters)) return;
    characters.forEach((character) => {
      if (!Array.isArray(character.equipment)) {
        character.equipment = deepCopy(defaultEquipment);
        return;
      }
      const currentItems = character.equipment;
      const usedItems = new Set();
      character.equipment = defaultEquipment.map((template) => {
        const sameType = currentItems.filter((item) => item.type === template.type);
        let existing = sameType.find(
          (item) =>
            !usedItems.has(item) &&
            (
              item.name === template.name ||
              item.nameEn === template.nameEn ||
              (template.type === "pendant" && template.name === "吊坠 I" && (item.name === "吊坠" || item.nameEn === "Pendant"))
            ),
        );
        if (!existing) existing = sameType.find((item) => !usedItems.has(item));
        if (existing) usedItems.add(existing);
        if (!existing) return deepCopy(template);
        const catalogEntry = (window.EQUIPMENT_CATALOG?.items || []).find((entry) => entry.id === existing.catalogId);
        const badgeUnlocked = template.type === "badge" && catalogEntry?.enhancementUnlock === true;
        const androidUnlocked = template.type === "android" && catalogEntry?.enhancementUnlock === true;
        const androidStarCap = template.type === "android" ? Number(catalogEntry?.starCap) || 0 : 0;
        const specialRing = isSpecialRingEquipment(existing);
        const specialRingLevel = specialRing
          ? Math.max(1, Math.min(6, Number(existing.specialRingLevel) || 1))
          : null;
        const isAttackType = ["weapon", "secondary", "emblem"].includes(template.type);
        const allowedPotentials = equipmentPotentialOptions(existing, character);
        const summaryDefaults = potentialSummaryOptionsForTier(
          existing,
          character,
          equipmentPotentialBoost(existing),
        );
        const defaultPotential = isAttackType
          ? summaryDefaults.at(-1)
          : summaryDefaults[Math.floor(summaryDefaults.length / 2)];
        const cannotHavePotential =
          ["pocket", "medal"].includes(template.type) ||
          template.type === "ring_special" ||
          specialRing ||
          (template.type === "badge" && !badgeUnlocked) ||
          (template.type === "android" && !androidUnlocked);
        const potential = cannotHavePotential || existing.potential === ""
          ? ""
          : allowedPotentials.includes(existing.potential)
            ? existing.potential
            : defaultPotential;
        const cannotHaveStars =
          ["emblem", "pocket", "medal"].includes(template.type) ||
          template.type === "ring_special" ||
          specialRing ||
          (template.type === "badge" && !badgeUnlocked) ||
          (template.type === "android" && !androidUnlocked);
        const existingHasSpecificName =
          existing.nameEn &&
          existing.nameEn !== template.nameEn &&
          existing.name !== template.name;
        return {
          ...deepCopy(template),
          ...deepCopy(existing),
          ...(specialRingLevel ? { specialRingLevel } : {}),
          type: template.type,
          name: catalogEntry?.name || (existingHasSpecificName ? existing.name : template.name),
          nameEn: catalogEntry?.name || (existingHasSpecificName ? existing.nameEn : template.nameEn),
          stars: cannotHaveStars ? 0 : Number.isFinite(Number(existing.stars)) ? Number(existing.stars) : template.stars,
          targetStars: cannotHaveStars ? 0 : Number.isFinite(Number(existing.targetStars)) ? Number(existing.targetStars) : template.targetStars,
          potential,
          flame: ["badge", "ring", "ring_special"].includes(template.type) ? "" : existing.flame || "",
          enhancementUnlock: badgeUnlocked || androidUnlocked,
          starCap: androidStarCap,
          status: existing.status || template.status,
        };
      });
    });
  }

  function ensureDailyTaskAssignments(data) {
    if (!data || !Array.isArray(data.characters)) return;
    if (!data.dailyTaskAssignments) data.dailyTaskAssignments = {};
    const validTasks = data.taskDefinitions.filter((task) => task.group === "daily");
    data.characters.forEach((character) => {
      const assigned = Array.isArray(data.dailyTaskAssignments[character.id])
        ? data.dailyTaskAssignments[character.id]
        : [];
      const filtered = [...new Set(
        assigned.filter((taskId) => {
          const task = validTasks.find((item) => item.id === taskId);
          return Boolean(task && taskEligibleForCharacter(task, character, data));
        }),
      )];
      if (assigned.length !== filtered.length) {
        assignmentCleanupPending = true;
      }
      data.dailyTaskAssignments[character.id] = filtered;
    });
  }

  function ensureWeeklyTaskAssignments(data) {
    if (!data || !Array.isArray(data.characters)) return;
    if (!data.weeklyTaskAssignments) data.weeklyTaskAssignments = {};
    const validTasks = data.taskDefinitions.filter((task) => task.group === "weekly");
    data.characters.forEach((character) => {
      const assigned = Array.isArray(data.weeklyTaskAssignments[character.id])
        ? data.weeklyTaskAssignments[character.id]
        : [];
      const filtered = [...new Set(
        assigned.filter((taskId) => {
          const task = validTasks.find((item) => item.id === taskId);
          return Boolean(task && taskEligibleForCharacter(task, character, data));
        }),
      )];
      if (assigned.length !== filtered.length) {
        assignmentCleanupPending = true;
      }
      data.weeklyTaskAssignments[character.id] = filtered;
    });
  }

  function ensureEventSchema(data) {
    if (!data) return;
    if (!data.eventCompletions || typeof data.eventCompletions !== "object") {
      data.eventCompletions = {};
    }
    Object.entries(data.dailyCompletions || {}).forEach(([key, value]) => {
      if (key.endsWith(":event-daily") && value === true) {
        data.eventCompletions[key] = true;
        delete data.dailyCompletions[key];
      }
    });
    if (!data.eventKey) data.eventKey = eventWeeklyKey();
  }

  function ensureBossMuleSchema(data) {
    if (!data || !Array.isArray(data.characters)) return;
    if (!data.bossMulePlans || typeof data.bossMulePlans !== "object") {
      data.bossMulePlans = {};
    }
    data.characters.forEach((character) => {
      const current = Array.isArray(data.bossMulePlans[character.id])
        ? data.bossMulePlans[character.id]
        : [];
      const filtered = current.filter((entry) => {
        const boss = (window.BOSS_MULE_CATALOG || []).find((item) => item.id === entry.bossId);
        return Boolean(boss && character.level >= (boss.minLevel || 0));
      });
      if (current.length !== filtered.length) {
        bossPlanCleanupPending = true;
      }
      data.bossMulePlans[character.id] = filtered;
    });
  }

  function ensureCharacterFlags(data) {
    if (!data || !Array.isArray(data.characters)) return;
    data.characters.forEach((character) => {
      if (typeof character.bossMule !== "boolean") character.bossMule = Boolean(character.bossMule);
      if (typeof character.expTrack !== "boolean") character.expTrack = true;
    });
  }

  function ensureTaskDefinitions(data) {
    if (!data || !Array.isArray(data.taskDefinitions)) return;
    const builtInTasks = cloneSeed().taskDefinitions.filter((task) => !task.custom);
    const builtInIds = new Set(builtInTasks.map((task) => task.id));
    const previousIds = new Set(data.taskDefinitions.map((task) => task.id));
    builtInTasks.forEach((builtInTask) => {
      const existing = data.taskDefinitions.find((task) => task.id === builtInTask.id);
      if (existing) {
        Object.assign(existing, deepCopy(builtInTask));
      } else if (!previousIds.has(builtInTask.id)) {
        data.taskDefinitions.push(deepCopy(builtInTask));
      }
    });
    const customTasks = data.taskDefinitions.filter((task) => task.custom);
    const orderedBuiltInTasks = builtInTasks
      .map((builtInTask) => data.taskDefinitions.find((task) => task.id === builtInTask.id))
      .filter(Boolean);
    data.taskDefinitions = [...orderedBuiltInTasks, ...customTasks];
    data.taskDefinitions = data.taskDefinitions.filter(
      (task) => task.custom || builtInIds.has(task.id),
    );
    const removedIds = [...previousIds].filter((id) => !builtInIds.has(id));
    Object.entries(data.dailyTaskAssignments || {}).forEach(([characterId, taskIds]) => {
      if (Array.isArray(taskIds)) {
        data.dailyTaskAssignments[characterId] = taskIds.filter((id) => !removedIds.includes(id));
      }
    });
    data.dailyCompletions = Object.fromEntries(
      Object.entries(data.dailyCompletions || {}).filter(([key]) => {
        const taskId = key.split(":").slice(1).join(":");
        return !removedIds.includes(taskId);
      }),
    );
    data.eventCompletions = Object.fromEntries(
      Object.entries(data.eventCompletions || {}).filter(([key]) => {
        const taskId = key.split(":").slice(1).join(":");
        return !removedIds.includes(taskId);
      }),
    );
    data.weeklyCompletions = Object.fromEntries(
      Object.entries(data.weeklyCompletions || {}).filter(([key]) => {
        const taskId = key.split(":").slice(1).join(":");
        return !removedIds.includes(taskId);
      }),
    );
    if (removedIds.includes(data.lastWeeklyTaskId)) {
      data.lastWeeklyTaskId = null;
    }
  }

  function ensureDailyBossSchema(data) {
    if (!data || !Array.isArray(data.characters)) return;
    const seed = cloneSeed();
    data.dailyBossCatalog = seed.dailyBossCatalog;
    if (!data.dailyBossPlans || typeof data.dailyBossPlans !== "object") {
      data.dailyBossPlans = {};
    }
    const defaultPlan =
      seed.dailyBossPlans[data.characters[0]?.id] ||
      Object.values(seed.dailyBossPlans)[0] ||
      [];
    const validBossIds = new Set(data.dailyBossCatalog.map((boss) => boss.id));
    data.characters.forEach((character) => {
      const plan = Array.isArray(data.dailyBossPlans[character.id])
        ? data.dailyBossPlans[character.id]
        : deepCopy(seed.dailyBossPlans[character.id] || defaultPlan);
      data.dailyBossPlans[character.id] = [...new Set(plan.filter((id) => validBossIds.has(id)))];
    });
    if (!data.dailyBossCompletions || typeof data.dailyBossCompletions !== "object") {
      data.dailyBossCompletions = {};
    }
    const planById = Object.fromEntries(
      data.characters.map((character) => [character.id, new Set(data.dailyBossPlans[character.id])]),
    );
    data.dailyBossCompletions = Object.fromEntries(
      Object.entries(data.dailyBossCompletions).filter(([key, value]) => {
        const [characterId, bossId] = key.split(":");
        return value === true && planById[characterId]?.has(bossId);
      }),
    );
  }

  function ensureDailyWapUsage(data) {
    if (!data || !Array.isArray(data.characters)) return;
    if (!data.dailyWapUsage || typeof data.dailyWapUsage !== "object") {
      data.dailyWapUsage = {};
    }
    data.characters.forEach((character) => {
      if (!Number.isFinite(Number(data.dailyWapUsage[character.id]))) {
        data.dailyWapUsage[character.id] = 0;
      }
    });
    data.dailyWapUsage = Object.fromEntries(
      Object.entries(data.dailyWapUsage).filter(([characterId]) =>
        data.characters.some((character) => character.id === characterId),
      ),
    );
  }

  function hasLegacyRoleNote(character) {
    const note = String(`${character?.note || ""} ${character?.noteEn || ""}`).trim().toLowerCase();
    if (!note) return false;
    const mentionsRole = /(main|alt|boss mule|主号|副号|搬蛋号|搬蛋)/i.test(note);
    const classLabels = Object.values(window.CLASS_STYLES || {})
      .map((style) => style.label)
      .filter(Boolean);
    return mentionsRole && classLabels.some((label) => note.includes(String(label).toLowerCase()));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createInitialState();
      const parsed = JSON.parse(raw);
      if (!parsed?.version || !Array.isArray(parsed.characters)) return createInitialState();
      const legacyNames = ["Feliuca", "Kaleido", "Nyx", "Aurora", "Drift", "Tide", "Ember"];
      const looksLikeLegacySample =
        parsed.version < 2 &&
        parsed.characters.length >= 2 &&
        parsed.characters.every((character) => legacyNames.includes(character.name));
      if (looksLikeLegacySample) {
        const seed = cloneSeed();
        parsed.characters = seed.characters;
        parsed.mulePlans = seed.mulePlans;
        parsed.version = 2;
      }
      const legacyMainIds = new Set(["kaleido", "FeLIca"]);
      const mainCharacterId = "feliuca";
      const hasMainCharacter = parsed.characters.some((character) => character.id === mainCharacterId);
      if (hasMainCharacter) {
        parsed.characters = parsed.characters.filter((character) => !legacyMainIds.has(character.id));
      } else {
        parsed.characters = parsed.characters.map((character) =>
          legacyMainIds.has(character.id) || character.name === "Kaleido"
            ? { ...character, id: mainCharacterId, name: "Feliuca" }
            : character,
        );
      }
      parsed.characters = parsed.characters.map((character) =>
        hasLegacyRoleNote(character) ? { ...character, note: "", noteEn: "" } : character,
      );
      const migrateCharacterKey = (target, sourceId, targetId) => {
        if (!target || typeof target !== "object") return;
        const sourceValue = target[sourceId];
        if (sourceValue === undefined) return;
        if (target[targetId] === undefined) {
          target[targetId] = sourceValue;
        }
        delete target[sourceId];
      };
      const migrateCharacterPrefix = (target, sourceId, targetId) => {
        if (!target || typeof target !== "object") return;
        for (const [key, value] of Object.entries(target)) {
          if (!key.startsWith(`${sourceId}:`)) continue;
          const nextKey = `${targetId}:${key.slice(sourceId.length + 1)}`;
          if (target[nextKey] === undefined) target[nextKey] = value;
          delete target[key];
        }
      };
      [
        "mulePlans",
        "dailyTaskAssignments",
        "weeklyTaskAssignments",
        "dailyBossPlans",
        "bossMulePlans",
        "dailyWapUsage",
      ].forEach((field) => {
        legacyMainIds.forEach((legacyId) => migrateCharacterKey(parsed[field], legacyId, mainCharacterId));
      });
      ["dailyBossCompletions", "dailyCompletions", "eventCompletions", "weeklyCompletions", "bossCompletions"].forEach((field) => {
        legacyMainIds.forEach((legacyId) => migrateCharacterPrefix(parsed[field], legacyId, mainCharacterId));
      });
      ["lastCharacterId", "lastTaskCharacterFilter", "lastMuleCharacterId"].forEach((field) => {
        if (legacyMainIds.has(parsed[field])) parsed[field] = mainCharacterId;
      });
      ensureHexaSchema(parsed.characters);
      ensureProfessionSchema(parsed.characters);
      ensureEquipmentSchema(parsed.characters);
      ensureCharacterFlags(parsed.characters);
      ensureTaskDefinitions(parsed);
      if (parsed.version < 4) parsed.dailyTaskAssignments = {};
      ensureDailyTaskAssignments(parsed);
      ensureDailyBossSchema(parsed);
      ensureDailyWapUsage(parsed);
      ensureBossMuleSchema(parsed);
      ensureWeeklyTaskAssignments(parsed);
      ensureEventSchema(parsed);
      parsed.version = 4;
      return {
        ...createInitialState(),
        ...parsed,
      };
    } catch {
      return createInitialState();
    }
  }

  function normalizePeriods() {
    const currentDaily = dailyKey();
    const currentEvent = eventWeeklyKey();
    const currentWeekly = weeklyKey();
    const currentBoss = bossWeeklyKey();
    let changed = false;

    const dailyChanged = state.dailyKey !== currentDaily;
    const eventChanged = state.eventKey !== currentEvent;
    const weeklyChanged = state.weeklyKey !== currentWeekly;
    const bossChanged = state.bossWeeklyKey !== currentBoss;

    if (dailyChanged) {
      state.dailyKey = currentDaily;
      state.dailyCompletions = {};
      state.dailyBossCompletions = {};
      state.dailyWapUsage = {};
      changed = true;
    }
    if (eventChanged) {
      state.eventKey = currentEvent;
      state.eventCompletions = {};
      changed = true;
    }
    if (weeklyChanged) {
      state.weeklyKey = currentWeekly;
      state.weeklyCompletions = {};
      changed = true;
    }
    if (bossChanged) {
      state.bossWeeklyKey = currentBoss;
      state.bossCompletions = {};
      changed = true;
    }
    if (weeklyChanged || bossChanged) {
      Object.values(state.bossMulePlans || {}).flat().forEach((entry) => {
        entry.completed = false;
      });
      changed = true;
    }
    if (changed) saveState();
    return changed;
  }

  let state = loadState();
  let currentView = state.lastView || "overview";
  let detailCharId = state.lastCharacterId || null;
  let detailTab = state.lastDetailTab || "gear";
  let taskCharFilter = state.lastTaskCharacterFilter || "all";
  let taskGroupFilter = state.lastTaskGroupFilter || "all";
  let selectedEquipmentIndex = Number.isInteger(state.lastEquipmentIndex) ? state.lastEquipmentIndex : 0;
  let selectedDailyTaskId = state.lastDailyTaskId || null;
  let selectedWeeklyTaskId = state.lastWeeklyTaskId || null;
  let selectedMuleCharacterId = state.lastMuleCharacterId || null;
  let characterSearch = "";
  let roleFilter = "all";
  let characterEditor = null;
  let taskEditor = null;
  let batchDeleteSelection = new Set();
  let batchDailyDeleteSelection = new Set();
  let batchDailyDeleteCharacterId = null;
  let batchWeeklyDeleteSelection = new Set();
  let batchWeeklyDeleteCharacterId = null;
  let dailyAddCharacterId = null;
  let dailyAddSelection = new Set();
  let weeklyAddCharacterId = null;
  let weeklyAddSelection = new Set();
  let muleAddDrafts = {};
  let eventDailyIconIndex = Math.floor(Math.random() * 4);
  let dailyBossExpanded = true;
  let collapsedHexaGroups = new Set(state.collapsedHexaGroups || []);
  let hexaStatCollapsed = Boolean(state.hexaStatCollapsed);
  let saveTimer = null;
  if (assignmentCleanupPending || bossPlanCleanupPending) saveState();
  let characterDragId = null;
  let characterDragTarget = null;
  let characterDragTimer = null;
  let characterDragStartX = 0;
  let characterDragStartY = 0;
  let orderDrag = null;
  let orderDragTarget = null;
  let orderDragStartX = 0;
  let orderDragStartY = 0;
  let overviewExpLoading = false;

  const statusMeta = {
    done: { label: "完成", color: "var(--status-done)" },
    "in-progress": { label: "进行中", color: "var(--status-progress)" },
    waiting: { label: "待处理", color: "var(--status-waiting)" },
    attention: { label: "注意", color: "var(--status-attention)" },
  };

  const statusWeight = {
    done: 1,
    "in-progress": 0.55,
    attention: 0.2,
    waiting: 0,
  };

  function saveStateNow() {
    clearTimeout(saveTimer);
    const saveStateEl = $("#saveState");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (saveStateEl) saveStateEl.textContent = t("save.saved");
    } catch {
      if (saveStateEl) saveStateEl.textContent = t("save.failed");
      showToast(state.language === "en" ? "Browser storage is disabled" : "本地保存失败，可能是浏览器存储被禁用", "error");
    }
  }

  function saveState() {
    clearTimeout(saveTimer);
    const saveStateEl = $("#saveState");
    if (saveStateEl) saveStateEl.textContent = t("save.saving");
    saveTimer = setTimeout(saveStateNow, 120);
  }

  function showToast(message, type = "success") {
    const region = $("#toastRegion");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `${icon(type === "error" ? "alert" : "check")}<span>${escapeHtml(message)}</span>`;
    region.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("is-leaving");
      setTimeout(() => toast.remove(), 220);
    }, 2800);
  }

  function getCharacter(id) {
    return state.characters.find((character) => character.id === id);
  }

  function getTask(id) {
    return state.taskDefinitions.find((task) => task.id === id);
  }

  function taskEligibleForCharacter(task, character, source = state) {
    if (!task || !character) return false;
    if (task.id === "full-boss-clear") {
      return (source.bossMulePlans?.[character.id] || []).length > 0;
    }
    return character.level >= (task.minLevel || 0);
  }

  function getBoss(id) {
    return state.bossCatalog.find((boss) => boss.id === id);
  }

  function dailyBossPlan(characterId) {
    return (state.dailyBossPlans?.[characterId] || [])
      .map((id) => state.dailyBossCatalog.find((boss) => boss.id === id))
      .filter(Boolean);
  }

  function dailyBossProgress(characterId) {
    const bosses = dailyBossPlan(characterId);
    const done = bosses.filter((boss) => state.dailyBossCompletions?.[`${characterId}:${boss.id}`]);
    return {
      total: bosses.length,
      done: done.length,
      percent: bosses.length ? (done.length / bosses.length) * 100 : 0,
    };
  }

  function isDailyBossDone(characterId, bossId) {
    return Boolean(state.dailyBossCompletions?.[`${characterId}:${bossId}`]);
  }

  function toggleDailyBoss(characterId, bossId) {
    if (!getCharacter(characterId) || !state.dailyBossCatalog.some((boss) => boss.id === bossId)) return;
    const key = `${characterId}:${bossId}`;
    if (state.dailyBossCompletions[key]) {
      delete state.dailyBossCompletions[key];
    } else {
      state.dailyBossCompletions[key] = true;
    }
    saveState();
  }

  function addDailyBoss(characterId, bossId) {
    const boss = state.dailyBossCatalog.find((item) => item.id === bossId);
    const plan = state.dailyBossPlans?.[characterId];
    if (!boss || !Array.isArray(plan) || plan.includes(bossId)) return false;
    state.dailyBossPlans[characterId] = [...plan, bossId];
    saveState();
    return true;
  }

  function deleteDailyBoss(characterId, bossId) {
    if (!Array.isArray(state.dailyBossPlans?.[characterId])) return false;
    state.dailyBossPlans[characterId] = state.dailyBossPlans[characterId].filter((id) => id !== bossId);
    delete state.dailyBossCompletions[`${characterId}:${bossId}`];
    saveState();
    return true;
  }

  function setAllDailyBosses(characterId, completed) {
    dailyBossPlan(characterId).forEach((boss) => {
      if (completed) {
        state.dailyBossCompletions[`${characterId}:${boss.id}`] = true;
      } else {
        delete state.dailyBossCompletions[`${characterId}:${boss.id}`];
      }
    });
    saveState();
  }

  function allWeeklyBossMulesComplete(characterId = null) {
    if (characterId) {
      const progress = bossPlanProgress(characterId);
      return progress.total > 0 && progress.done === progress.total;
    }
    const mules = getMuleCharacters();
    return mules.length > 0 && mules.every((character) => {
      const progress = bossPlanProgress(character.id);
      return progress.total > 0 && progress.done === progress.total;
    });
  }

  function completionMapForTask(taskId) {
    if (taskId === "event-daily") return state.eventCompletions;
    const task = getTask(taskId);
    return task?.group === "daily" ? state.dailyCompletions : state.weeklyCompletions;
  }

  function isTaskDone(taskId, characterId) {
    if (taskId === "full-boss-clear") {
      return allWeeklyBossMulesComplete(characterId);
    }
    if (taskId === "daily-bosses") {
      const progress = dailyBossProgress(characterId);
      return progress.total > 0 && progress.done === progress.total;
    }
    if (taskId === "wap") {
      return Number(state.dailyWapUsage?.[characterId] || 0) > 0;
    }
    return Boolean(completionMapForTask(taskId)[`${characterId}:${taskId}`]);
  }

  function toggleTask(taskId, characterId) {
    const task = getTask(taskId);
    if (!task || !getCharacter(characterId)) return;
    if (task.id === "daily-bosses") {
      const progress = dailyBossProgress(characterId);
      const nextValue = !(progress.total > 0 && progress.done === progress.total);
      dailyBossPlan(characterId).forEach((boss) => {
        state.dailyBossCompletions[`${characterId}:${boss.id}`] = nextValue;
      });
      saveState();
      return;
    }
    const map = completionMapForTask(taskId);
    const key = `${characterId}:${taskId}`;
    if (map[key]) {
      delete map[key];
    } else {
      map[key] = true;
    }
    saveState();
  }

  function taskApplicableCharacters(task) {
    if (task.group === "daily") {
      return state.characters.filter((character) =>
        dailyTasksForCharacter(character).some((assignedTask) => assignedTask.id === task.id),
      );
    }
    if (task.group === "weekly") {
      return state.characters.filter((character) =>
        weeklyTasksForCharacter(character).some((assignedTask) => assignedTask.id === task.id),
      );
    }
    return state.characters.filter((character) => character.level >= task.minLevel);
  }

  function dailyTasksForCharacter(character) {
    const assigned = state.dailyTaskAssignments?.[character?.id];
    const available = state.taskDefinitions.filter(
      (task) => task.group === "daily" && taskEligibleForCharacter(task, character),
    );
    if (!Array.isArray(assigned)) {
      return [];
    }
    return assigned
      .map((taskId) => available.find((task) => task.id === taskId))
      .filter(Boolean);
  }

  function weeklyTasksForCharacter(character) {
    const assigned = state.weeklyTaskAssignments?.[character?.id];
    const available = state.taskDefinitions.filter(
      (task) => task.group === "weekly" && taskEligibleForCharacter(task, character),
    );
    if (!Array.isArray(assigned)) {
      return [];
    }
    return assigned
      .map((taskId) => available.find((task) => task.id === taskId))
      .filter(Boolean);
  }

  function taskProgress(task, group = task.group) {
    const applicable = taskApplicableCharacters(task);
    const done = applicable.filter((character) => isTaskDone(task.id, character.id)).length;
    return { done, total: applicable.length, percent: applicable.length ? (done / applicable.length) * 100 : 0 };
  }

  function characterTaskProgress(characterId, group) {
    const character = getCharacter(characterId);
    const assignedTaskIds = character
      ? new Set(
          (group === "daily" ? dailyTasksForCharacter(character) : weeklyTasksForCharacter(character)).map(
            (task) => task.id,
          ),
        )
      : new Set();
    const tasks = state.taskDefinitions.filter(
      (task) =>
        task.group === group &&
        character &&
        taskEligibleForCharacter(task, character) &&
        assignedTaskIds.has(task.id),
    );
    const done = tasks.filter((task) => isTaskDone(task.id, characterId)).length;
    return { done, total: tasks.length, percent: tasks.length ? (done / tasks.length) * 100 : 0 };
  }

  function averageTaskProgress(group) {
    let done = 0;
    let total = 0;
    state.characters.forEach((character) => {
      const progress = characterTaskProgress(character.id, group);
      done += progress.done;
      total += progress.total;
    });
    return total ? (done / total) * 100 : 0;
  }

  function isBossDone(characterId, bossId) {
    return Boolean(bossPlan(characterId).find((entry) => entry.id === bossId)?.completed);
  }

  function toggleBoss(characterId, bossId) {
    const character = getCharacter(characterId);
    const entry = bossPlan(characterId).find((item) => item.id === bossId);
    if (!character || !entry) return;
    entry.completed = !entry.completed;
    saveState();
  }

  function bossPlan(characterId) {
    return state.bossMulePlans?.[characterId] || [];
  }

  function getBossMuleBoss(bossId) {
    return (window.BOSS_MULE_CATALOG || []).find((boss) => boss.id === bossId);
  }

  function getBossMuleDifficulty(bossId, difficultyId) {
    return getBossMuleBoss(bossId)?.difficulties.find((difficulty) => difficulty.id === difficultyId) || null;
  }

  function bossMuleEntryMeso(entry) {
    const difficulty = getBossMuleDifficulty(entry.bossId, entry.difficultyId);
    if (!difficulty) return 0;
    const partySize = Math.max(1, Number(entry.partySize) || 1);
    return Math.round(Number(difficulty.mesos || 0) / partySize);
  }

  function topBossMuleEntries(entries) {
    return entries
      .map((entry) => ({ entry, mesos: bossMuleEntryMeso(entry) }))
      .sort((left, right) => right.mesos - left.mesos)
      .slice(0, 14)
      .map((item) => item.entry);
  }

  function bossPlanProgress(characterId) {
    const bosses = bossPlan(characterId);
    const topEntries = topBossMuleEntries(bosses);
    const doneEntries = bosses.filter((entry) => entry.completed);
    const topDone = topEntries.filter((entry) => entry.completed);
    return {
      total: bosses.length,
      done: doneEntries.length,
      income: topDone.reduce((sum, entry) => sum + bossMuleEntryMeso(entry), 0),
      potentialIncome: topEntries.reduce((sum, entry) => sum + bossMuleEntryMeso(entry), 0),
      percent: bosses.length ? (doneEntries.length / bosses.length) * 100 : 0,
    };
  }

  function getMuleCharacters() {
    return state.characters.filter((character) => character.bossMule && bossPlan(character.id).length > 0);
  }

  function overallBossSummary() {
    const mules = getMuleCharacters();
    const summaries = mules.map((character) => bossPlanProgress(character.id));
    return {
      characters: mules.length,
      totalBosses: summaries.reduce((sum, item) => sum + item.total, 0),
      doneBosses: summaries.reduce((sum, item) => sum + item.done, 0),
      income: summaries.reduce((sum, item) => sum + item.income, 0),
      potentialIncome: summaries.reduce((sum, item) => sum + item.potentialIncome, 0),
      percent: summaries.length
        ? summaries.reduce((sum, item) => sum + item.percent, 0) / summaries.length
        : 0,
    };
  }

  function equipmentScore(character) {
    const items = character.equipment || [];
    if (!items.length) return 0;
    return (items.reduce((sum, item) => sum + (statusWeight[item.status] || 0), 0) / items.length) * 100;
  }

  function professionsScore(character) {
    const items = character.professions || [];
    if (!items.length) return 0;
    return (items.reduce((sum, item) => sum + (statusWeight[item.status] || 0), 0) / items.length) * 100;
  }

  function hexaScore(character) {
    const resources = hexaResourceTotals(character);
    if (!resources.goalFragments) return 0;
    return Math.min(100, (resources.spentFragments / resources.goalFragments) * 100);
  }

  function overallCharacterScore(character) {
    return hexaScore(character);
  }

  function averageStars(character) {
    const starable = starCountableItems(character);
    return starable.length ? starable.reduce((sum, item) => sum + item.stars, 0) / starable.length : 0;
  }

  function starCountableItems(character) {
    return (character.equipment || []).filter((item) => {
      if (item.type === "pocket") return false;
      if (["emblem", "medal", "badge"].includes(item.type)) return item.stars > 0;
      return item.stars > 0;
    });
  }

  function totalStars(character) {
    return starCountableItems(character).reduce((sum, item) => sum + item.stars, 0);
  }

  function equipmentCatalogEntry(item) {
    if (!item?.catalogId) return null;
    return (window.EQUIPMENT_CATALOG?.items || []).find((entry) => entry.id === item.catalogId) || null;
  }

  function isSpecialRingEquipment(item) {
    if (item?.type === "ring_special") return true;
    return equipmentCatalogEntry(item)?.slot === "ring_special";
  }

  function specialRingEffectData(item) {
    const entry = equipmentCatalogEntry(item);
    return entry ? window.SPECIAL_RING_EFFECTS?.[entry.id] || null : null;
  }

  function canEquipmentHaveStars(item) {
    if (["emblem", "pocket", "medal"].includes(item?.type)) return false;
    if (isSpecialRingEquipment(item)) return false;
    if (item?.type === "badge") return Boolean(item.enhancementUnlock);
    if (item?.type === "android") return Boolean(item.enhancementUnlock);
    return true;
  }

  function canEquipmentHavePotential(item) {
    if (isSpecialRingEquipment(item)) return false;
    if (["pocket", "medal"].includes(item?.type)) return false;
    if (item?.type === "badge") return Boolean(item.enhancementUnlock);
    if (item?.type === "android") return Boolean(item.enhancementUnlock);
    return true;
  }

  function maxEquipmentStars(item) {
    if (isSpecialRingEquipment(item)) return 0;
    if (item?.type === "android") return Number(item.starCap) || 0;
    return 30;
  }

  function equipmentItemLevel(item) {
    const catalogLevel = Number(item?.catalogLevel);
    if (Number.isFinite(catalogLevel)) return catalogLevel;
    return Number(item?.level) || 0;
  }

  function equipmentPotentialBoost(item) {
    return equipmentItemLevel(item) >= 160;
  }

  function isXenonCharacter(character) {
    return character?.classKey === "Xenon";
  }

  function isMagicAttackCharacter(character) {
    return getClassStyle(character?.classKey)?.category === "法师";
  }

  function potentialSummaryOptionsForTier(item, character, highTier) {
    const isAttackType = ["weapon", "secondary", "emblem"].includes(item?.type);
    const usesMagicAttack = isMagicAttackCharacter(character);
    if (isAttackType) {
      if (usesMagicAttack) {
        return highTier
          ? window.EQUIPMENT_POTENTIAL_MATT_OPTIONS_HIGH
          : window.EQUIPMENT_POTENTIAL_MATT_OPTIONS_LOW;
      }
      return highTier
        ? window.EQUIPMENT_POTENTIAL_ATT_OPTIONS_HIGH
        : window.EQUIPMENT_POTENTIAL_ATT_OPTIONS_LOW;
    }
    if (isXenonCharacter(character)) {
      return highTier
        ? window.EQUIPMENT_POTENTIAL_XENON_ALL_OPTIONS_HIGH
        : window.EQUIPMENT_POTENTIAL_XENON_ALL_OPTIONS_LOW;
    }
    return highTier
      ? window.EQUIPMENT_POTENTIAL_MAIN_OPTIONS_HIGH
      : window.EQUIPMENT_POTENTIAL_MAIN_OPTIONS_LOW;
  }

  function potentialHatLineOptions(character, highTier) {
    if (isXenonCharacter(character)) {
      return highTier
        ? window.EQUIPMENT_POTENTIAL_XENON_HAT_LINES_HIGH
        : window.EQUIPMENT_POTENTIAL_XENON_HAT_LINES_LOW;
    }
    return highTier
      ? window.EQUIPMENT_POTENTIAL_NORMAL_HAT_LINES_HIGH
      : window.EQUIPMENT_POTENTIAL_NORMAL_HAT_LINES_LOW;
  }

  function equipmentPotentialOptionsForTier(item, character, highTier) {
    if (item?.type === "secondary") {
      return [
        ...new Set([
          ...potentialSummaryOptionsForTier(item, character, false),
          ...potentialSummaryOptionsForTier(item, character, true),
        ]),
      ].sort(
        (left, right) =>
          Number(left.match(/(\d+)/)?.[1] || 0) -
          Number(right.match(/(\d+)/)?.[1] || 0),
      );
    }
    if (!["hat", "gloves"].includes(item?.type)) {
      return [...potentialSummaryOptionsForTier(item, character, highTier)];
    }
    const summaryOptions = potentialSummaryOptionsForTier(item, character, highTier);
    if (item?.type === "gloves") {
      return [
        ...summaryOptions,
        ...window.buildPotentialCritDamageOptions(
          isXenonCharacter(character) ? "All Stat" : "Main Stat",
        ),
      ];
    }
    const lineOptions = potentialHatLineOptions(character, highTier);
    return [
      ...summaryOptions,
      ...window.EQUIPMENT_POTENTIAL_HAT_CD_OPTIONS,
      ...window.buildPotentialCdOneLineOptions(lineOptions),
      ...window.buildPotentialCdTwoLineOptions(lineOptions),
    ];
  }

  function equipmentPotentialOptions(item, character) {
    return equipmentPotentialOptionsForTier(item, character, equipmentPotentialBoost(item));
  }

  function equipmentAttackPotentialSummary(character) {
    const usesMagicAttack = isMagicAttackCharacter(character);
    const suffix = usesMagicAttack ? "MATT" : "ATT";
    const total = (character.equipment || [])
      .filter((item) => ["weapon", "secondary", "emblem"].includes(item.type))
      .reduce((sum, item) => {
        const potential = String(item.potential || "");
        if (!potential.includes(`% ${suffix}`)) return sum;
        return sum + Number(potential.match(/(\d+)(?=%\s*(?:ATT|MATT)\b)/)?.[1] || 0);
      }, 0);
    return `${total}% ${suffix}`;
  }

  function equipmentMainStatPotentialSummary(character) {
    const suffix = isXenonCharacter(character) ? "All Stat" : "Main Stat";
    const total = (character.equipment || [])
      .filter(
        (item) =>
          !["weapon", "secondary", "emblem", "hat", "gloves"].includes(item.type) &&
          String(item.potential || "").includes(`% ${suffix}`),
      )
      .reduce((sum, item) => {
        const match = String(item.potential || "").match(
          new RegExp(`(\\d+)(?=%\\s*(?:Main Stat|All Stat)\\b)`),
        );
        return sum + Number(match?.[1] || 0);
      }, 0);
    return `${total}% ${suffix}`;
  }

  function hatCdReductionSummary(character) {
    const hat = (character.equipment || []).find((item) => item.type === "hat");
    const match = String(hat?.potential || "").match(/-(\d+)sec\+ CD Reduction/);
    return match ? `-${match[1]}s CD` : "—";
  }

  function glovesCritDamageSummary(character) {
    const gloves = (character.equipment || []).find((item) => item.type === "gloves");
    const potential = String(gloves?.potential || "");
    const lines = potential.includes("3 Lines Crit Dmg%")
      ? 3
      : potential.includes("2 Lines Crit Dmg%")
        ? 2
        : potential.includes("1 Line Crit Dmg%")
          ? 1
          : 0;
    if (!lines) return "—";
    return state.language === "zh" ? `${lines} 条暴击伤害` : `${lines}L Crit Dmg`;
  }

  function characterEquipmentSets(character) {
    const items = character.equipment || [];
    return (window.EQUIPMENT_SET_EFFECTS || []).map((set) => {
      const matchedGroups = new Set();
      const matchedItems = [];
      items.forEach((item) => {
        const entry = equipmentCatalogEntry(item);
        const matchedItem = entry?.name ? { ...item, name: entry.name } : item;
        if (set.match(entry, matchedItem)) {
          matchedGroups.add(set.groupKey?.(entry, matchedItem) || matchedItem.name || item.type);
          matchedItems.push(item);
        }
      });
      const occupiedTypes = new Set(matchedItems.map((item) => item.type));
      const luckyArmorItems = items.filter((item) =>
        window.LUCKY_EQUIPMENT_RULES?.affectsArmorSets(item),
      );
      const luckyBonus =
        Boolean(set.armorSet) &&
        matchedItems.length > 0 &&
        luckyArmorItems.some((item) => !occupiedTypes.has(item.type));
      const count = Math.min(set.max, matchedGroups.size + Number(luckyBonus));
      const tierEntries = Object.entries(set.tiers || {})
        .map(([required, effect]) => ({ required: Number(required), effect }))
        .sort((left, right) => left.required - right.required);
      const active = tierEntries.filter((tier) => tier.required <= count).at(-1);
      const next = tierEntries.find((tier) => tier.required > count);
      return { ...set, count, active, next };
    });
  }

  function renderEquipmentSetSummary(character) {
    const sets = characterEquipmentSets(character).filter((set) => set.count > 0);
    if (!sets.length) return "";
    return `
        <section class="equipment-set-summary">
        <div class="equipment-set-heading">
          <h3>${t("detail.setEffects")}</h3>
        </div>
        ${sets
          .map(
            (set) => `
              <button class="equipment-set-row is-active" type="button" data-set-effect-detail="${escapeHtml(set.id)}" style="--set-color:${set.color}">
                <div class="equipment-set-row-head">
                  <strong>${escapeHtml(state.language === "en" ? set.nameEn : set.nameZh)}</strong>
                  <b>${set.count}/${set.max}</b>
                </div>
                <div class="equipment-set-progress">
                  <span style="width:${Math.min(100, (set.count / Math.max(1, set.max)) * 100)}%"></span>
                </div>
                <div class="equipment-set-copy">
                  ${set.active
                    ? `<span>${t("detail.setActive")} ${setTierLabel(set.active.required)}</span><p>${escapeHtml(set.active.effect)}</p>`
                    : `<span>${t("detail.setPending")}</span>`}
                  ${set.next
                    ? `<small>${t("detail.setNext")} ${setTierLabel(set.next.required)} · ${escapeHtml(set.next.effect)}</small>`
                    : set.active
                      ? `<small>MAX</small>`
                      : `<small>${t("detail.setEffectsPending")}</small>`}
                </div>
              </button>
            `,
          )
          .join("")}
      </section>
    `;
  }

  function setTierLabel(required) {
    return state.language === "zh" ? `${required}件` : `${required} Set${required > 1 ? "s" : ""}`;
  }

  function openSetEffectModal(setId) {
    const set = (window.EQUIPMENT_SET_EFFECTS || []).find((entry) => entry.id === setId);
    if (!set) return;
    const character = getCharacter(detailCharId);
    const progress = character
      ? characterEquipmentSets(character).find((entry) => entry.id === setId)
      : null;
    const activeCount = Number(progress?.count) || 0;
    $("#setEffectTitle").textContent = state.language === "en" ? set.nameEn : set.nameZh;
    $("#setEffectBody").style.setProperty("--set-color", set.color);
    $("#setEffectBody").innerHTML = Object.entries(set.tiers || {})
      .map(([required, effect]) => [Number(required), effect])
      .sort((left, right) => left[0] - right[0])
      .map(
        ([required, effect]) => `
          <div class="set-effect-detail-row ${required <= activeCount ? "is-active" : ""}">
            <span>${setTierLabel(required)}</span>
            <p>${escapeHtml(effect)}</p>
          </div>
        `,
      )
      .join("");
    $("#setEffectModal").showModal();
  }

  function roleLabel(character) {
    if (character.role === "main") return t("role.main");
    if (character.role === "alt") return t("role.alt");
    return t("role.mule");
  }

  function characterRoleMarker(character) {
    if (character.role === "mule") {
      return `<img class="role-marker role-marker-mule" src="assets/ui/role-mule.png" alt="" aria-hidden="true" />`;
    }
    const tier = character.role === "main" ? "Destiny" : "Genesis";
    const primaryType = window.CLASS_WEAPONS?.[character.classKey]?.primary;
    const groups = new Set(armorClassGroups(character));
    const weapon = (window.EQUIPMENT_CATALOG?.items || []).find(
      (item) =>
        item.slot === "weapon" &&
        item.weaponType === primaryType &&
        groups.has(item.classGroup) &&
        (item.name?.toLowerCase().startsWith(tier.toLowerCase()) ||
          item.setName?.toLowerCase().startsWith(tier.toLowerCase())),
    );
    if (weapon?.icon) {
      return `<img class="role-marker role-weapon-marker" src="${escapeHtml(weapon.icon)}" alt="" aria-hidden="true" />`;
    }
    return `<span class="role-marker ${character.role === "main" ? "role-marker-main" : "role-marker-alt"}" aria-hidden="true">${character.role === "main" ? "⭐" : "◆"}</span>`;
  }

  function overviewCharacterNote(character) {
    const note = localized(character, "note");
    return note && !hasLegacyRoleNote(character) ? note : roleLabel(character);
  }

  function clearCharacterDragState() {
    clearTimeout(characterDragTimer);
    characterDragTimer = null;
    document.body.classList.remove("is-character-dragging");
    $$(".character-drag-handle.is-dragging, [data-character-id].is-drag-target").forEach((element) => {
      element.classList.remove("is-dragging", "is-drag-target");
    });
    characterDragId = null;
    characterDragTarget = null;
  }

  function clearOrderDragState() {
    document.body.classList.remove("is-order-dragging");
    $$(".order-drag-handle.is-dragging, [data-order-item-id].is-order-target").forEach((element) => {
      element.classList.remove("is-dragging", "is-order-target");
    });
    orderDrag = null;
    orderDragTarget = null;
  }

  function reorderCharacters(draggedId, targetId, before) {
    const fromIndex = state.characters.findIndex((character) => character.id === draggedId);
    let targetIndex = state.characters.findIndex((character) => character.id === targetId);
    if (fromIndex < 0 || targetIndex < 0 || fromIndex === targetIndex) return false;
    const [dragged] = state.characters.splice(fromIndex, 1);
    targetIndex = state.characters.findIndex((character) => character.id === targetId);
    state.characters.splice(targetIndex + (before ? 0 : 1), 0, dragged);
    saveState();
    return true;
  }

  function renderResetStrip() {
    const daily = nextReset(null, window.GMS_CONFIG.resetUtcHour);
    const event = nextReset(window.GMS_CONFIG.eventResetDay, window.GMS_CONFIG.resetUtcHour);
    const weekly = nextReset(window.GMS_CONFIG.weeklyResetDay, window.GMS_CONFIG.resetUtcHour);
    const boss = nextReset(window.GMS_CONFIG.bossResetDay, window.GMS_CONFIG.resetUtcHour);
    $("#resetStrip").innerHTML = `
      <div class="reset-item">
        <span class="reset-label">${t("reset.utc")}</span>
        <strong>${formatClock(new Date())}</strong>
      </div>
      <div class="reset-item">
        <span class="reset-label">${t("reset.daily")}</span>
        <strong>${timeTo(daily)}</strong>
      </div>
      <div class="reset-item">
        <span class="reset-label">${t("reset.event")}</span>
        <strong>${timeTo(event)}</strong>
      </div>
      <div class="reset-item">
        <span class="reset-label">${t("reset.weekly")}</span>
        <strong>${timeTo(weekly)}</strong>
      </div>
      <div class="reset-item">
        <span class="reset-label">${t("reset.boss")}</span>
        <strong>${timeTo(boss)}</strong>
      </div>
    `;
  }

  function setView(view) {
    currentView = view;
    if (view !== "characters") {
      detailCharId = null;
    }
    state.lastView = view;
    state.lastCharacterId = detailCharId;
    state.lastDetailTab = detailTab;
    state.lastTaskCharacterFilter = taskCharFilter;
    state.lastTaskGroupFilter = taskGroupFilter;
    saveStateNow();
    render();
  }

  function setLanguage(language) {
    if (!["zh", "en"].includes(language)) return;
    state.language = language;
    saveState();
    render();
  }

  function openTaskGroup(characterId, group) {
    taskCharFilter = characterId;
    taskGroupFilter = group;
    setView("tasks");
  }

  function toggleHexaGroup(categoryEn) {
    if (collapsedHexaGroups.has(categoryEn)) {
      collapsedHexaGroups.delete(categoryEn);
    } else {
      collapsedHexaGroups.add(categoryEn);
    }
    state.collapsedHexaGroups = [...collapsedHexaGroups];
    saveState();
    render();
  }

  function toggleHexaStatSection() {
    hexaStatCollapsed = !hexaStatCollapsed;
    state.hexaStatCollapsed = hexaStatCollapsed;
    saveState();
    render();
  }

  function render() {
    const pageTitles = {
      overview: t("page.overview"),
      characters: t("page.characters"),
      tasks: taskGroupFilter === "weekly" ? t("tasks.weekly") : t("tasks.daily"),
      mules: t("page.mules"),
      data: t("page.data"),
    };
    $("#pageTitle").textContent = pageTitles[currentView] || t("page.overview");
    $$(".nav-item").forEach((item) => {
      const effectiveTaskGroup = taskGroupFilter === "all" ? "daily" : taskGroupFilter;
      const taskGroupActive =
        item.dataset.view !== "tasks" ||
        item.dataset.taskGroup === effectiveTaskGroup;
      item.classList.toggle("is-active", item.dataset.view === currentView && taskGroupActive);
    });
    $$("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    $$("[data-tooltip-i18n]").forEach((element) => {
      element.setAttribute("data-tooltip", t(element.dataset.tooltipI18n));
    });
    $$("[data-language]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.language === state.language);
    });
    const content = $("#content");
    if (currentView === "overview") content.innerHTML = renderOverview();
    if (currentView === "characters") content.innerHTML = detailCharId ? renderCharacterDetail() : renderCharacters();
    if (currentView === "tasks") content.innerHTML = renderTasks();
    if (currentView === "mules") content.innerHTML = renderMules();
    if (currentView === "data") content.innerHTML = renderDataView();

    closeSidebar();
  }

  function progressBar(percent, className = "") {
    const safe = Math.max(0, Math.min(100, percent));
    return `<div class="progress-track ${className}"><span class="progress-fill" style="width:${safe}%"></span></div>`;
  }

  function classAvatar(character, size = "md") {
    const style = getClassStyle(character.classKey);
    const avatar = character.avatarDataUrl
      ? `<img class="character-avatar" src="${escapeHtml(character.avatarDataUrl)}" alt="${escapeHtml(character.name)}" />`
      : escapeHtml(style.short);
    return `<span class="class-avatar class-avatar-${size}" style="--class-color:${style.color}">${avatar}</span>`;
  }

  function classJobThumbnail(classKey, extraClass = "") {
    const source = window.CLASS_THUMBNAILS?.[classKey] || "";
    if (!source) return "";
    return `<img class="class-job-thumbnail ${extraClass}" src="${escapeHtml(source)}" alt="" loading="lazy" />`;
  }

  function characterDragHandle(characterId) {
    return `<span class="character-drag-handle" data-character-drag-handle="${escapeHtml(characterId)}" role="button" tabindex="0" aria-label="${t("characters.reorder")}">${icon("grip", 14)}</span>`;
  }

  function orderDragHandle(kind, characterId, itemId) {
    return `<span class="character-drag-handle order-drag-handle" data-order-drag-handle="${escapeHtml(kind)}" data-order-kind="${escapeHtml(kind)}" data-order-character-id="${escapeHtml(characterId)}" data-order-item-id="${escapeHtml(itemId)}" role="button" tabindex="0" aria-label="${t("characters.reorder")}">${icon("grip", 14)}</span>`;
  }

  function overviewExpCell(character) {
    const metrics = character.expMetrics;
    const excluded = metrics?.state === "excluded";
    const ready = metrics?.state === "ready" && Number.isFinite(Number(metrics.sevenDayExp));
    return `
      <div class="character-exp-overview ${ready ? "has-data" : ""} ${excluded ? "is-excluded" : ""}" data-character-exp="${escapeHtml(character.id)}" title="${excluded ? t("overview.expExcluded") : metrics?.lastUpdated ? `${t("overview.expUpdatedAt", { date: metrics.lastUpdated })}` : t("overview.expUnavailable")}">
        <span><small>${t("overview.expYesterday")}</small><b>${ready ? formatExp(metrics.yesterdayExp) : "—"}</b></span>
        <span><small>${t("overview.exp7d")}</small><b>${ready ? formatExp(metrics.sevenDayExp) : "—"}</b></span>
        <span><small>${t("overview.exp7dAvg")}</small><b>${ready ? formatExp(metrics.averageSevenDayExp) : "—"}</b></span>
        <span><small>${t("overview.expEta")}</small><b>${ready && Number.isFinite(Number(metrics.nextLevelDays)) ? `${Number(metrics.nextLevelDays).toFixed(1)}d` : "—"}</b></span>
      </div>
    `;
  }

  function orderCollection(kind, characterId) {
    if (kind === "daily-task") return state.dailyTaskAssignments?.[characterId] || [];
    if (kind === "weekly-task") return state.weeklyTaskAssignments?.[characterId] || [];
    if (kind === "daily-boss") return state.dailyBossPlans?.[characterId] || [];
    if (kind === "mule-boss") return state.bossMulePlans?.[characterId] || [];
    return [];
  }

  function setOrderCollection(kind, characterId, items) {
    if (kind === "daily-task") state.dailyTaskAssignments[characterId] = items;
    if (kind === "weekly-task") state.weeklyTaskAssignments[characterId] = items;
    if (kind === "daily-boss") state.dailyBossPlans[characterId] = items;
    if (kind === "mule-boss") state.bossMulePlans[characterId] = items;
  }

  function orderItemId(item) {
    return typeof item === "object" && item ? item.id : item;
  }

  function reorderOrderedCollection(kind, characterId, draggedId, targetId, before) {
    const items = orderCollection(kind, characterId);
    const fromIndex = items.findIndex((item) => orderItemId(item) === draggedId);
    const targetIndex = items.findIndex((item) => orderItemId(item) === targetId);
    if (fromIndex < 0 || targetIndex < 0 || fromIndex === targetIndex) return false;
    const [dragged] = items.splice(fromIndex, 1);
    const nextTargetIndex = items.findIndex((item) => orderItemId(item) === targetId);
    items.splice(nextTargetIndex + (before ? 0 : 1), 0, dragged);
    setOrderCollection(kind, characterId, items);
    saveState();
    return true;
  }

  function renderOverview() {
    const muleStats = overallBossSummary();
    const dailyAverage = averageTaskProgress("daily");
    const weeklyAverage = averageTaskProgress("weekly");

    const overviewRows = state.characters
      .map((character) => {
        const hexa = hexaScore(character);
        const noteText = overviewCharacterNote(character);
        return `
          <div class="character-table-row" data-character-id="${escapeHtml(character.id)}">
            ${characterDragHandle(character.id)}
            <button class="character-jump-cell row-character" type="button" data-overview-jump="characters">
              ${classAvatar(character, "sm")}
              ${classJobThumbnail(character.classKey, "class-job-overview")}
              <span><strong>${escapeHtml(character.name)}</strong><small>${escapeHtml(character.server)} · ${escapeHtml(characterClassName(character))}</small></span>
            </button>
            <button class="character-jump-cell level-cell" type="button" data-overview-jump="characters">${character.level}</button>
            <button class="character-jump-cell note-cell" type="button" data-edit-char="${escapeHtml(character.id)}" title="${t("detail.editProfile")}" style="display:flex;align-items:center;justify-content:flex-start;gap:5px;">
              ${characterRoleMarker(character)}<span>${escapeHtml(noteText)}</span>
            </button>
            ${overviewExpCell(character)}
            <button class="character-jump-cell mini-progress" type="button" data-overview-jump="characters">${progressBar(hexa, "progress-hexa")}<b>${Math.round(hexa)}%</b></button>
          </div>
        `;
      })
      .join("");

    return `
      <div class="kpi-grid">
        <article class="kpi-card kpi-accent">
          <div class="kpi-top">${icon("users", 18)}<span>${t("kpi.characters")}</span></div>
          <strong>${state.characters.length}</strong>
          <small>${t("kpi.charactersSub", { main: state.characters.filter((c) => c.role === "main").length, alt: state.characters.filter((c) => c.role === "alt").length, mule: state.characters.filter((c) => c.role === "mule").length })}</small>
        </article>
        <article class="kpi-card">
          <div class="kpi-top">${icon("checklist", 18)}<span>${t("kpi.daily")}</span></div>
          <strong>${Math.round(dailyAverage)}<em>%</em></strong>
          <small>${progressBar(dailyAverage)}</small>
        </article>
        <article class="kpi-card">
          <div class="kpi-top">${icon("clock", 18)}<span>${t("kpi.weekly")}</span></div>
          <strong>${Math.round(weeklyAverage)}<em>%</em></strong>
          <small>${progressBar(weeklyAverage)}</small>
        </article>
        <article class="kpi-card kpi-meso">
          <div class="kpi-top">${icon("egg", 18)}<span>${t("kpi.meso")}</span></div>
          <strong>${formatMeso(Math.round(muleStats.income / 1e6))}</strong>
          <small>${t("kpi.bosses", { done: muleStats.doneBosses, total: muleStats.totalBosses })}</small>
        </article>
      </div>

      <section class="panel panel-wide">
        <div class="panel-heading">
          <div>
            <h2>${t("overview.characters")}</h2>
          </div>
          <div class="overview-character-heading-actions">
            <button class="button button-ghost button-small" type="button" data-refresh-exp-overview ${overviewExpLoading ? "disabled" : ""}>
              ${icon("refresh", 14)} ${overviewExpLoading ? t("overview.expLoading") : t("overview.refreshExp")}
            </button>
            <button class="button button-ghost button-small" data-view="characters">${t("overview.allCharacters")} ${icon("chevron", 14)}</button>
          </div>
        </div>
        <div class="character-table-head">
          <span></span><span>${t("table.character")}</span><span>${t("table.level")}</span><span>${t("table.note")}</span><span>${t("table.exp")}</span><span>${t("table.hexa")}</span>
        </div>
        <div class="character-table">${overviewRows}</div>
      </section>

      <section class="panel overview-pulse-panel">
        <div class="panel-heading">
          <div>
            <h2>${t("overview.dailyPulse")}</h2>
          </div>
        </div>
        <div class="overview-daily-modules">
          ${renderDailyOverviewModules()}
        </div>
      </section>

      <section class="panel overview-pulse-panel">
        <div class="panel-heading">
          <div>
            <h2>${t("overview.weeklyPulse")}</h2>
          </div>
        </div>
        <div class="overview-daily-modules">
          ${renderWeeklyOverviewModules()}
        </div>
      </section>

      <section class="panel overview-pulse-panel">
        <div class="panel-heading">
          <div>
            <h2>${t("overview.bossMulePulse")}</h2>
          </div>
        </div>
        <div class="overview-daily-modules overview-boss-mule-modules">
          ${renderBossMuleOverviewModules()}
        </div>
      </section>
    `;
  }

  async function refreshOverviewExp() {
    if (overviewExpLoading || !state.characters.length) return;
    overviewExpLoading = true;
    render();
    let updated = 0;
    state.characters.forEach((character) => {
      if (character.expTrack === false) {
        character.expMetrics = { state: "excluded", fetchedAt: Date.now() };
      }
    });
    for (const character of state.characters.filter((item) => item.expTrack !== false)) {
      try {
        const response = await fetch(
          `${API_BASE}/api/character-exp?name=${encodeURIComponent(character.name)}&region=${encodeURIComponent(character.region || "NA")}`,
        );
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || t("overview.expError"));
        }
        const data = await response.json();
        character.expMetrics = {
          ...data,
          state: "ready",
          fetchedAt: Date.now(),
        };
        updated += 1;
      } catch (error) {
        character.expMetrics = {
          state: "error",
          message: error.message || t("overview.expError"),
          fetchedAt: Date.now(),
        };
      }
      saveState();
      render();
    }
    overviewExpLoading = false;
    render();
    showToast(updated ? t("overview.expUpdated", { count: updated }) : t("overview.expError"), updated ? "success" : "error");
  }

  function renderCategoryPulses(group) {
    const categories = {};
    state.taskDefinitions.forEach((task) => {
      if (group && task.group !== group) return;
      if (!categories[task.category]) categories[task.category] = [];
      categories[task.category].push(task);
    });

    return Object.entries(categories)
      .map(([category, tasks]) => {
        const total = tasks.reduce((sum, task) => sum + taskApplicableCharacters(task).length, 0);
        const done = tasks.reduce((sum, task) => sum + taskApplicableCharacters(task).filter((char) => isTaskDone(task.id, char.id)).length, 0);
        const percent = total ? (done / total) * 100 : 0;
        return `
          <div class="category-pulse ${group === "daily" ? "pulse-daily" : "pulse-weekly"}">
            <div class="category-pulse-head"><span>${escapeHtml(localized(tasks[0], "category"))}</span><b>${done}/${total}</b></div>
            ${progressBar(percent)}
          </div>
        `;
      })
      .join("");
  }

  function renderDailyOverviewModules() {
    const dailyTasks = state.taskDefinitions.filter((task) => task.group === "daily");
    const cards = dailyTasks
      .map((task) => {
        const characters = taskApplicableCharacters(task);
        if (!characters.length) return "";
        const doneCount = characters.filter((character) => isTaskDone(task.id, character.id)).length;
        const percent = (doneCount / characters.length) * 100;
        const allDone = doneCount === characters.length;
        const wapTotal =
          task.id === "wap"
            ? characters.reduce(
                (sum, character) => sum + Number(state.dailyWapUsage?.[character.id] || 0),
                0,
              )
            : null;
        return `
          <button class="overview-daily-task-card ${allDone ? "is-complete" : ""}" type="button" data-overview-daily-task="${escapeHtml(task.id)}" data-character-id="${escapeHtml(characters[0].id)}">
            <span class="overview-daily-task-head">
              <span class="daily-task-symbol">${dailyTaskIcon(task)}</span>
              <span>
                <strong>${escapeHtml(localized(task, "name"))}</strong>
                <small>${escapeHtml(localized(task, "category"))}</small>
              </span>
            </span>
            <span class="overview-daily-character-row">
              ${characters
                .map((character) => {
                  const done = isTaskDone(task.id, character.id);
                  return `
                    <span class="overview-daily-character ${done ? "is-done" : ""}" title="${escapeHtml(character.name)}">
                      ${classAvatar(character, "xs")}
                      ${done ? `<b>${icon("check", 9)}</b>` : ""}
                    </span>
                  `;
                })
                .join("")}
            </span>
            <span class="overview-daily-progress">
              <small>${doneCount}/${characters.length}</small>
              ${progressBar(percent)}
            </span>
            ${wapTotal !== null ? `<span class="overview-daily-wap">${icon("sparkles", 13)}${t("overview.wapTotal", { count: wapTotal })}<small>${t("wap.duration")}</small></span>` : ""}
          </button>
        `;
      })
      .join("");
    return cards || `<div class="overview-daily-empty">${icon("checklist", 26)}<span>${t("overview.noDailyTasks")}</span></div>`;
  }

  function renderWeeklyOverviewModules() {
    const weeklyTasks = state.taskDefinitions.filter((task) => task.group === "weekly");
    const cards = weeklyTasks
      .map((task) => {
        const characters = taskApplicableCharacters(task);
        if (!characters.length) return "";
        const doneCount = characters.filter((character) => isTaskDone(task.id, character.id)).length;
        const percent = (doneCount / characters.length) * 100;
        const allDone = doneCount === characters.length;
        return `
          <button class="overview-daily-task-card overview-weekly-task-card ${allDone ? "is-complete" : ""}" type="button" data-overview-weekly-task="${escapeHtml(task.id)}" data-character-id="${escapeHtml(characters[0].id)}">
            <span class="overview-daily-task-head">
              <span class="daily-task-symbol">${weeklyTaskIcon(task)}</span>
              <span>
                <strong>${escapeHtml(localized(task, "name"))}</strong>
                <small>${escapeHtml(localized(task, "category"))}</small>
              </span>
            </span>
            <span class="overview-daily-character-row">
              ${characters
                .map((character) => {
                  const done = isTaskDone(task.id, character.id);
                  return `
                    <span class="overview-daily-character ${done ? "is-done" : ""}" title="${escapeHtml(character.name)}">
                      ${classAvatar(character, "xs")}
                      ${done ? `<b>${icon("check", 9)}</b>` : ""}
                    </span>
                  `;
                })
                .join("")}
            </span>
            <span class="overview-daily-progress">
              <small>${doneCount}/${characters.length}</small>
              ${progressBar(percent, "progress-weekly")}
            </span>
          </button>
        `;
      })
      .join("");
    return cards || `<div class="overview-daily-empty">${icon("clock", 26)}<span>${t("weekly.emptySlots")}</span></div>`;
  }

  function renderBossMuleOverviewModules() {
    const mules = state.characters
      .filter((character) => character.bossMule && bossPlan(character.id).length > 0)
      .sort((a, b) => bossPlanProgress(b.id).potentialIncome - bossPlanProgress(a.id).potentialIncome);
    const cards = mules
      .map((character) => {
        const progress = bossPlanProgress(character.id);
        const complete = progress.total > 0 && progress.done === progress.total;
        return `
          <button class="overview-boss-mule-card ${complete ? "is-complete" : ""}" type="button" data-overview-boss-mule-character="${escapeHtml(character.id)}">
            <span class="overview-boss-mule-head">
              ${classAvatar(character, "sm")}
              <span>
                <strong>${escapeHtml(character.name)}</strong>
                <small>${escapeHtml(characterClassName(character))} · Lv.${character.level}</small>
              </span>
            </span>
            <span class="overview-daily-progress">
              <small>${progress.done}/${progress.total}</small>
              ${progressBar(progress.percent, "progress-boss")}
            </span>
            <span class="overview-boss-mule-income">
              <small>${t("mule.earnedWeekly")}</small><b>${formatMeso(Math.round(progress.income / 1e6))}</b>
              <small>${t("mule.expectedWeekly")}</small><b>${formatMeso(Math.round(progress.potentialIncome / 1e6))}</b>
            </span>
          </button>
        `;
      })
      .join("");
    return cards || `<div class="overview-daily-empty">${icon("egg", 26)}<span>${t("mule.emptyMules")}</span></div>`;
  }

  function renderCharacters() {
    const filtered = state.characters.filter((character) => {
      const query = characterSearch.trim().toLowerCase();
      const matchesQuery = !query || character.name.toLowerCase().includes(query) || character.classKey.toLowerCase().includes(query);
      const matchesRole = roleFilter === "all" || character.role === roleFilter;
      return matchesQuery && matchesRole;
    });

    return `
      <div class="toolbar">
        <div class="segmented-control" role="group" aria-label="角色类型">
          <button class="${roleFilter === "all" ? "is-active" : ""}" data-role-filter="all">${t("characters.all")}</button>
          <button class="${roleFilter === "main" ? "is-active" : ""}" data-role-filter="main">${t("characters.main")}</button>
          <button class="${roleFilter === "alt" ? "is-active" : ""}" data-role-filter="alt">${t("characters.alt")}</button>
          <button class="${roleFilter === "mule" ? "is-active" : ""}" data-role-filter="mule">${t("characters.mule")}</button>
        </div>
        <label class="search-field">
          ${icon("search", 16)}
          <input id="characterSearch" type="search" value="${escapeHtml(characterSearch)}" placeholder="${t("characters.search")}" />
        </label>
        <div class="character-toolbar-actions">
          <button class="button button-ghost button-small" data-new-character>${icon("users", 14)} ${t("characters.new")}</button>
          <button class="button button-primary button-small" data-lookup-open>${icon("search", 14)} ${t("characters.lookup")}</button>
        </div>
        <span class="result-count">${t("characters.count", { count: filtered.length })}</span>
      </div>

      <div class="character-grid">
        ${filtered
          .map((character) => {
            const style = getClassStyle(character.classKey);
            const hexa = hexaScore(character);
            const combat = combatPowerMeta(character.stats?.combatPower);
            return `
              <article class="character-card" style="--class-color:${style.color}" data-open-char="${escapeHtml(character.id)}" data-character-id="${escapeHtml(character.id)}">
                <div class="character-card-head">
                  ${characterDragHandle(character.id)}
                  ${classAvatar(character, "lg")}
                  <div class="character-card-title">
                    <span class="role-pill role-${character.role}">${roleLabel(character)}</span>
                    <h2><button class="character-name-button" type="button" data-edit-char="${escapeHtml(character.id)}">${escapeHtml(character.name)}</button></h2>
                    ${classJobThumbnail(character.classKey, "class-job-card")}
                    <p>${escapeHtml(characterClassName(character))} · ${escapeHtml(character.server)}</p>
                  </div>
                  <div class="level-block"><strong>${character.level}</strong><small>${t("characters.level")}</small></div>
                </div>
                <div class="character-card-body">
                  <div class="score-row">
                    <span>${t("characters.hexa")}</span><span class="score-track">${progressBar(hexa)}</span><b>${Math.round(hexa)}%</b>
                  </div>
                  <div class="card-stat-grid">
                    <span><small>${t("characters.combatPower")}</small><b style="color:${combat.color}">${combat.display}</b></span>
                    <span><small>${t("characters.averageStars")}</small><b>${averageStars(character).toFixed(1)}</b></span>
                  </div>
                </div>
                <div class="character-card-footer">
                  <span>${escapeHtml(localized(character, "note"))}</span>
                  <div class="character-card-actions">
                    <b>${Math.round(hexa)}%</b>
                  </div>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
      ${filtered.length ? "" : `<div class="empty-state">${icon("search", 28)}<p>${t("characters.noMatch")}</p></div>`}
    `;
  }

  function renderCharacterDetail() {
    const character = getCharacter(detailCharId);
    if (!character) return "";
    const style = getClassStyle(character.classKey);
    const stats = character.stats || {};
    const hexa = hexaScore(character);
    const isXenon = character.classKey === "Xenon";
    const xenonStats = stats.xenonStats || { str: 0, luk: 0, dex: 0 };
    const combat = combatPowerMeta(stats.combatPower);

    return `
      <button class="back-button" data-back-to-characters>${icon("back", 16)} ${t("detail.back")}</button>
      <section class="character-hero" style="--class-color:${style.color}" data-edit-char="${escapeHtml(character.id)}">
        <button class="character-hero-main character-edit-button" type="button" data-edit-char="${escapeHtml(character.id)}">
          ${classAvatar(character, "xl")}
          <div>
            <div class="hero-tags">
              <span class="role-pill role-${character.role}">${roleLabel(character)}</span>
              <span class="role-pill role-server">${escapeHtml(character.server)}</span>
            </div>
            <h1><span class="character-hero-name-button">${escapeHtml(character.name)}</span></h1>
            ${classJobThumbnail(character.classKey, "class-job-hero")}
            <p>${escapeHtml(characterClassName(character))} · Lv.${character.level} · ${escapeHtml(localized(character, "note"))}</p>
          </div>
        </button>
        <div class="character-hero-actions">
          <button class="button button-ghost button-small button-danger-text" data-delete-char="${escapeHtml(character.id)}">${icon("trash", 14)} ${t("detail.delete")}</button>
          <div class="character-hero-score">
            <span>${t("detail.hexaTab")}</span>
            <strong>${Math.round(hexa)}<em>%</em></strong>
          </div>
        </div>
      </section>

      <div class="character-detail-grid">
        <aside class="stat-panel panel">
          <div class="panel-heading compact">
            <div><h2>${t("detail.statPanel")}</h2></div>
          </div>
          <div class="stat-panel-grid ${isXenon ? "is-xenon" : ""}">
            ${isXenon
              ? `
                <div class="xenon-main-stat">
                  <div data-edit-char="${escapeHtml(character.id)}"><small>STR</small><strong>${formatNumber(xenonStats.str)}</strong></div>
                  <div data-edit-char="${escapeHtml(character.id)}"><small>DEX</small><strong>${formatNumber(xenonStats.dex)}</strong></div>
                  <div data-edit-char="${escapeHtml(character.id)}"><small>LUK</small><strong>${formatNumber(xenonStats.luk)}</strong></div>
                </div>
              `
              : `
                <div class="stat-panel-cell" data-edit-char="${escapeHtml(character.id)}"><small>${t("detail.mainStat")}</small><strong>${escapeHtml(stats.main || "—")}</strong><span>${stats.mainStat ? formatNumber(stats.mainStat) : "—"}</span></div>
              `}
            <div class="stat-panel-cell combat-power-cell" data-edit-char="${escapeHtml(character.id)}"><small>${t("characters.combatPower")}</small><strong style="color:${combat.color}">${combat.display}</strong><span>${escapeHtml(stats.secondary || "")}</span></div>
          </div>
          <div class="stat-requirements">
            <strong>${t("detail.statRequirementsTitle")}</strong>
            <p>${t("detail.statRequirements")}</p>
          </div>
          <div class="stat-rows stat-rows-unbounded">
            ${renderUnboundedStatRow(t(isMagicAttackCharacter(character) ? "detail.magicAttack" : "detail.attack"), formatNumber(stats.att || 0), "attack", character.id)}
            ${renderUnboundedStatRow(t("detail.boss"), `${stats.boss ?? 0}%`, "bd", character.id)}
            ${renderUnboundedStatRow(t("detail.damage"), `${stats.damage ?? 0}%`, "bd", character.id)}
            ${renderUnboundedStatRow(t("detail.ied"), `${stats.ied ?? 0}%`, "ied", character.id)}
            ${renderUnboundedStatRow(t("detail.critDamage"), `${stats.critDamage ?? 0}%`, "crit", character.id)}
          </div>
          <div class="equipment-potential-summary">
            <div data-edit-char="${escapeHtml(character.id)}"><span>${t(isMagicAttackCharacter(character) ? "detail.totalMagicAttackPotential" : "detail.totalAttackPotential")}</span><b>${escapeHtml(equipmentAttackPotentialSummary(character))}</b></div>
            <div data-edit-char="${escapeHtml(character.id)}"><span>${t(isXenon ? "detail.otherAllStatPotential" : "detail.otherStatPotential")}</span><b>${escapeHtml(equipmentMainStatPotentialSummary(character))}</b></div>
            <div data-edit-char="${escapeHtml(character.id)}"><span>${t("detail.hatCdPotential")}</span><b>${escapeHtml(hatCdReductionSummary(character))}</b></div>
            <div data-edit-char="${escapeHtml(character.id)}"><span>${t("detail.glovesCritPotential")}</span><b>${escapeHtml(glovesCritDamageSummary(character))}</b></div>
          </div>
          <div class="symbol-block">
            <div class="symbol-cell" data-edit-char="${escapeHtml(character.id)}"><img src="assets/ui/arcane-symbol.png" alt="ARC" /><span><small>${t("detail.arc")}</small><b>${stats.arcane ?? "—"}</b></span></div>
            <div class="symbol-cell" data-edit-char="${escapeHtml(character.id)}"><img src="assets/ui/sacred-symbol.png" alt="SAC" /><span><small>${t("detail.sac")}</small><b>${stats.sacred ?? "—"}</b></span></div>
          </div>
          ${renderEquipmentSetSummary(character)}
        </aside>

        <section class="panel detail-main-panel">
          <div class="detail-tabs" role="tablist">
            <button class="${detailTab === "gear" ? "is-active" : ""}" data-detail-tab="gear">${icon("cube", 15)} ${t("detail.equipmentTab")}</button>
            <button class="${detailTab === "hexa" ? "is-active" : ""}" data-detail-tab="hexa">${icon("hex", 15)} ${t("detail.hexaTab")}</button>
            <button class="${detailTab === "professions" ? "is-active" : ""}" data-detail-tab="professions">${icon("hammer", 15)} ${t("detail.professionsTab")}</button>
          </div>
          <div class="detail-tab-content">
            ${detailTab === "gear" ? renderGearDetail(character) : detailTab === "hexa" ? renderHexaDetail(character) : renderProfessionsDetail(character)}
          </div>
        </section>
      </div>
    `;
  }

  function renderUnboundedStatRow(label, display, tone, characterId) {
    return `
      <div class="stat-row stat-row-unbounded tone-${escapeHtml(tone)}" data-edit-char="${escapeHtml(characterId)}">
        <div><span>${label}</span><b>${escapeHtml(display)}</b></div>
      </div>
    `;
  }

  function renderStatusActions(kind, index, currentStatus) {
    return `
      <div class="progress-actions">
        ${["done", "in-progress", "waiting"]
          .map(
            (status) => `
              <button class="progress-action status-${status} ${currentStatus === status ? "is-active" : ""}" data-set-status="${kind}" data-item-index="${index}" data-status="${status}">
                ${statusLabel(status)}
              </button>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function renderAllStatusActions(kind) {
    return `
      <div class="detail-edit-toolbar">
        <button class="button button-ghost button-small" data-set-all-status="${kind}" data-status="done">${icon("check", 13)} ${t("detail.markDone")}</button>
        <button class="button button-ghost button-small" data-set-all-status="${kind}" data-status="waiting">${icon("refresh", 13)} ${t("detail.markReset")}</button>
      </div>
    `;
  }

  function equipmentIcon(type) {
    const icons = {
      weapon: "sword",
      secondary: "cube",
      emblem: "sparkles",
      hat: "cube",
      top: "cube",
      bottom: "cube",
      gloves: "cube",
      cape: "cube",
      shoes: "cube",
      belt: "cube",
      pendant: "sparkles",
      ring: "circle",
      ring_special: "sparkles",
      pocket: "cube",
      face: "sparkles",
      eye: "sparkles",
      earrings: "sparkles",
      medal: "sparkles",
      badge: "sparkles",
      android: "cube",
      shoulder: "cube",
    };
    return icon(icons[type] || "cube", 17);
  }

  function armorClassGroup(character) {
    return armorClassGroups(character)[0] || "Common";
  }

  function armorClassGroups(character) {
    const style = getClassStyle(character?.classKey);
    if (Array.isArray(style.groups) && style.groups.length) return style.groups;
    const groups = {
      战士: "Warrior",
      法师: "Magician",
      弓箭手: "Bowman",
      盗贼: "Thief",
      海盗: "Pirate",
    };
    return [groups[style.category] || "Common"];
  }

  function equipmentTypeIcon(type, character) {
    const group = armorClassGroup(character) || "Common";
    const mapping = window.EQUIPMENT_TYPE_ICONS;
    if (type === "weapon") {
      return mapping?.weapon?.[group] || mapping?.weapon?.Common || "";
    }
    if (type === "secondary") {
      return mapping?.secondary?.[group] || mapping?.secondary?.Common || "";
    }
    const armorLabels = {
      emblem: "Emblem",
      hat: "Hat",
      top: "Top",
      bottom: "Bottom",
      gloves: "Gloves",
      cape: "Cape",
      shoes: "Shoes",
      belt: "Belt",
      shoulder: "Shoulder",
      pendant: "Pendant",
      ring: "Ring",
      ring_special: "Ring",
      pocket: "Pocket Item",
      face: "Face Accessory",
      eye: "Eye Accessory",
      earrings: "Earrings",
      medal: "Medal",
      badge: "Badge",
      android: "Android",
    };
    return mapping?.armor?.[armorLabels[type]] || "";
  }

  function catalogEntriesForSlot(slot, character) {
    const groups = armorClassGroups(character);
    const jobWeapons = window.CLASS_WEAPONS?.[character.classKey];
    const base = (window.EQUIPMENT_CATALOG?.items || []).filter(
      (item) =>
        (groups.includes(item.classGroup) || item.classGroup === "Common") &&
        (item.classGroup === "Common" || item.slot === "secondary" || item.level >= 150),
    );
    if (slot === "weapon" && jobWeapons?.primary) {
      const primaryTypes = Array.isArray(jobWeapons.primary) ? jobWeapons.primary : [jobWeapons.primary];
      return base.filter((item) => item.slot === "weapon" && primaryTypes.includes(item.weaponType));
    }
    if (slot === "secondary" && jobWeapons?.secondary) {
      const secondaryTypes = Array.isArray(jobWeapons.secondary) ? jobWeapons.secondary : [jobWeapons.secondary];
      return base.filter((item) => item.slot === "secondary" && secondaryTypes.includes(item.weaponType));
    }
    if (slot === "emblem" && jobWeapons?.emblem) {
      const emblemTypes = Array.isArray(jobWeapons.emblem) ? jobWeapons.emblem : [jobWeapons.emblem];
      return base.filter(
        (item) => item.slot === "emblem" && (!item.emblemType || emblemTypes.includes(item.emblemType)),
      );
    }
    if (slot === "ring") {
      const rings = base.filter((item) => item.slot === "ring" || item.slot === "ring_special");
      return [
        ...rings.filter((item) => item.slot === "ring_special"),
        ...rings.filter((item) => item.slot === "ring"),
      ];
    }
    if (slot === "ring_special") {
      return base.filter((item) => item.slot === "ring_special");
    }
    return base.filter(
      (item) => item.slot === slot || (item.slot === "overall" && (slot === "top" || slot === "bottom")),
    );
  }

  function renderEquipmentCatalogSearch(index, item, character, query = "") {
    const entries = catalogEntriesForSlot(item.type, character);
    const normalizedQuery = String(query || "").trim().toLowerCase();
    const selectedEntry = (window.EQUIPMENT_CATALOG?.items || []).find((entry) => entry.id === item.catalogId);
    const filtered = normalizedQuery
      ? entries.filter((entry) => entry.name.toLowerCase().includes(normalizedQuery))
      : entries;
    const visible = filtered.slice(0, 12);
    return `
      <div class="equipment-catalog-searchbox ${item.catalogId ? "is-collapsed" : ""}">
        <div class="equipment-catalog-search-row">
          <span class="equipment-catalog-search-icon">${icon("search", 15)}</span>
          <input
            class="equipment-catalog-search"
            type="text"
            autocomplete="off"
            placeholder="${t("equipment.catalogSearch")}"
            value="${escapeHtml(query || selectedEntry?.name || "")}"
            data-equipment-catalog-search="${index}"
          />
          ${item.catalogId ? `<button class="equipment-catalog-clear" type="button" data-equipment-catalog-clear="${index}" aria-label="Clear">${icon("x", 13)}</button>` : ""}
        </div>
        <div class="equipment-catalog-results" data-equipment-catalog-results="${index}">
          ${!normalizedQuery && !item.catalogId ? `
            <button class="equipment-catalog-search-option" type="button" data-equipment-catalog-search-choose="" data-equipment-catalog-index="${index}">
              <span class="equipment-catalog-search-icon">${icon("refresh", 14)}</span>
              <span>${t("equipment.catalogDefault")}</span>
            </button>
          ` : ""}
          ${visible
            .map(
              (entry) => `
                <button class="equipment-catalog-search-option ${item.catalogId === entry.id ? "is-selected" : ""}" type="button" data-equipment-catalog-search-choose="${escapeHtml(entry.id)}" data-equipment-catalog-index="${index}">
                  <img class="equipment-catalog-search-image" src="${escapeHtml(entry.icon)}" alt="" loading="lazy" />
                  <span><b>${escapeHtml(entry.name)}</b><small>Lv.${entry.level} · ${escapeHtml(entry.setName)}</small></span>
                </button>
              `,
            )
            .join("")}
          ${normalizedQuery && !visible.length ? `<div class="equipment-catalog-empty">${t("equipment.catalogNoMatch")}</div>` : ""}
        </div>
      </div>
    `;
  }

  function updateEquipmentCatalogSearch(input) {
    const character = getCharacter(detailCharId);
    const index = Number(input.dataset.equipmentCatalogSearch);
    const item = character?.equipment?.[index];
    if (!item) return;
    const results = document.querySelector(`[data-equipment-catalog-results="${index}"]`);
    if (!results) return;
    input.closest(".equipment-catalog-searchbox")?.classList.remove("is-collapsed");
    const query = String(input.value || "").trim().toLowerCase();
    const entries = catalogEntriesForSlot(item.type, character).filter((entry) =>
      entry.name.toLowerCase().includes(query),
    );
    const visible = entries.slice(0, 12);
    results.innerHTML = `
      ${!query && !item.catalogId ? `
        <button class="equipment-catalog-search-option" type="button" data-equipment-catalog-search-choose="" data-equipment-catalog-index="${index}">
          <span class="equipment-catalog-search-icon">${icon("refresh", 14)}</span>
          <span>${t("equipment.catalogDefault")}</span>
        </button>
      ` : ""}
      ${visible
        .map(
          (entry) => `
            <button class="equipment-catalog-search-option ${item.catalogId === entry.id ? "is-selected" : ""}" type="button" data-equipment-catalog-search-choose="${escapeHtml(entry.id)}" data-equipment-catalog-index="${index}">
              <img class="equipment-catalog-search-image" src="${escapeHtml(entry.icon)}" alt="" loading="lazy" />
              <span><b>${escapeHtml(entry.name)}</b><small>Lv.${entry.level} · ${escapeHtml(entry.setName)}</small></span>
            </button>
          `,
        )
        .join("")}
      ${query && !visible.length ? `<div class="equipment-catalog-empty">${t("equipment.catalogNoMatch")}</div>` : ""}
    `;
  }

  function equipmentVisual(item, character) {
    if (item?.catalogIcon) {
      return `
        <img class="equipment-catalog-image" src="${escapeHtml(item.catalogIcon)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'" />
        <span class="equipment-fallback-icon" style="display:none">${equipmentIcon(item.type)}</span>
      `;
    }
    const typeIcon = equipmentTypeIcon(item?.type, character);
    if (typeIcon) {
      return `
        <img class="equipment-catalog-image" src="${escapeHtml(typeIcon)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'" />
        <span class="equipment-fallback-icon" style="display:none">${equipmentIcon(item.type)}</span>
      `;
    }
    return equipmentIcon(item?.type);
  }

  function renderSpecialRingEffectPanel(item, index) {
    const effectData = specialRingEffectData(item);
    if (!effectData) return "";
    const maxLevel = Number(effectData.maxLevel) || 6;
    const level = Math.max(1, Math.min(maxLevel, Number(item.specialRingLevel) || 1));
    const effect = effectData.levels?.[level];
    if (!effect) return "";
    return `
      <div class="equipment-edit-row equipment-special-ring-editor">
        <label class="equipment-potential-field">
          <span>${t("equipment.specialRingLevel")}</span>
          <select data-equipment-special-ring-level="${index}">
            ${Array.from({ length: maxLevel }, (_, offset) => offset + 1)
              .map(
                (option) => `
                  <option value="${option}" ${level === option ? "selected" : ""}>Lv.${option}</option>
                `,
              )
              .join("")}
          </select>
        </label>
        <div class="equipment-special-ring-effect">
          <div class="equipment-special-ring-effect-head">
            <span>${t("equipment.specialRingEffect")}</span>
            <a href="${escapeHtml(effectData.wiki || "#")}" target="_blank" rel="noreferrer">${t("equipment.specialRingWiki")}</a>
          </div>
          <strong>${escapeHtml(effect.primary)}</strong>
          <div class="equipment-special-ring-meta">
            <span>${t("equipment.specialRingDuration")}<b>${escapeHtml(effect.duration)}</b></span>
            <span>${t("equipment.specialRingCooldown")}<b>${escapeHtml(effect.cooldown)}</b></span>
            <span>${t("equipment.specialRingCost")}<b>${escapeHtml(effect.hpCost)}</b></span>
          </div>
          <small>${t("equipment.specialRingNoStars")} · ${t("equipment.specialRingPotential")}</small>
        </div>
      </div>
    `;
  }

  function renderGearDetail(character) {
    const items = character.equipment || [];
    const selectedIndex = Math.max(0, Math.min(items.length - 1, selectedEquipmentIndex || 0));
    const selectedItem = items[selectedIndex];
    const catalogItems = catalogEntriesForSlot(selectedItem?.type, character);
    const isHatPotential = selectedItem?.type === "hat";
    const isGlovesPotential = selectedItem?.type === "gloves";
    const potentialBoost = equipmentPotentialBoost(selectedItem);
    const potentialOptions = equipmentPotentialOptions(selectedItem, character);
    const summaryOptions = potentialSummaryOptionsForTier(selectedItem, character, potentialBoost);
    const hatCdOptions = window.EQUIPMENT_POTENTIAL_HAT_CD_OPTIONS;
    const hatLineOptions = potentialHatLineOptions(character, potentialBoost);
    const hatCdOneLineOptions = window.buildPotentialCdOneLineOptions(hatLineOptions);
    const hatCdTwoLineOptions = window.buildPotentialCdTwoLineOptions(hatLineOptions);
    const critOptions = window.buildPotentialCritDamageOptions(
      isXenonCharacter(character) ? "All Stat" : "Main Stat",
    );
    const potentialOptionMarkup = (potential) => `
      <option value="${escapeHtml(potential)}" ${selectedItem.potential === potential ? "selected" : ""}>${escapeHtml(potentialDisplayLabel(potential))}</option>
    `;
    const potentialOptionsMarkup = isHatPotential
      ? `
        <optgroup label="${isXenonCharacter(character) ? t("equipment.potentialAll") : t("equipment.potentialMainAll")}">
          ${summaryOptions.map(potentialOptionMarkup).join("")}
        </optgroup>
        <optgroup label="${t("equipment.potentialCd")}">
          ${hatCdOptions.map(potentialOptionMarkup).join("")}
        </optgroup>
        <optgroup label="${t("equipment.potentialCdOneLine")}">
          ${hatCdOneLineOptions.map(potentialOptionMarkup).join("")}
        </optgroup>
        <optgroup label="${t("equipment.potentialCdTwoLine")}">
          ${hatCdTwoLineOptions.map(potentialOptionMarkup).join("")}
        </optgroup>
      `
      : isGlovesPotential
        ? `
          <optgroup label="${isXenonCharacter(character) ? t("equipment.potentialAll") : t("equipment.potentialMainAll")}">
            ${summaryOptions.map(potentialOptionMarkup).join("")}
          </optgroup>
          <optgroup label="${t("equipment.potentialCrit")}">
            ${critOptions.map(potentialOptionMarkup).join("")}
          </optgroup>
        `
      : potentialOptions.map(potentialOptionMarkup).join("");
    const done = items.filter((item) => item.status === "done").length;
    const inProgress = items.filter((item) => item.status === "in-progress").length;
    const waiting = items.filter((item) => item.status === "waiting").length;
    const score = equipmentScore(character);
    const leftFaceSlotOrder = [17, 18, 23, 10, 11];
    const leftRingSlotOrder = [12, 13, 14, 15, 24, 16];
    const centerSlotOrder = [0, 1, 2];
    const rightArmorSlotOrder = [3, 4, 5, 22, 9];
    const rightMainSlotOrder = [7, 6, 8, 21, 19, 20];

    const equipmentSlot = (item, index) => {
      const selected = index === selectedIndex;
      const specialRingLevel = isSpecialRingEquipment(item) ? Number(item.specialRingLevel) || null : null;
      return `
        <button
          class="equipment-slot status-${item.status} ${selected ? "is-selected" : ""}"
          type="button"
          data-equipment-select="${index}"
          aria-pressed="${selected}"
        >
          <span class="equipment-slot-icon">${equipmentVisual(item, character)}</span>
          <span class="equipment-slot-copy">
            <b>${escapeHtml(localized(item, "name"))}</b>
            ${canEquipmentHaveStars(item) ? `<small class="star-value" data-progress-output="equipment-${index}">${item.stars}<i>★</i>${item.targetStars != null ? ` / ${item.targetStars}★` : ""}</small>` : ""}
            ${specialRingLevel ? `<small class="equipment-slot-ring-level">Lv.${specialRingLevel}</small>` : ""}
            ${canEquipmentHavePotential(item) ? `<small class="equipment-slot-potential">${escapeHtml(potentialDisplayLabel(item.potential || (state.language === "en" ? "Uncubed" : "未洗")))}</small>` : ""}
          </span>
          <span class="status-dot"></span>
        </button>
      `;
    };

    return `
      ${renderAllStatusActions("equipment")}
      <div class="detail-summary">
        <div><span>${t("detail.loadout")}</span><b>${Math.round(score)}%</b></div>
        <div><span>${t("detail.totalStars")}</span><b>${totalStars(character)}</b></div>
        <div><span>${t("detail.averageStars")}</span><b>${averageStars(character).toFixed(1)}</b></div>
        <div><span>${t("detail.completedSlots")}</span><b>${done}/${items.length}</b></div>
        <div><span>${t("detail.pendingSlots")}</span><b>${waiting}</b></div>
      </div>
      <div class="equipment-layout">
        <div class="equipment-paperdoll">
          <div class="equipment-left-secondary">${leftRingSlotOrder.map((index) => equipmentSlot(items[index], index)).join("")}</div>
          <div class="equipment-left-primary">${leftFaceSlotOrder.map((index) => equipmentSlot(items[index], index)).join("")}</div>
          <button class="equipment-avatar equipment-avatar-button" type="button" data-edit-char="${escapeHtml(character.id)}">
            <div class="equipment-avatar-figure">
              <span class="equipment-avatar-glow" aria-hidden="true"></span>
              ${classAvatar(character, "equipment")}
            </div>
            <div class="equipment-avatar-caption">
              <strong>${escapeHtml(character.name)}</strong>
              <span>${escapeHtml(characterClassName(character))} · Lv.${character.level}</span>
            </div>
          </button>
          <div class="equipment-right-secondary">${rightArmorSlotOrder.map((index) => equipmentSlot(items[index], index)).join("")}</div>
          <div class="equipment-right-primary">${rightMainSlotOrder.map((index) => equipmentSlot(items[index], index)).join("")}</div>
          <div class="equipment-center-weapons">${centerSlotOrder.map((index) => equipmentSlot(items[index], index)).join("")}</div>
        </div>
        ${selectedItem ? `
          <aside class="equipment-inspector">
            <div class="equipment-inspector-head">
              <span class="equipment-slot-icon">${equipmentVisual(selectedItem, character)}</span>
              <div>
                <span class="eyebrow">${t("equipment.selected")}</span>
                <h3>${escapeHtml(localized(selectedItem, "name"))}</h3>
              </div>
              <span class="status-dot"></span>
            </div>
            ${catalogItems.length ? `
              <div class="equipment-catalog-field">
                <span>${t("equipment.catalog")}</span>
                ${renderEquipmentCatalogSearch(selectedIndex, selectedItem, character)}
              </div>
            ` : ""}
            <div class="equipment-edit-rows">
              ${renderSpecialRingEffectPanel(selectedItem, selectedIndex)}
              ${canEquipmentHaveStars(selectedItem) ? `
              <div class="equipment-edit-row">
                <div class="equipment-edit-label">
                  <span>${t("progress.stars")}</span>
                  <strong class="star-value" data-progress-output="equipment-${selectedIndex}">${selectedItem.stars}<i>★</i>${selectedItem.targetStars != null ? ` / ${selectedItem.targetStars}★` : ""}</strong>
                </div>
                <div class="progress-number-editor">
                  <label>${t("progress.current")}<input class="progress-number-input" type="number" min="0" max="${maxEquipmentStars(selectedItem)}" data-progress-number="equipment" data-item-index="${selectedIndex}" data-progress-field="stars" value="${selectedItem.stars}" /></label>
                  <label>${t("progress.target")}<input class="progress-number-input" type="number" min="0" max="${maxEquipmentStars(selectedItem)}" data-progress-number="equipment" data-item-index="${selectedIndex}" data-progress-field="targetStars" value="${selectedItem.targetStars ?? selectedItem.stars}" /></label>
                </div>
              </div>
              ` : ""}
              ${canEquipmentHavePotential(selectedItem) ? `
              <div class="equipment-edit-row">
                <label class="equipment-potential-field">
                  <span>${t("equipment.potential")}${potentialBoost ? ` · Lv.${equipmentItemLevel(selectedItem)} +${isXenonCharacter(character) ? 3 : 1}` : ""}</span>
                  <select data-equipment-potential="${selectedIndex}">
                    <option value="">${t("equipment.uncubed")}</option>
                    ${potentialOptionsMarkup}
                  </select>
                </label>
              </div>
              ` : ""}
            </div>
            <p class="equipment-inspector-note">${escapeHtml(localized(selectedItem, "note") || statusLabel(selectedItem.status))}</p>
            ${renderStatusActions("equipment", selectedIndex, selectedItem.status)}
          </aside>
        ` : ""}
      </div>
      <div class="detail-legend">
        <span><i class="legend-dot status-done"></i>${t("detail.legendDone", { count: done })}</span>
        <span><i class="legend-dot status-progress"></i>${t("detail.legendProgress", { count: inProgress })}</span>
        <span><i class="legend-dot status-waiting"></i>${t("detail.legendWaiting", { count: waiting })}</span>
      </div>
    `;
  }

  function renderProfessionsDetail(character) {
    const items = character.professions || [];
    return `
      ${renderAllStatusActions("professions")}
      <div class="detail-summary">
        <div><span>${t("detail.professionScore")}</span><b>${Math.round(professionsScore(character))}%</b></div>
        <div><span>${t("detail.professionCount")}</span><b>${items.length}</b></div>
        <div><span>${t("detail.highestLevel")}</span><b>${Math.max(0, ...items.map((item) => item.level || 0))}</b></div>
      </div>
      <div class="profession-grid">
        ${items
          .map(
            (item, index) => {
              const maxLevel = window.professionMaxLevel(item.type);
              const experienceGoal = window.professionMasteryGoal(item.level, item.type);
              const experience = Math.max(0, Math.min(experienceGoal, Number(item.experience) || 0));
              const experiencePercent = experienceGoal ? (experience / experienceGoal) * 100 : 100;
              const rank = window.professionRankMeta(item.type, item.level);
              const rankLabel = state.language === "en" ? rank.en : rank.zh;
              const focusLabel = localized(item, "focus");
              return `
              <div class="profession-card status-${item.status}" data-profession-type="${escapeHtml(item.type)}" data-profession-cycle="${index}" role="button" tabindex="0">
                <div class="profession-card-head">
                  <span class="profession-icon">${icon("hammer", 17)}</span>
                  <div class="profession-card-title">
                    <div class="profession-card-title-line">
                      <h3>${escapeHtml(localized(item, "name"))}</h3>
                      <strong class="profession-level" data-progress-output="professions-${index}">Lv.${item.level}${item.targetLevel != null ? ` / ${item.targetLevel}` : ""}</strong>
                    </div>
                    <div class="profession-meta">
                      <span class="profession-rank-pill ${experienceGoal ? "" : "is-max"}" data-profession-rank="${index}">${escapeHtml(rankLabel)}</span>
                      ${focusLabel ? `<span class="profession-focus">${escapeHtml(focusLabel)}</span>` : ""}
                    </div>
                  </div>
                  <span class="status-dot"></span>
                </div>
                <div class="profession-progress-panel">
                  <div class="profession-progress-row" data-profession-progress="${index}">
                    ${progressBar(experiencePercent, "profession-progress")}
                    <small class="${experienceGoal ? "" : "is-max"}" data-profession-experience="${index}">${experienceGoal ? `${formatNumber(experience)} / ${formatNumber(experienceGoal)}` : t("profession.max")}</small>
                  </div>
                </div>
                <div class="profession-card-controls">
                  <div class="progress-number-editor profession-number-editor">
                    <label>${t("progress.current")}<input class="progress-number-input" type="number" min="1" max="${maxLevel}" data-progress-number="professions" data-item-index="${index}" data-progress-field="level" value="${item.level}" /></label>
                    <label>${t("progress.target")}<input class="progress-number-input" type="number" min="1" max="${maxLevel}" data-progress-number="professions" data-item-index="${index}" data-progress-field="targetLevel" value="${item.targetLevel ?? item.level}" /></label>
                    <label>${t("progress.experience")}<input class="progress-number-input" type="number" min="0" max="${experienceGoal}" data-progress-number="professions" data-item-index="${index}" data-progress-field="experience" value="${experience}" ${experienceGoal ? "" : "disabled"} /></label>
                  </div>
                  ${renderStatusActions("professions", index, item.status)}
                </div>
              </div>
            `;
            },
          )
          .join("")}
      </div>
    `;
  }

  function hexaResourceTotals(character) {
    const items = (character.hexa || []).filter((item) => !String(item.type || "").includes("stat"));
    return items.reduce(
      (totals, item) => {
        const maxLevel = 30;
        const ratio = Math.max(0, Math.min(1, (Number(item.level) || 0) / maxLevel));
        const targetRatio = Math.max(0, Math.min(1, (Number(item.targetLevel) || maxLevel) / maxLevel));
        totals.spentErda += (Number(item.erdaGoal) || 0) * ratio;
        totals.spentFragments += (Number(item.fragmentGoal) || 0) * ratio;
        totals.goalErda += (Number(item.erdaGoal) || 0) * targetRatio;
        totals.goalFragments += (Number(item.fragmentGoal) || 0) * targetRatio;
        return totals;
      },
      { spentErda: 0, spentFragments: 0, goalErda: 0, goalFragments: 0 },
    );
  }

  function hexaIconUrl(character, index) {
    const skills = window.HEXA_SKILLS?.[character.classKey];
    return skills?.[index]?.icon || "";
  }

  function hexaSkillName(character, index) {
    const skill = window.HEXA_SKILLS?.[character.classKey]?.[index];
    return skill?.name || "";
  }

  function formatHexaSkillName(name) {
    return String(name || "")
      .replace(/\s*\n\s*/g, " ")
      .replace(/(?!^)(HEXA)/g, "\n$1");
  }

  const hexaStatLevelCosts = [
    { chance: 35, cost: 10 },
    { chance: 35, cost: 10 },
    { chance: 35, cost: 10 },
    { chance: 20, cost: 20 },
    { chance: 20, cost: 20 },
    { chance: 20, cost: 20 },
    { chance: 20, cost: 20 },
    { chance: 15, cost: 30 },
    { chance: 10, cost: 40 },
    { chance: 5, cost: 50 },
    { chance: 0, cost: 50 },
  ];

  const hexaStatResetCosts = [10000000, 20000000, 35000000];

  function simulateHexaStat(currentLevel, targetLevel, sunnySunday) {
    const start = Math.max(0, Math.min(10, Number(currentLevel) || 0));
    const target = Math.max(0, Math.min(10, Number(targetLevel) || 0));
    if (target <= start) return { fragments: 0, resets: 0 };
    const simulations = 100;
    let totalFragments = 0;
    let totalResets = 0;
    for (let simulation = 0; simulation < simulations; simulation += 1) {
      let level = start;
      let fragments = 0;
      let resets = 0;
      let guard = 0;
      while (level < target && level < 10 && guard < 1000) {
        guard += 1;
        const levelCost = hexaStatLevelCosts[level] || hexaStatLevelCosts[9];
        let chance = levelCost.chance;
        if (sunnySunday && level >= 5) chance += 20;
        fragments += levelCost.cost;
        if (Math.random() * 100 < chance) {
          level += 1;
        } else {
          resets += 1;
          level = 0;
        }
      }
      totalFragments += fragments;
      totalResets += resets;
    }
    return {
      fragments: Math.round(totalFragments / simulations),
      resets: totalResets / simulations,
    };
  }

  function renderHexaIcon(character, index) {
    const url = hexaIconUrl(character, index);
    if (!url) return icon("hex", 22);
    return `
      <img
        class="hexa-skill-image"
        src="${escapeHtml(url)}"
        alt=""
        loading="lazy"
        onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"
      />
      <span class="hexa-fallback-icon" style="display:none">${icon("hex", 22)}</span>
    `;
  }

  function resourceIcon(type, large = false) {
    const src = type === "erda" ? "assets/hexa/resource/erda.png" : "assets/hexa/resource/frag.png";
    return `<img class="hexa-resource-icon ${large ? "hexa-resource-icon-large" : ""}" src="${src}" alt="" loading="lazy" />`;
  }

  function renderHexaDetail(character) {
    const items = character.hexa || [];
    const resources = hexaResourceTotals(character);
    const groupOrder = [
      ["Mastery Skills", t("hexa.masterySkills")],
      ["Enhancement Skills", t("hexa.enhancementSkills")],
      ["Origin Skills", t("hexa.originSkills")],
      ["Common Skills", t("hexa.commonSkills")],
    ];
    const groups = groupOrder
      .map(([categoryEn, label]) => ({
        categoryEn,
        label,
        items: items.filter((item) => item.categoryEn === categoryEn && !String(item.type || "").includes("stat")),
      }))
      .filter((group) => group.items.length);

    return `
      <div class="hexa-resource-grid">
        <article class="hexa-resource-card hexa-resource-spent">
          <div class="hexa-resource-title">${t("hexa.resourcesSpent")}</div>
          <div><span>${resourceIcon("erda", true)} ${t("hexa.solErda")}</span><b>${Math.round(resources.spentErda)}</b></div>
          <div><span>${resourceIcon("frag", true)} ${t("hexa.fragments")}</span><b>${Math.round(resources.spentFragments)}</b></div>
        </article>
        <article class="hexa-resource-card hexa-resource-remaining">
          <div class="hexa-resource-title">${t("hexa.remainingToGoal")}</div>
          <div><span>${resourceIcon("erda", true)} ${t("hexa.solErda")}</span><b>${Math.max(0, Math.round(resources.goalErda - resources.spentErda))}</b></div>
          <div><span>${resourceIcon("frag", true)} ${t("hexa.fragments")}</span><b>${Math.max(0, Math.round(resources.goalFragments - resources.spentFragments))}</b></div>
        </article>
      </div>

      <div class="hexa-tracker-groups">
        ${groups
          .map(
            (group) => {
              const isCollapsed = collapsedHexaGroups.has(group.categoryEn);
              const groupPrefix =
                state.language === "en"
                  ? group.categoryEn.replace(/\s*Skills$/, "")
                  : {
                      精通技能: "精通",
                      强化技能: "强化",
                      起源技能: "起源",
                      共通技能: "共通",
                    }[group.label] || group.label;
              return `
                <section class="hexa-group-card ${isCollapsed ? "is-collapsed" : ""}">
                  <button class="hexa-group-heading" type="button" data-collapse-hexa-group="${escapeHtml(group.categoryEn)}">
                    <h3>${escapeHtml(group.label)}</h3>
                    <span>${group.items.length} ${icon("chevron", 15)}</span>
                  </button>
                  <div class="hexa-skill-list">
                    ${group.items
                      .map((item) => {
                        const itemIndex = items.indexOf(item);
                        const groupItemNumber = group.items.indexOf(item) + 1;
                        const maxLevel = 30;
                        const level = Math.max(0, Number(item.level) || 0);
                        const target = Math.max(0, Number(item.targetLevel) || 30);
                        const levelRatio = Math.min(1, level / maxLevel);
                        const targetRatio = Math.min(1, target / maxLevel);
                        const spentErda = Math.round((Number(item.erdaGoal) || 0) * levelRatio);
                        const spentFragments = Math.round((Number(item.fragmentGoal) || 0) * levelRatio);
                        const remainingErda = Math.max(0, Math.round((Number(item.erdaGoal) || 0) * Math.max(0, targetRatio - levelRatio)));
                        const remainingFragments = Math.max(0, Math.round((Number(item.fragmentGoal) || 0) * Math.max(0, targetRatio - levelRatio)));
                        const levelPercent = target ? (level / target) * 100 : 0;
                        const derivedStatus = level <= 0 ? "waiting" : level >= target ? "done" : "in-progress";
                        return `
                          <div class="hexa-skill-row status-${derivedStatus}">
                            <span class="hexa-skill-icon">${renderHexaIcon(character, itemIndex)}</span>
                            <div class="hexa-skill-main">
                              <span class="hexa-skill-index">${escapeHtml(groupPrefix)} ${groupItemNumber}.</span>
                              <strong>${escapeHtml(formatHexaSkillName(hexaSkillName(character, itemIndex) || localized(item, "name")))}</strong>
                            </div>
                            <div class="hexa-skill-level" data-progress-output="hexa-${itemIndex}">Lv.${level}<small>/ ${target}</small></div>
                            <div class="hexa-skill-cost">
                              <div class="hexa-cost-group">
                                <span class="hexa-cost-label">${t("hexa.spentShort")}</span>
                                <span>${resourceIcon("erda")} ${spentErda}</span>
                                <span>${resourceIcon("frag")} ${spentFragments}</span>
                              </div>
                              <div class="hexa-cost-group">
                                <span class="hexa-cost-label">${t("hexa.remainingShort")}</span>
                                <span>${resourceIcon("erda")} ${remainingErda}</span>
                                <span>${resourceIcon("frag")} ${remainingFragments}</span>
                              </div>
                            </div>
                            <div class="hexa-skill-progress">${progressBar(levelPercent, "hexa-progress")}</div>
                            <div class="progress-number-editor hexa-number-editor">
                              <label>${t("progress.current")}<input class="progress-number-input" type="number" min="0" max="30" data-progress-number="hexa" data-item-index="${itemIndex}" data-progress-field="level" value="${level}" /></label>
                              <label>${t("progress.target")}<input class="progress-number-input" type="number" min="0" max="30" data-progress-number="hexa" data-item-index="${itemIndex}" data-progress-field="targetLevel" value="${target}" /></label>
                            </div>
                          </div>
                        `;
                      })
                      .join("")}
                  </div>
                </section>
              `;
            },
          )
          .join("")}
      </div>

      ${renderHexaStatSection(character)}
    `;
  }

  function renderHexaStatSection(character) {
    const nodes = Array.isArray(character.hexaStats) && character.hexaStats.length === 3
      ? character.hexaStats
      : [{ enabled: false, level: 0, targetLevel: 0 }, { enabled: false, level: 0, targetLevel: 0 }, { enabled: false, level: 0, targetLevel: 0 }];
    return `
      <section class="hexa-stat-section ${hexaStatCollapsed ? "is-collapsed" : ""}">
        <button class="hexa-stat-section-heading" type="button" data-collapse-hexa-stat>
          <div>
            <span class="eyebrow">HEXA STAT</span>
          </div>
          <span class="hexa-stat-collapse-count">${nodes.length} ${icon("chevron", 16)}</span>
        </button>
        <div class="hexa-stat-node-grid">
          ${nodes
            .map((node, index) => {
              return `
                <article class="hexa-stat-node ${node.enabled ? "is-enabled" : ""}">
                  <div class="hexa-stat-node-head">
                    <h4>${t("hexa.statNode", { index: index + 1 })}</h4>
                    <label class="hexa-stat-toggle">
                      <input type="checkbox" data-hexa-stat-toggle="${index}" ${node.enabled ? "checked" : ""} />
                      <span>${t("hexa.statEnabled")}</span>
                    </label>
                  </div>
                  <div class="hexa-stat-fields">
                    <label>
                      <span>${t("hexa.statMainLevel")}</span>
                      <input type="number" min="0" max="10" data-hexa-stat-field="level" data-hexa-stat-index="${index}" value="${node.level}" />
                    </label>
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  function renderTasks() {
    if (taskGroupFilter === "daily") {
      return renderDailyWorkflow();
    }
    return renderWeeklyWorkflow();
  }

  function selectedDailyCharacter() {
    return getCharacter(taskCharFilter) || state.characters[0] || null;
  }

  function selectedMuleCharacter() {
    return getCharacter(selectedMuleCharacterId) || state.characters.find((character) => character.bossMule) || null;
  }

  function updateDailyAddUi() {
    const character = getCharacter(dailyAddCharacterId);
    const grid = $("#dailyAddGrid");
    const confirmButton = $("#dailyAddConfirmButton");
    if (!character || !grid) return;
    const assigned = new Set(state.dailyTaskAssignments?.[character.id] || []);
    const presets = state.taskDefinitions.filter(
      (task) => task.group === "daily" && !task.custom && taskEligibleForCharacter(task, character),
    );
    const selectedIds = [...dailyAddSelection].filter((id) => !assigned.has(id));
    grid.innerHTML = `
      ${presets
        .map((task) => {
          const isAdded = assigned.has(task.id);
          const isSelected = dailyAddSelection.has(task.id);
          return `
            <button class="daily-add-option ${isAdded ? "is-added" : ""} ${isSelected ? "is-selected" : ""}" type="button" data-daily-add-select="${escapeHtml(task.id)}" ${isAdded ? "disabled" : ""} aria-pressed="${isSelected}">
              <span class="daily-add-icon">${dailyTaskIcon(task)}</span>
              <span class="daily-add-copy">
                <strong>${escapeHtml(localized(task, "name"))}</strong>
                <small>${escapeHtml(localized(task, "category"))} · ${escapeHtml(localized(task, "note"))}</small>
              </span>
              <span class="daily-add-state">
                ${isAdded ? `${icon("check", 14)}<small>${t("daily.addedState")}</small>` : isSelected ? icon("check", 14) : icon("plus", 14)}
              </span>
            </button>
          `;
        })
        .join("")}
      <button class="daily-add-option daily-add-custom" type="button" data-daily-add-custom>
        <span class="daily-add-icon">${icon("sparkles", 17)}</span>
        <span class="daily-add-copy">
          <strong>${t("daily.custom")}</strong>
          <small>${t("task.addTitle")}</small>
        </span>
        <span class="daily-add-state">${icon("plus", 14)}</span>
      </button>
    `;
    if (confirmButton) {
      confirmButton.disabled = selectedIds.length === 0;
      confirmButton.textContent = t("daily.addSelected", { count: selectedIds.length });
    }
  }

  function openDailyAdd() {
    const character = selectedDailyCharacter();
    if (!character) {
      showToast(t("daily.noCharacters"), "error");
      return;
    }
    dailyAddCharacterId = character.id;
    dailyAddSelection = new Set();
    updateDailyAddUi();
    $("#dailyAddModal")?.showModal();
  }

  function addDailyPresets(taskIds) {
    const character = getCharacter(dailyAddCharacterId);
    if (!character || !taskIds.length) return;
    const assigned = new Set(
      Array.isArray(state.dailyTaskAssignments?.[character.id])
        ? state.dailyTaskAssignments[character.id]
        : [],
    );
    taskIds.forEach((taskId) => {
      const task = state.taskDefinitions.find((item) => item.id === taskId);
      if (task?.group === "daily" && taskEligibleForCharacter(task, character)) {
        assigned.add(taskId);
      }
    });
    state.dailyTaskAssignments[character.id] = [...assigned];
    selectedDailyTaskId = taskIds[taskIds.length - 1];
    state.lastDailyTaskId = selectedDailyTaskId;
    $("#dailyAddModal")?.close();
    dailyAddCharacterId = null;
    dailyAddSelection = new Set();
    saveState();
    render();
    showToast(t("daily.addedCount", { count: taskIds.length }), "success");
  }

  function openCustomDailyFromAdd() {
    $("#dailyAddModal")?.close();
    dailyAddCharacterId = null;
    openTaskEditor("daily");
  }

  function updateWeeklyAddUi() {
    const character = getCharacter(weeklyAddCharacterId);
    const grid = $("#weeklyAddGrid");
    const confirmButton = $("#weeklyAddConfirmButton");
    if (!character || !grid) return;
    const assigned = new Set(state.weeklyTaskAssignments?.[character.id] || []);
    const presets = state.taskDefinitions.filter(
      (task) => task.group === "weekly" && !task.custom && taskEligibleForCharacter(task, character),
    );
    const selectedIds = [...weeklyAddSelection].filter((id) => !assigned.has(id));
    grid.innerHTML = `
      ${presets
        .map((task) => {
          const isAdded = assigned.has(task.id);
          const isSelected = weeklyAddSelection.has(task.id);
          return `
            <button class="daily-add-option ${isAdded ? "is-added" : ""} ${isSelected ? "is-selected" : ""}" type="button" data-weekly-add-select="${escapeHtml(task.id)}" ${isAdded ? "disabled" : ""} aria-pressed="${isSelected}">
              <span class="daily-add-icon">${weeklyTaskIcon(task)}</span>
              <span class="daily-add-copy">
                <strong>${escapeHtml(localized(task, "name"))}</strong>
                <small>${escapeHtml(localized(task, "category"))} · ${escapeHtml(localized(task, "note"))}</small>
              </span>
              <span class="daily-add-state">
                ${isAdded ? `${icon("check", 14)}<small>${t("daily.addedState")}</small>` : isSelected ? icon("check", 14) : icon("plus", 14)}
              </span>
            </button>
          `;
        })
        .join("")}
      <button class="daily-add-option daily-add-custom" type="button" data-weekly-add-custom>
        <span class="daily-add-icon">${icon("sparkles", 17)}</span>
        <span class="daily-add-copy">
          <strong>${t("weekly.custom")}</strong>
          <small>${t("task.addTitle")}</small>
        </span>
        <span class="daily-add-state">${icon("plus", 14)}</span>
      </button>
    `;
    if (confirmButton) {
      confirmButton.disabled = selectedIds.length === 0;
      confirmButton.textContent = t("daily.addSelected", { count: selectedIds.length });
    }
  }

  function openWeeklyAdd() {
    const character = selectedDailyCharacter();
    if (!character) {
      showToast(t("daily.noCharacters"), "error");
      return;
    }
    weeklyAddCharacterId = character.id;
    weeklyAddSelection = new Set();
    updateWeeklyAddUi();
    $("#weeklyAddModal")?.showModal();
  }

  function addWeeklyPresets(taskIds) {
    const character = getCharacter(weeklyAddCharacterId);
    if (!character || !taskIds.length) return;
    const assigned = new Set(
      Array.isArray(state.weeklyTaskAssignments?.[character.id])
        ? state.weeklyTaskAssignments[character.id]
        : [],
    );
    taskIds.forEach((taskId) => {
      const task = state.taskDefinitions.find((item) => item.id === taskId);
      if (task?.group === "weekly" && taskEligibleForCharacter(task, character)) {
        assigned.add(taskId);
      }
    });
    state.weeklyTaskAssignments[character.id] = [...assigned];
    selectedWeeklyTaskId = taskIds[taskIds.length - 1];
    state.lastWeeklyTaskId = selectedWeeklyTaskId;
    $("#weeklyAddModal")?.close();
    weeklyAddCharacterId = null;
    weeklyAddSelection = new Set();
    saveState();
    render();
    showToast(t("daily.addedCount", { count: taskIds.length }), "success");
  }

  function openCustomWeeklyFromAdd() {
    $("#weeklyAddModal")?.close();
    weeklyAddCharacterId = null;
    openTaskEditor("weekly");
  }

  function updateMuleAddUi() {
    const character = selectedMuleCharacter();
    const grid = $("#muleAddGrid");
    if (!character || !grid) return;
    const assigned = new Set(bossPlan(character.id).map((entry) => entry.bossId));
    const gameOrder = [
      "zakum",
      "hilla",
      "pink-bean",
      "cygnus",
      "pierre",
      "von-bon",
      "crimson-queen",
      "vellum",
      "princess-no",
      "magnus",
      "papulatus",
      "akechi-mitsuhide",
      "lotus",
      "damien",
      "guardian-angel-slime",
      "lucid",
      "will",
      "gloom",
      "verus-hilla",
      "darknell",
      "seren",
      "kalos",
      "kaling",
      "baldrix",
      "limbo",
      "malefic-star",
      "adversary",
      "jupiter",
    ];
    const orderIndex = new Map(gameOrder.map((id, index) => [id, index]));
    const presets = [...(window.BOSS_MULE_CATALOG || [])]
      .filter((boss) => character.level >= (boss.minLevel || 0))
      .sort(
      (left, right) =>
        (orderIndex.has(left.id) ? orderIndex.get(left.id) : 999) -
        (orderIndex.has(right.id) ? orderIndex.get(right.id) : 999),
      );
    grid.innerHTML = presets
      .map((boss) => {
        const isAdded = assigned.has(boss.id);
        const draft = muleAddDrafts[boss.id] || {};
        return `
          <div class="mule-add-option ${isAdded ? "is-added" : ""}" data-mule-add-select="${escapeHtml(boss.id)}" ${isAdded ? "aria-disabled=\"true\"" : ""}>
            <span class="daily-add-icon"><img src="${escapeHtml(boss.image)}" alt="" /></span>
            <span class="daily-add-copy">
              <strong>${escapeHtml(state.language === "en" ? boss.name : boss.nameCN)}</strong>
              <small>Lv.${boss.minLevel}+ · ${boss.difficulties.length} ${t("mule.difficulty")}</small>
            </span>
            <span class="mule-add-controls">
              <select data-mule-add-difficulty="${escapeHtml(boss.id)}" aria-label="${t("mule.difficulty")}" ${isAdded ? "disabled" : ""}>
                ${boss.difficulties.map((difficulty) => `<option value="${escapeHtml(difficulty.id)}" ${draft.difficultyId === difficulty.id ? "selected" : ""}>${escapeHtml(difficulty.difficulty)}</option>`).join("")}
              </select>
              <select data-mule-add-party="${escapeHtml(boss.id)}" aria-label="${t("mule.partySize")}" ${isAdded ? "disabled" : ""}>
                ${Array.from({ length: boss.maxPartySize }, (_, index) => index + 1).map((size) => `<option value="${size}" ${Number(draft.partySize) === size ? "selected" : ""}>${size}</option>`).join("")}
              </select>
            </span>
            <button class="mule-add-boss-button" type="button" data-mule-add-single="${escapeHtml(boss.id)}" ${isAdded ? "disabled" : ""}>
              ${icon(isAdded ? "check" : "plus", 16)}<span>${isAdded ? t("daily.addedState") : t("mule.addBoss")}</span>
            </button>
          </div>
        `;
      })
      .join("");
  }

  function openMuleAdd() {
    if (!selectedMuleCharacter()) {
      showToast(t("mule.emptyMules"), "error");
      return;
    }
    muleAddDrafts = Object.fromEntries(
      (window.BOSS_MULE_CATALOG || []).map((boss) => {
        const hard = boss.difficulties.find((difficulty) => difficulty.difficulty === "Hard");
        return [
          boss.id,
          {
            difficultyId: hard?.id || boss.difficulties[0]?.id,
            partySize: 1,
          },
        ];
      }),
    );
    updateMuleAddUi();
    $("#muleAddModal")?.showModal();
  }

  function addSingleMuleBoss(bossId) {
    const character = selectedMuleCharacter();
    const draft = muleAddDrafts[bossId] || {};
    const boss = getBossMuleBoss(bossId);
    if (!character || !boss || character.level < (boss.minLevel || 0)) return;
    const difficultyId = draft.difficultyId || boss.difficulties.find((difficulty) => difficulty.difficulty === "Hard")?.id || boss.difficulties[0]?.id;
    const partySize = draft.partySize || 1;
    if (addBossMuleEntry(character.id, bossId, difficultyId, partySize)) {
      saveState();
      render();
      updateMuleAddUi();
      showToast(t("mule.added"), "success");
    }
  }

  function dailyTaskIcon(task) {
    const symbolAssets = {
      "arcane-dailies": {
        src: "assets/ui/arcane-symbol.png",
        alt: "ARC",
      },
      "grandis-dailies": {
        src: "assets/ui/sacred-symbol.png",
        alt: "SAC",
      },
      "monster-park": {
        src: "assets/ui/map-icon-monster-park.png",
        alt: "Monster Park",
      },
      "maple-tour": {
        src: "assets/ui/map-icon-maple-tour.png",
        alt: "Maple Tour",
      },
      ursus: {
        src: "assets/ui/ursus.png",
        alt: "Ursus",
      },
      wap: {
        src: "assets/ui/wap.png",
        alt: "WAP",
      },
      "daily-bosses": {
        src: "assets/ui/gollux.png",
        alt: "Gollux",
      },
      "event-daily": {
        src: `assets/ui/event-${eventDailyIconIndex + 1}.png`,
        alt: "Event",
      },
    };
    const asset = symbolAssets[task.id];
    if (asset) {
      return `<img class="daily-symbol-image" src="${asset.src}" alt="${asset.alt}" />`;
    }
    const iconNames = {
    };
    return icon(iconNames[task.id] || "checklist", 17);
  }

  function renderDailyBossDetail(character, task, done) {
    const progress = dailyBossProgress(character.id);
    const bosses = dailyBossPlan(character.id);
    const available = state.dailyBossCatalog.filter(
      (boss) => !bosses.some((item) => item.id === boss.id),
    );
    return `
      <div class="daily-task-detail-hero ${done ? "is-complete" : ""}">
        <span class="daily-detail-symbol">${dailyTaskIcon(task)}</span>
        <span class="task-category daily-category">${escapeHtml(localized(task, "category"))}</span>
        <h3>${escapeHtml(localized(task, "name"))}</h3>
        <p>${escapeHtml(localized(task, "note"))}</p>
        <div class="daily-detail-character">
          ${classAvatar(character, "sm")}
          <span>
            <strong>${escapeHtml(character.name)}</strong>
            <small>${escapeHtml(characterClassName(character))} · Lv.${character.level} · ${escapeHtml(character.server)}</small>
          </span>
        </div>
        <button class="daily-boss-expand" type="button" data-daily-boss-expand>
          <span>${dailyBossExpanded ? t("dailyBoss.collapse") : t("dailyBoss.expand")}</span>
          <b>${progress.done}/${progress.total}</b>
          ${icon("chevron", 15)}
        </button>
        <div class="daily-boss-panel ${dailyBossExpanded ? "is-expanded" : ""}">
          ${bosses.length
            ? bosses
                .map((boss) => {
                  const bossDone = isDailyBossDone(character.id, boss.id);
                  return `
                    <div class="daily-boss-row ${bossDone ? "is-done" : ""}" data-order-kind="daily-boss" data-order-character-id="${escapeHtml(character.id)}" data-order-item-id="${escapeHtml(boss.id)}">
                      ${orderDragHandle("daily-boss", character.id, boss.id)}
                      <button class="daily-boss-thumb-button ${bossDone ? "is-done" : ""}" type="button" data-daily-boss-toggle="${escapeHtml(boss.id)}" data-character-id="${escapeHtml(character.id)}" aria-label="${escapeHtml(localized(boss, "name"))}">
                        ${boss.icon ? `<img class="daily-boss-thumb" src="${escapeHtml(boss.icon)}" alt="" />` : `<span class="daily-boss-thumb daily-boss-thumb-empty"></span>`}
                        ${bossDone ? `<span class="daily-boss-check-mark">${icon("check", 11)}</span>` : ""}
                      </button>
                      <span class="daily-boss-name">${escapeHtml(localized(boss, "name"))}</span>
                      <button class="daily-boss-remove" type="button" data-daily-boss-remove="${escapeHtml(boss.id)}" data-character-id="${escapeHtml(character.id)}" aria-label="${t("dailyBoss.remove")}">
                        ${icon("trash", 13)}
                      </button>
                    </div>
                  `;
                })
                .join("")
            : `<div class="daily-boss-empty">${icon("sword", 22)}<span>${t("dailyBoss.empty")}</span></div>`}
          <div class="daily-boss-add-row">
            ${available.length
              ? `
                <select data-daily-boss-add-select>
                  ${available
                    .map(
                      (boss) => `<option value="${escapeHtml(boss.id)}">${escapeHtml(localized(boss, "name"))}</option>`,
                    )
                    .join("")}
                </select>
                <button class="button button-ghost button-small" type="button" data-daily-boss-add="${escapeHtml(character.id)}">${icon("plus", 13)} ${t("dailyBoss.add")}</button>
              `
              : `<span class="daily-boss-add-empty">${t("dailyBoss.noMore")}</span>`}
          </div>
        </div>
        <div class="daily-detail-actions">
          <span class="daily-detail-status">${done ? t("status.done") : t("status.waiting")}</span>
          <button class="button ${done ? "button-ghost" : "button-primary"}" type="button" data-daily-boss-mark-all="${escapeHtml(character.id)}">
            ${icon("check", 15)} ${done ? t("dailyBoss.markUndone") : t("dailyBoss.markAll")}
          </button>
        </div>
      </div>
    `;
  }

  function renderWapDetail(character, task, done) {
    const usage = Math.max(0, Number(state.dailyWapUsage?.[character.id]) || 0);
    return `
      <div class="daily-task-detail-hero ${done ? "is-complete" : ""}">
        <span class="daily-detail-symbol">${dailyTaskIcon(task)}</span>
        <span class="task-category daily-category">${escapeHtml(localized(task, "category"))}</span>
        <h3>${escapeHtml(localized(task, "name"))}</h3>
        <p>${escapeHtml(localized(task, "note"))} · ${t("wap.duration")}</p>
        <div class="daily-detail-character">
          ${classAvatar(character, "sm")}
          <span>
            <strong>${escapeHtml(character.name)}</strong>
            <small>${escapeHtml(characterClassName(character))} · Lv.${character.level} · ${escapeHtml(character.server)}</small>
          </span>
        </div>
        <label class="wap-usage-field">
          <span>${t("wap.usage")}</span>
          <div>
            <input type="number" min="0" step="1" data-wap-usage-input data-character-id="${escapeHtml(character.id)}" value="${usage}" />
            <small>${t("wap.unit")}</small>
          </div>
        </label>
        <div class="daily-detail-actions">
          <span class="daily-detail-status">${done ? t("status.done") : t("status.waiting")}</span>
          ${usage > 0 ? `<button class="button button-ghost" type="button" data-wap-reset="${escapeHtml(character.id)}">${icon("refresh", 14)} ${t("wap.reset")}</button>` : ""}
        </div>
      </div>
    `;
  }

  function renderDailyWorkflow() {
    const selectedCharacter = selectedDailyCharacter();
    const tasks = selectedCharacter ? dailyTasksForCharacter(selectedCharacter) : [];
    const availableTasks = tasks;
    const selectedTask = selectedCharacter
      ? availableTasks.find((task) => task.id === selectedDailyTaskId) || availableTasks[0] || null
      : null;
    const doneCount = selectedCharacter
      ? availableTasks.filter((task) => isTaskDone(task.id, selectedCharacter.id)).length
      : 0;

    return `
      <div class="toolbar daily-workflow-toolbar">
        <div class="daily-workflow-summary">
          ${selectedCharacter ? `${classAvatar(selectedCharacter, "sm")}<span>${escapeHtml(selectedCharacter.name)}</span>` : icon("users", 16)}
          <b>${doneCount}/${availableTasks.length}</b>
          <small>${t("tasks.dailySummary")}</small>
        </div>
      </div>

      <div class="daily-workflow">
        <section class="daily-workflow-panel daily-character-panel">
          <div class="daily-workflow-heading">
            <span class="daily-step-badge">1</span>
            <h2>${t("daily.characterStep")}</h2>
          </div>
          <div class="daily-character-picker">
            ${state.characters.length
              ? state.characters
                  .map(
                    (character) => `
                      <button class="daily-character-button ${selectedCharacter?.id === character.id ? "is-active" : ""}" data-task-filter="${escapeHtml(character.id)}" data-character-id="${escapeHtml(character.id)}" style="--class-color:${getClassStyle(character.classKey).color}">
                        ${characterDragHandle(character.id)}
                        ${classAvatar(character, "sm")}
                        <span>
                          <strong>${escapeHtml(character.name)}</strong>
                          <small>${escapeHtml(characterClassName(character))} · Lv.${character.level}</small>
                        </span>
                        ${icon("chevron", 14)}
                      </button>
                    `,
                  )
                  .join("")
              : `<div class="daily-workflow-empty">${icon("users", 24)}<span>${t("daily.noCharacters")}</span></div>`}
          </div>
        </section>

        <section class="daily-workflow-panel daily-task-picker-panel">
          <div class="daily-workflow-heading">
            <span class="daily-step-badge">2</span>
            <h2>${t("daily.taskStep")}</h2>
            <div class="daily-heading-actions">
              <button class="daily-add-open" type="button" data-daily-add-open>
                ${icon("plus", 14)}<span>${t("tasks.addDaily")}</span>
              </button>
              <button class="button button-ghost button-small button-danger-text" data-batch-delete-daily-open>
                ${icon("trash", 13)} ${t("daily.batchDelete")}
              </button>
              ${selectedCharacter ? `<button class="daily-mark-all-button" type="button" data-mark-daily-character="${escapeHtml(selectedCharacter.id)}">${icon("check", 13)} ${t("tasks.markAll")}</button>` : ""}
            </div>
          </div>
          <div class="daily-task-picker-list">
            ${tasks.length
              ? tasks
                  .map((task) => {
                    const available = selectedCharacter ? selectedCharacter.level >= task.minLevel : false;
                    const done = selectedCharacter ? isTaskDone(task.id, selectedCharacter.id) : false;
                    const isSelected = selectedTask?.id === task.id;
                    return `
                      <button
                        class="daily-task-picker-item ${isSelected ? "is-active" : ""} ${done ? "is-done" : ""}"
                        data-daily-task-select="${escapeHtml(task.id)}"
                        data-order-kind="daily-task"
                        data-order-character-id="${escapeHtml(selectedCharacter.id)}"
                        data-order-item-id="${escapeHtml(task.id)}"
                        ${available ? "" : "disabled"}
                        title="${escapeHtml(localized(task, "name"))}"
                      >
                        ${orderDragHandle("daily-task", selectedCharacter.id, task.id)}
                        <span class="daily-task-symbol">${dailyTaskIcon(task)}</span>
                        <span class="daily-task-picker-copy">
                          <strong>${escapeHtml(localized(task, "name"))}</strong>
                          <small>${escapeHtml(localized(task, "category"))}${task.id === "wap" ? ` · ${t("wap.duration")}` : ""}</small>
                        </span>
                        <span class="daily-task-picker-state">
                          ${done ? icon("check", 15) : available ? icon("chevron", 15) : `<small>Lv.${task.minLevel}+</small>`}
                        </span>
                      </button>
                    `;
                  })
                  .join("")
              : `<div class="daily-workflow-empty">${icon("checklist", 24)}<span>${t("daily.emptySlots")}</span></div>`}
          </div>
        </section>

        <section class="daily-workflow-panel daily-task-detail-panel">
          <div class="daily-workflow-heading">
            <span class="daily-step-badge">3</span>
            <h2>${t("daily.detailStep")}</h2>
          </div>
          ${
            selectedTask && selectedCharacter
              ? selectedTask.id === "wap"
                ? renderWapDetail(selectedCharacter, selectedTask, isTaskDone(selectedTask.id, selectedCharacter.id))
                : selectedTask.id === "daily-bosses"
                ? renderDailyBossDetail(selectedCharacter, selectedTask, isTaskDone(selectedTask.id, selectedCharacter.id))
                : (() => {
                    const done = isTaskDone(selectedTask.id, selectedCharacter.id);
                    return `
                      <div class="daily-task-detail-hero ${done ? "is-complete" : ""}">
                        <span class="daily-detail-symbol">${dailyTaskIcon(selectedTask)}</span>
                        <span class="task-category daily-category">${escapeHtml(localized(selectedTask, "category"))}</span>
                        <h3>${escapeHtml(localized(selectedTask, "name"))}</h3>
                        <p>${escapeHtml(localized(selectedTask, "note"))}</p>
                        <div class="daily-detail-character">
                          ${classAvatar(selectedCharacter, "sm")}
                          <span>
                            <strong>${escapeHtml(selectedCharacter.name)}</strong>
                            <small>${escapeHtml(characterClassName(selectedCharacter))} · Lv.${selectedCharacter.level} · ${escapeHtml(selectedCharacter.server)}</small>
                          </span>
                        </div>
                        <div class="daily-detail-actions">
                          <span class="daily-detail-status">${done ? t("status.done") : t("status.waiting")}</span>
                          <div>
                            ${selectedTask.custom ? `<button class="custom-task-delete" data-delete-task="${escapeHtml(selectedTask.id)}" aria-label="${t("tasks.delete")}">${icon("trash", 12)}</button>` : ""}
                            <button class="button ${done ? "button-ghost" : "button-primary"}" data-task-toggle="${escapeHtml(selectedTask.id)}" data-character-id="${escapeHtml(selectedCharacter.id)}">
                              ${icon("check", 15)} ${done ? t("daily.markUndone") : t("daily.markDone")}
                            </button>
                          </div>
                        </div>
                      </div>
                    `;
                  })()
              : `<div class="daily-workflow-empty daily-detail-empty">${icon("checklist", 30)}<span>${t("daily.emptySlots")}</span></div>`
          }
        </section>
      </div>
    `;
  }

  function weeklyTaskIcon(task) {
    const assets = {
      "monster-park-extreme": "assets/ui/map-icon-monster-park.png",
      "epic-high-mountain": "assets/ui/weekly/high-mountain.png",
      "epic-angler": "assets/ui/weekly/angler-company.png",
      "epic-nightmare-paradise": "assets/ui/weekly/nightmare-paradise.png",
      "full-boss-clear": "assets/ui/weekly/kaling.png",
      dojo: "assets/ui/weekly/dojo.png",
      "guild-flag": "assets/ui/weekly/guild-flag-race.png",
      "guild-culvert": "assets/ui/weekly/guild-culvert.png",
    };
    if (assets[task.id]) {
      return `<img class="daily-symbol-image" src="${assets[task.id]}" alt="" />`;
    }
    return icon("checklist", 17);
  }

  function renderWeeklyBossClearDetail(task, character, done) {
    const progress = bossPlanProgress(character.id);
    const totalDone = progress.done;
    const totalBosses = progress.total;
    return `
      <div class="daily-task-detail-hero ${done ? "is-complete" : ""}">
        <span class="daily-detail-symbol">${weeklyTaskIcon(task)}</span>
        <span class="task-category weekly-category">${escapeHtml(localized(task, "category"))}</span>
        <h3>${escapeHtml(localized(task, "name"))}</h3>
        <p>${escapeHtml(localized(task, "note"))}</p>
        <div class="weekly-boss-clear-summary">
          <span>${t("mule.bossCleared")}</span>
          <b>${totalDone}/${totalBosses}</b>
        </div>
        <div class="weekly-boss-mule-list">
          <div class="weekly-boss-mule-row ${done ? "is-complete" : ""}">
            ${classAvatar(character, "sm")}
            <span class="weekly-boss-mule-copy">
              <strong>${escapeHtml(character.name)}</strong>
              <small>${escapeHtml(characterClassName(character))} · Lv.${character.level}</small>
            </span>
            <span class="weekly-boss-mule-progress">${progress.done}/${progress.total}</span>
            ${progressBar(progress.percent, "progress-boss")}
          </div>
        </div>
        <div class="daily-detail-actions">
          <span class="daily-detail-status">${done ? t("status.done") : t("status.waiting")}</span>
          <button class="button button-primary" type="button" data-view="mules">${icon("egg", 14)} ${t("nav.mules")}</button>
        </div>
      </div>
    `;
  }

  function renderWeeklyWorkflow() {
    const selectedCharacter = selectedDailyCharacter();
    const tasks = selectedCharacter ? weeklyTasksForCharacter(selectedCharacter) : [];
    const selectedTask = selectedCharacter
      ? tasks.find((task) => task.id === selectedWeeklyTaskId) || tasks[0] || null
      : null;
    const progress = selectedCharacter
      ? characterTaskProgress(selectedCharacter.id, "weekly")
      : { done: 0, total: 0 };

    return `
      <div class="toolbar daily-workflow-toolbar">
        <div class="daily-workflow-summary">
          ${selectedCharacter ? `${classAvatar(selectedCharacter, "sm")}<span>${escapeHtml(selectedCharacter.name)}</span>` : icon("users", 16)}
          <b>${progress.done}/${progress.total}</b>
          <small>${t("tasks.weeklySummary")}</small>
        </div>
      </div>

      <div class="daily-workflow weekly-workflow">
        <section class="daily-workflow-panel daily-character-panel">
          <div class="daily-workflow-heading">
            <span class="daily-step-badge">1</span>
            <h2>${t("daily.characterStep")}</h2>
          </div>
          <div class="daily-character-picker">
            ${state.characters.length
              ? state.characters
                  .map(
                    (character) => `
                      <button class="daily-character-button ${selectedCharacter?.id === character.id ? "is-active" : ""}" data-task-filter="${escapeHtml(character.id)}" data-character-id="${escapeHtml(character.id)}" style="--class-color:${getClassStyle(character.classKey).color}">
                        ${characterDragHandle(character.id)}
                        ${classAvatar(character, "sm")}
                        <span>
                          <strong>${escapeHtml(character.name)}</strong>
                          <small>${escapeHtml(characterClassName(character))} · Lv.${character.level}</small>
                        </span>
                        ${icon("chevron", 14)}
                      </button>
                    `,
                  )
                  .join("")
              : `<div class="daily-workflow-empty">${icon("users", 24)}<span>${t("daily.noCharacters")}</span></div>`}
          </div>
        </section>

        <section class="daily-workflow-panel daily-task-picker-panel">
          <div class="daily-workflow-heading">
            <span class="daily-step-badge">2</span>
            <h2>${t("tasks.weekly")}</h2>
            <div class="daily-heading-actions">
              <button class="daily-add-open" type="button" data-weekly-add-open>
                ${icon("plus", 14)}<span>${t("tasks.addWeekly")}</span>
              </button>
              <button class="button button-ghost button-small button-danger-text" data-batch-delete-weekly-open>
                ${icon("trash", 13)} ${t("weekly.batchDelete")}
              </button>
              ${selectedCharacter ? `<button class="daily-mark-all-button" type="button" data-mark-weekly-character="${escapeHtml(selectedCharacter.id)}">${icon("check", 13)} ${t("tasks.markAll")}</button>` : ""}
            </div>
          </div>
          <div class="daily-task-picker-list">
            ${tasks.length
              ? tasks
                  .map((task) => {
                    const done = selectedCharacter ? isTaskDone(task.id, selectedCharacter.id) : false;
                    const isSelected = selectedTask?.id === task.id;
                    return `
                      <button
                        class="daily-task-picker-item ${isSelected ? "is-active" : ""} ${done ? "is-done" : ""}"
                        data-weekly-task-select="${escapeHtml(task.id)}"
                        data-order-kind="weekly-task"
                        data-order-character-id="${escapeHtml(selectedCharacter.id)}"
                        data-order-item-id="${escapeHtml(task.id)}"
                        title="${escapeHtml(localized(task, "name"))}"
                      >
                        ${orderDragHandle("weekly-task", selectedCharacter.id, task.id)}
                        <span class="daily-task-symbol">${weeklyTaskIcon(task)}</span>
                        <span class="daily-task-picker-copy">
                          <strong>${escapeHtml(localized(task, "name"))}</strong>
                          <small>${escapeHtml(localized(task, "category"))}</small>
                        </span>
                        <span class="daily-task-picker-state">
                          ${done ? icon("check", 15) : icon("chevron", 15)}
                        </span>
                      </button>
                    `;
                  })
                  .join("")
              : `<div class="daily-workflow-empty">${icon("clock", 24)}<span>${t("weekly.emptySlots")}</span></div>`}
          </div>
        </section>

        <section class="daily-workflow-panel daily-task-detail-panel">
          <div class="daily-workflow-heading">
            <span class="daily-step-badge">3</span>
            <h2>${t("daily.detailStep")}</h2>
          </div>
          ${
            selectedTask && selectedCharacter
              ? selectedTask.id === "full-boss-clear"
                ? renderWeeklyBossClearDetail(
                    selectedTask,
                    selectedCharacter,
                    isTaskDone(selectedTask.id, selectedCharacter.id),
                  )
                : (() => {
                  const done = isTaskDone(selectedTask.id, selectedCharacter.id);
                  return `
                    <div class="daily-task-detail-hero ${done ? "is-complete" : ""}">
                      <span class="daily-detail-symbol">${weeklyTaskIcon(selectedTask)}</span>
                      <span class="task-category weekly-category">${escapeHtml(localized(selectedTask, "category"))}</span>
                      <h3>${escapeHtml(localized(selectedTask, "name"))}</h3>
                      <p>${escapeHtml(localized(selectedTask, "note"))}</p>
                      <div class="daily-detail-character">
                        ${classAvatar(selectedCharacter, "sm")}
                        <span>
                          <strong>${escapeHtml(selectedCharacter.name)}</strong>
                          <small>${escapeHtml(characterClassName(selectedCharacter))} · Lv.${selectedCharacter.level} · ${escapeHtml(selectedCharacter.server)}</small>
                        </span>
                      </div>
                      <div class="daily-detail-actions">
                        <span class="daily-detail-status">${done ? t("status.done") : t("status.waiting")}</span>
                        <div>
                          ${selectedTask.custom ? `<button class="custom-task-delete" data-delete-task="${escapeHtml(selectedTask.id)}" aria-label="${t("tasks.delete")}">${icon("trash", 12)}</button>` : ""}
                          <button class="button ${done ? "button-ghost" : "button-primary"}" data-task-toggle="${escapeHtml(selectedTask.id)}" data-character-id="${escapeHtml(selectedCharacter.id)}">
                            ${icon("check", 15)} ${done ? t("daily.markUndone") : t("daily.markDone")}
                          </button>
                        </div>
                      </div>
                    </div>
                  `;
                })()
              : `<div class="daily-workflow-empty daily-detail-empty">${icon("clock", 30)}<span>${t("weekly.emptySlots")}</span></div>`
          }
        </section>
      </div>
    `;
  }

  function updateBatchWeeklyDeleteUi() {
    const character = getCharacter(batchWeeklyDeleteCharacterId);
    if (!character) return;
    const tasks = weeklyTasksForCharacter(character);
    const list = $("#batchWeeklyDeleteList");
    const selectAll = $("#batchWeeklyDeleteSelectAll");
    const count = $("#batchWeeklyDeleteCount");
    const confirmButton = $("#batchWeeklyDeleteConfirmButton");
    if (!list) return;
    const selectedIds = [...batchWeeklyDeleteSelection].filter((id) =>
      tasks.some((task) => task.id === id),
    );
    list.innerHTML = tasks.length
      ? tasks
          .map(
            (task) => `
              <label class="batch-delete-item">
                <input type="checkbox" data-batch-weekly-delete-task="${escapeHtml(task.id)}" ${batchWeeklyDeleteSelection.has(task.id) ? "checked" : ""} />
                <span class="batch-delete-character">
                  <span class="daily-task-symbol">${weeklyTaskIcon(task)}</span>
                  <span class="batch-delete-meta">
                    <strong>${escapeHtml(localized(task, "name"))}</strong>
                    <span>${escapeHtml(localized(task, "note")) || localized(task, "category")}</span>
                  </span>
                </span>
                <span class="batch-delete-role">${escapeHtml(localized(task, "category"))}</span>
              </label>
            `,
          )
          .join("")
      : `<div class="batch-delete-empty">${icon("trash", 26)}<span>${t("weekly.batchDeleteEmpty")}</span></div>`;
    selectAll.checked = tasks.length > 0 && selectedIds.length === tasks.length;
    count.textContent = tasks.length ? t("weekly.batchDeleteSelected", { count: selectedIds.length }) : "";
    confirmButton.disabled = selectedIds.length === 0;
  }

  function openBatchWeeklyDelete() {
    const character = selectedDailyCharacter();
    if (!character) return;
    batchWeeklyDeleteCharacterId = character.id;
    batchWeeklyDeleteSelection = new Set();
    updateBatchWeeklyDeleteUi();
    $("#batchWeeklyDeleteModal")?.showModal();
  }

  function deleteSelectedWeeklyTasks() {
    const character = getCharacter(batchWeeklyDeleteCharacterId);
    const tasks = character ? weeklyTasksForCharacter(character) : [];
    const selectedIds = [...batchWeeklyDeleteSelection].filter((id) =>
      tasks.some((task) => task.id === id),
    );
    if (!selectedIds.length) {
      showToast(t("weekly.batchDeleteEmpty"), "error");
      return;
    }
    const removedIds = new Set(selectedIds);
    const assigned = state.weeklyTaskAssignments[character.id];
    state.weeklyTaskAssignments[character.id] = (Array.isArray(assigned) ? assigned : tasks.map((task) => task.id)).filter(
      (taskId) => !removedIds.has(taskId),
    );
    state.weeklyCompletions = Object.fromEntries(
      Object.entries(state.weeklyCompletions || {}).filter(
        ([key]) => !key.startsWith(`${character.id}:`) || !removedIds.has(key.split(":").slice(1).join(":")),
      ),
    );
    if (selectedWeeklyTaskId && removedIds.has(selectedWeeklyTaskId)) {
      selectedWeeklyTaskId = null;
      state.lastWeeklyTaskId = null;
    }
    $("#batchWeeklyDeleteModal")?.close();
    batchWeeklyDeleteSelection = new Set();
    batchWeeklyDeleteCharacterId = null;
    saveState();
    render();
    showToast(t("weekly.batchDeleteDone", { count: selectedIds.length }), "success");
  }

  function renderTaskCard(task, selectedCharacter) {
    const applicable = taskApplicableCharacters(task);
    if (!applicable.length) return "";
    const progress = taskProgress(task);
    const completedForSelected = selectedCharacter ? isTaskDone(task.id, selectedCharacter.id) : progress.done === progress.total;

    const control =
      taskCharFilter === "all"
        ? `
            <div class="task-character-toggles">
              ${applicable
                .map(
                  (character) => `
                    <button class="task-character-toggle ${isTaskDone(task.id, character.id) ? "is-done" : ""}" data-task-character="${escapeHtml(task.id)}" data-character-id="${escapeHtml(character.id)}" style="--class-color:${getClassStyle(character.classKey).color}" aria-label="${escapeHtml(character.name)}">
                      ${classAvatar(character, "xs")}<span>${escapeHtml(character.name)}</span>${icon("check", 12)}
                    </button>
                  `,
                )
                .join("")}
            </div>
          `
        : `
            <button class="task-check ${isTaskDone(task.id, selectedCharacter.id) ? "is-done" : ""}" data-task-toggle="${escapeHtml(task.id)}" data-character-id="${escapeHtml(selectedCharacter.id)}" aria-label="${escapeHtml(localized(task, "name"))}">
              ${icon("check", 17)}
            </button>
          `;

    return `
      <article class="task-card ${completedForSelected ? "is-complete" : ""}">
        <div class="task-card-main">
          <span class="task-category ${task.group}-category">${escapeHtml(localized(task, "category"))}</span>
          <div>
            <h3>${escapeHtml(localized(task, "name"))}</h3>
            <p>${escapeHtml(localized(task, "note"))}</p>
          </div>
        </div>
        <div class="task-card-right">
          <span class="task-progress-label">${progress.done}/${progress.total}</span>
          ${progressBar(progress.percent, task.group === "daily" ? "progress-daily" : "progress-weekly")}
          ${control}
          ${task.custom ? `<button class="custom-task-delete" data-delete-task="${escapeHtml(task.id)}">${icon("trash", 12)}</button>` : ""}
        </div>
      </article>
    `;
  }

  function renderMules() {
    const summary = overallBossSummary();
    const mules = state.characters
      .filter((character) => character.bossMule)
      .sort((a, b) => bossPlanProgress(b.id).potentialIncome - bossPlanProgress(a.id).potentialIncome);
    const selected = selectedMuleCharacter();
    const catalog = window.BOSS_MULE_CATALOG || [];
    const plan = selected ? bossPlan(selected.id) : [];
    const topEntries = topBossMuleEntries(plan);
    const topIds = new Set(topEntries.map((entry) => entry.id));
    const expected = topEntries.reduce((sum, entry) => sum + bossMuleEntryMeso(entry), 0);
    const earned = topEntries
      .filter((entry) => entry.completed)
      .reduce((sum, entry) => sum + bossMuleEntryMeso(entry), 0);
    const completedCount = plan.filter((entry) => entry.completed).length;
    const sortedPlan = [...plan].sort(
      (left, right) => bossMuleEntryMeso(left) - bossMuleEntryMeso(right),
    );

    return `
      <div class="kpi-grid mule-kpi-grid">
        <article class="kpi-card kpi-meso">
          <div class="kpi-top">${icon("egg", 18)}<span>${t("mule.settled")}</span></div>
          <strong>${formatMeso(Math.round(summary.income / 1e6))}</strong>
          <small>${t("mule.estimated", { value: formatMeso(Math.round(summary.potentialIncome / 1e6)) })}</small>
        </article>
        <article class="kpi-card">
          <div class="kpi-top">${icon("sword", 18)}<span>${t("mule.bossCleared")}</span></div>
          <strong>${summary.doneBosses}<em>/${summary.totalBosses}</em></strong>
          <small>${progressBar(summary.percent)}</small>
        </article>
        <article class="kpi-card">
          <div class="kpi-top">${icon("users", 18)}<span>${t("mule.characters")}</span></div>
          <strong>${mules.length}</strong>
          <small>${t("mule.avg", { percent: Math.round(summary.percent) })}</small>
        </article>
        <article class="kpi-card">
          <div class="kpi-top">${icon("gauge", 18)}<span>${t("mule.remaining")}</span></div>
          <strong>${formatMeso(Math.round(Math.max(0, summary.potentialIncome - summary.income) / 1e6))}</strong>
          <small>${t("mule.pendingBosses", { count: summary.totalBosses - summary.doneBosses })}</small>
        </article>
      </div>

      <div class="daily-workflow mule-workflow">
        <section class="daily-workflow-panel mule-character-panel">
          <div class="daily-workflow-heading">
            <span class="daily-step-badge">1</span>
            <h2>${t("daily.characterStep")}</h2>
          </div>
          <div class="daily-character-picker">
            ${mules.length
              ? mules
                  .map(
                    (character) => `
                      <button class="daily-character-button ${selected?.id === character.id ? "is-active" : ""}" data-mule-character="${escapeHtml(character.id)}" data-character-id="${escapeHtml(character.id)}" style="--class-color:${getClassStyle(character.classKey).color}">
                        ${characterDragHandle(character.id)}
                        ${classAvatar(character, "sm")}
                        <span>
                          <strong>${escapeHtml(character.name)}</strong>
                          <small>${escapeHtml(characterClassName(character))} · Lv.${character.level}</small>
                        </span>
                        ${icon("chevron", 14)}
                      </button>
                    `,
                  )
                  .join("")
              : `<div class="daily-workflow-empty">${icon("egg", 24)}<span>${t("mule.emptyMules")}</span></div>`}
          </div>
        </section>

        <section class="daily-workflow-panel mule-integrated-panel">
          <div class="daily-workflow-heading">
            <span class="daily-step-badge">2</span>
            <h2>${t("mule.selectBoss")} · ${t("mule.earnings")}</h2>
            <div class="daily-heading-actions">
              <button class="daily-add-open" type="button" data-mule-add-open>
                ${icon("plus", 14)}<span>${t("mule.addBoss")}</span>
              </button>
              ${selected ? `<button class="daily-mark-all-button" type="button" data-mule-all-done="${escapeHtml(selected.id)}">${icon("check", 13)} ${t("mule.allDone")}</button>` : ""}
            </div>
          </div>
          ${selected
            ? `
              <div class="mule-earnings-summary">
                <span><small>${t("mule.selectedCount")}</small><strong>${plan.length}</strong></span>
                <span><small>${t("mule.completedCount")}</small><strong>${completedCount}</strong></span>
                <span><small>${t("mule.expectedWeekly")}</small><strong>${formatMeso(Math.round(expected / 1e6))}</strong></span>
                <span><small>${t("mule.earnedWeekly")}</small><strong>${formatMeso(Math.round(earned / 1e6))}</strong></span>
              </div>
              <div class="mule-integrated-list">
                ${plan.length
                  ? plan
                      .map((entry) => {
                        const boss = getBossMuleBoss(entry.bossId);
                        const difficulty = getBossMuleDifficulty(entry.bossId, entry.difficultyId);
                        if (!boss || !difficulty) return "";
                        const mesos = bossMuleEntryMeso(entry);
                        const isTop = topIds.has(entry.id);
                        const completed = Boolean(entry.completed);
                        return `
                          <div class="mule-integrated-entry ${completed ? "is-complete" : ""}" data-mule-boss-toggle="${escapeHtml(entry.id)}" data-character-id="${escapeHtml(selected.id)}" data-order-kind="mule-boss" data-order-character-id="${escapeHtml(selected.id)}" data-order-item-id="${escapeHtml(entry.id)}">
                            ${orderDragHandle("mule-boss", selected.id, entry.id)}
                            <img src="${escapeHtml(boss.image)}" alt="" />
                            ${completed ? `<span class="mule-boss-check-mark">${icon("check", 10)}</span>` : ""}
                            <span class="mule-plan-entry-copy">
                              <strong>${escapeHtml(state.language === "en" ? boss.name : boss.nameCN)}</strong>
                              ${completed
                                ? `<small>${escapeHtml(difficulty.difficulty)}</small>`
                                : `<span class="mule-selected-boss-controls">
                                    <select data-mule-edit-difficulty="${escapeHtml(entry.id)}" aria-label="${t("mule.difficulty")}">
                                      ${boss.difficulties
                                        .map(
                                          (option) => `<option value="${escapeHtml(option.id)}" ${entry.difficultyId === option.id ? "selected" : ""}>${escapeHtml(option.difficulty)}</option>`,
                                        )
                                        .join("")}
                                    </select>
                                    <select data-mule-edit-party="${escapeHtml(entry.id)}" aria-label="${t("mule.partySize")}">
                                      ${Array.from({ length: boss.maxPartySize }, (_, index) => index + 1)
                                        .map(
                                          (size) => `<option value="${size}" ${Number(entry.partySize) === size ? "selected" : ""}>${size}</option>`,
                                        )
                                        .join("")}
                                    </select>
                                  </span>`}
                            </span>
                            <span class="mule-plan-entry-meso">${formatMeso(Math.round(mesos / 1e6))}</span>
                            <span class="mule-top-badge ${isTop ? "is-active" : ""}">Top 14</span>
                            <button class="daily-boss-remove" type="button" data-mule-boss-remove="${escapeHtml(entry.id)}" data-character-id="${escapeHtml(selected.id)}">${icon("trash", 13)}</button>
                          </div>
                        `;
                      })
                      .join("")
                  : `<div class="daily-workflow-empty">${icon("sword", 24)}<span>${t("mule.emptyPlan")}</span></div>`}
              </div>
            `
            : `<div class="daily-workflow-empty">${icon("users", 24)}<span>${t("mule.emptyMules")}</span></div>`}
        </section>
      </div>
    `;
  }

  function renderDataView() {
    const source = state.dataSource || {};
    const characters = state.characters || [];
    const displayNote = state.language === "en" && source.note === "示例数据" ? t("data.currentNote") : source.note || t("data.currentNote");
    return `
      <div class="data-layout">
        <section class="panel sync-panel">
          <div class="panel-heading">
            <div><span class="eyebrow">LOCAL DATA</span><h2>${t("data.title")}</h2></div>
            <span class="source-badge ${source.type === "imported" || source.type === "local" ? "source-google" : "source-sample"}">${source.type === "imported" ? t("data.sourceImported") : source.type === "local" ? t("data.sourceLocal") : t("data.sourceSample")}</span>
          </div>
          <div class="source-status">
            <span class="source-status-dot ${source.type === "imported" || source.type === "local" ? "is-connected" : ""}"></span>
            <p><strong>${escapeHtml(displayNote)}</strong><small>${source.lastSync ? t("data.lastImport", { time: new Date(source.lastSync).toLocaleString(state.language === "en" ? "en-US" : "zh-CN") }) : t("data.storageNote")}</small></p>
          </div>
          <div class="data-actions">
            <button class="button button-primary" data-new-character>${icon("users", 15)} ${t("data.new")}</button>
            <button class="button button-ghost" data-lookup-open>${icon("search", 15)} ${t("data.lookup")}</button>
            <label class="button button-ghost">${icon("upload", 15)} ${t("data.import")}<input type="file" id="csvFile" accept=".csv,text/csv" hidden /></label>
            <button class="button button-ghost" data-export-csv>${icon("download", 15)} ${t("data.export")}</button>
            <button class="button button-ghost" id="resetSampleButton">${icon("refresh", 15)} ${t("data.reset")}</button>
          </div>
          <div class="reference-sources">
            <span>${state.language === "en" ? "Reference sources" : "参考来源"}</span>
            <a href="https://maplestorywiki.net/w/Xenon/Skills" target="_blank" rel="noreferrer">MapleStory Wiki</a>
            <a href="https://mapleranks.com/" target="_blank" rel="noreferrer">MapleRanks</a>
            <a href="https://maplebot.io/tools/hexa-tracker" target="_blank" rel="noreferrer">MapleBot</a>
            <a href="https://masonym.dev/hexa" target="_blank" rel="noreferrer">Masonym</a>
          </div>
        </section>

        <section class="panel data-preview-panel">
          <div class="panel-heading">
            <div><span class="eyebrow">CHARACTERS</span><h2>${t("data.currentCharacters")}</h2></div>
            <span class="result-count">${t("data.rows", { count: characters.length })}</span>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead><tr><th>${t("data.character")}</th><th>${t("data.class")}</th><th>${t("data.level")}</th><th>${t("data.role")}</th><th>${t("data.equipment")}</th><th>${t("data.hexa")}</th><th>${t("data.professions")}</th><th>${t("data.mule")}</th></tr></thead>
              <tbody>
                ${characters
                  .map(
                    (character) => `
                      <tr>
                        <td><strong>${escapeHtml(character.name)}</strong></td>
                        <td>${escapeHtml(characterClassName(character))}</td>
                        <td>${character.level}</td>
                        <td>${roleLabel(character)}</td>
                        <td>${Math.round(equipmentScore(character))}%</td>
                        <td>${Math.round(hexaScore(character))}%</td>
                        <td>${Math.round(professionsScore(character))}%</td>
                        <td>${character.bossMule ? `${bossPlanProgress(character.id).done}/${bossPlanProgress(character.id).total}` : "—"}</td>
                      </tr>
                    `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;
  }

  function markAllGroup(group, characterId = null) {
    const tasks = state.taskDefinitions.filter((task) => task.group === group);
    const chars = characterId
      ? [getCharacter(characterId)].filter(Boolean)
      : taskCharFilter === "all"
        ? state.characters
        : [getCharacter(taskCharFilter)].filter(Boolean);
    tasks.forEach((task) => {
      taskApplicableCharacters(task)
        .filter((character) => chars.some((char) => char.id === character.id))
        .forEach((character) => {
          if (task.id === "daily-bosses") {
            dailyBossPlan(character.id).forEach((boss) => {
              state.dailyBossCompletions[`${character.id}:${boss.id}`] = true;
            });
            return;
          }
          if (task.id === "wap") {
            if (Number(state.dailyWapUsage?.[character.id] || 0) <= 0) {
              state.dailyWapUsage[character.id] = 1;
            }
            return;
          }
          const map = completionMapForTask(task.id);
          map[`${character.id}:${task.id}`] = true;
        });
    });
    saveState();
    render();
  }

  function confirmAction({ title, message, onConfirm, danger = true }) {
    const dialog = $("#confirmModal");
    $("#modalTitle").textContent = title;
    $("#modalMessage").textContent = message;
    $("#modalConfirm").classList.toggle("button-danger", danger);
    $("#modalConfirm").onclick = () => {
      onConfirm();
      dialog.close();
    };
    dialog.showModal();
  }

  function resetWeek() {
    confirmAction({
      title: t("confirm.resetTitle"),
      message: t("confirm.resetMessage"),
      onConfirm: () => {
        state.dailyCompletions = {};
        state.eventCompletions = {};
        state.weeklyCompletions = {};
        state.bossCompletions = {};
        state.dailyBossCompletions = {};
        state.dailyWapUsage = {};
        Object.values(state.bossMulePlans || {}).flat().forEach((entry) => {
          entry.completed = false;
        });
        saveState();
        render();
        showToast(t("confirm.resetDone"), "success");
      },
    });
  }

  function resetSample() {
    confirmAction({
      title: t("confirm.restoreTitle"),
      message: t("confirm.restoreMessage"),
      onConfirm: () => {
        const sample = deepCopy(window.SAMPLE_DATA || cloneSeed());
        Object.keys(state).forEach((key) => delete state[key]);
        Object.assign(state, sample, {
          dataSource: { type: "sample", url: "", lastSync: null, note: "示例数据" },
          lastView: "overview",
          lastCharacterId: null,
          lastDetailTab: "gear",
          lastDailyTaskId: null,
          lastWeeklyTaskId: null,
          lastMuleCharacterId: null,
          lastTaskCharacterFilter: "all",
          lastTaskGroupFilter: "all",
          lastEquipmentIndex: 0,
        });
        currentView = "overview";
        detailCharId = null;
        detailTab = "gear";
        taskCharFilter = "all";
        taskGroupFilter = "all";
        selectedEquipmentIndex = 0;
        selectedDailyTaskId = null;
        selectedWeeklyTaskId = null;
        selectedMuleCharacterId = null;
        characterSearch = "";
        roleFilter = "all";
        collapsedHexaGroups = new Set(state.collapsedHexaGroups || []);
        hexaStatCollapsed = Boolean(state.hexaStatCollapsed);
        normalizePeriods();
        saveState();
        render();
        showToast(t("confirm.restoreDone"), "success");
      },
    });
  }

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      if (inQuotes) {
        if (char === '"') {
          if (text[index + 1] === '"') {
            cell += '"';
            index += 1;
          } else {
            inQuotes = false;
          }
        } else {
          cell += char;
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(cell);
        cell = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && text[index + 1] === "\n") index += 1;
        row.push(cell);
        if (row.some((value) => value.trim() !== "")) rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
    return rows;
  }

  function normalizeHeader(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_\-—/()（）]+/g, "");
  }

  function findHeaderIndex(headers, candidates) {
    const normalizedCandidates = candidates.map(normalizeHeader);
    return headers.findIndex((header) => normalizedCandidates.includes(normalizeHeader(header)));
  }

  function matchClassKey(value) {
    const normalized = String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9/&]/g, "");
    const aliases = {
      archmageil: "IceLightning",
      archmageicelightning: "IceLightning",
      icelightning: "IceLightning",
      icelightningarchmage: "IceLightning",
      archmagefp: "FirePoison",
      archmagefirepoison: "FirePoison",
      firepoison: "FirePoison",
      erel: "ErelLight",
      erellight: "ErelLight",
      cannonmaster: "Cannoneer",
      blademaster: "DualBlade",
    };
    if (aliases[normalized]) return aliases[normalized];
    const keys = Object.keys(window.CLASS_STYLES);
    const exact = keys.find((key) => key.toLowerCase() === normalized || window.CLASS_STYLES[key].label?.toLowerCase() === normalized);
    if (exact) return exact;
    const partial = keys.find((key) => {
      const keyNormalized = key.toLowerCase();
      const labelNormalized = window.CLASS_STYLES[key].label?.toLowerCase().replace(/[^a-z0-9/&]/g, "") || "";
      return keyNormalized.includes(normalized) || normalized.includes(keyNormalized) || labelNormalized.includes(normalized) || normalized.includes(labelNormalized);
    });
    return partial || "NightLord";
  }

  function mapImportedRows(rows) {
    if (!rows?.length) return [];
    const headers = rows[0].map(String);
    const nameIndex = findHeaderIndex(headers, ["角色", "角色名", "ign", "name", "character", "昵称"]);
    const classIndex = findHeaderIndex(headers, ["职业", "class", "职业名", "classname"]);
    const levelIndex = findHeaderIndex(headers, ["等级", "level", "lv"]);
    const serverIndex = findHeaderIndex(headers, ["服务器", "server", "world", "区服"]);
    const regionIndex = findHeaderIndex(headers, ["区域", "region"]);
    const roleIndex = findHeaderIndex(headers, ["定位", "role", "角色类型", "类型"]);
    const avatarIndex = findHeaderIndex(headers, ["形象", "avatar", "image", "角色形象"]);
    const equipIndex = findHeaderIndex(headers, ["装备进度", "装备", "equipment", "gear", "loadout"]);
    const professionIndex = findHeaderIndex(headers, ["副专业", "副专业进度", "profession", "crafting", "副职业"]);
    const hexaIndex = findHeaderIndex(headers, ["六转", "6转", "hexa", "6thjob", "hexascore"]);
    const bossMuleIndex = findHeaderIndex(headers, ["bossmule", "搬蛋", "mule", "boss"]);
    const expTrackIndex = findHeaderIndex(headers, ["经验统计", "exptrack", "trackexp", "exp tracking"]);
    const mainStatIndex = findHeaderIndex(headers, ["主属性", "主属", "mainstat"]);
    const attIndex = findHeaderIndex(headers, ["攻击力 / 魔法攻击力", "魔法攻击力", "攻击力", "攻击", "att", "attack", "matt", "magicatt", "magic attack"]);
    const bossIndex = findHeaderIndex(headers, ["boss伤害", "boss伤", "bossdmg", "bossdamage"]);
    const iedIndex = findHeaderIndex(headers, ["无视", "ied"]);
    const critIndex = findHeaderIndex(headers, ["暴击伤害", "critdmg", "critdamage"]);
    const damageIndex = findHeaderIndex(headers, ["伤害", "damage"]);
    const cpIndex = findHeaderIndex(headers, ["战斗力量", "combatpower", "cp"]);

    const fallback = state.characters[0] || cloneSeed().characters[0];
    return rows
      .slice(1)
      .map((row, index) => {
        const name = String(row[nameIndex] || "").trim();
        if (!name) return null;
        const level = parseInt(String(row[levelIndex] || "").replace(/[^\d]/g, ""), 10) || fallback.level;
        const roleRaw = String(row[roleIndex] || "").trim().toLowerCase();
        const role = roleRaw.includes("main") || roleRaw.includes("主")
          ? "main"
          : roleRaw.includes("alt") || roleRaw.includes("副") || roleRaw.includes("sub")
            ? "alt"
            : roleRaw.includes("mule") || roleRaw.includes("搬")
              ? "mule"
              : "mule";
        const classKey = matchClassKey(row[classIndex]);
        const server = String(row[serverIndex] || base.server || fallback.server || "").trim();
        const region = String(row[regionIndex] || base.region || "NA").trim().toUpperCase() === "EU" ? "EU" : "NA";
        const avatarDataUrl = String(row[avatarIndex] || base.avatarDataUrl || "").trim();
        const equipValue = parseFloat(String(row[equipIndex] || "").replace("%", ""));
        const professionValue = parseFloat(String(row[professionIndex] || "").replace("%", ""));
        const hexaValue = parseFloat(String(row[hexaIndex] || "").replace("%", ""));
        const bossMule = row[bossMuleIndex] == null ? role === "mule" : !["0", "false", "否", "no"].includes(String(row[bossMuleIndex]).trim().toLowerCase());
        const expTrack = row[expTrackIndex] == null ? true : !["0", "false", "否", "no"].includes(String(row[expTrackIndex]).trim().toLowerCase());
        const base = state.characters.find((character) => character.classKey === classKey) || fallback;
        const equipment = deepCopy(base.equipment || fallback.equipment || []);
        const professions = deepCopy(base.professions || fallback.professions || []);
        const hexa = deepCopy(base.hexa || fallback.hexa || []);
        if (!Number.isNaN(equipValue)) applyScoreToItems(equipment, equipValue);
        if (!Number.isNaN(professionValue)) applyScoreToItems(professions, professionValue);
        if (!Number.isNaN(hexaValue)) applyScoreToItems(hexa, hexaValue);

        const stats = deepCopy(base.stats || fallback.stats || {});
        const numericOr = (idx) => {
          const value = parseFloat(String(row[idx] || "").replace("%", ""));
          return Number.isNaN(value) ? null : value;
        };
        const mainStat = numericOr(mainStatIndex);
        const att = numericOr(attIndex);
        const boss = numericOr(bossIndex);
        const ied = numericOr(iedIndex);
        const critDamage = numericOr(critIndex);
        const damage = numericOr(damageIndex);
        const combatPower = numericOr(cpIndex);
        if (mainStat !== null) stats.mainStat = mainStat;
        if (att !== null) stats.att = att;
        if (boss !== null) stats.boss = boss;
        if (ied !== null) stats.ied = ied;
        if (critDamage !== null) stats.critDamage = critDamage;
        if (damage !== null) stats.damage = damage;
        if (combatPower !== null) stats.combatPower = combatPower;

        return {
          ...deepCopy(base),
          id: `imported-${String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `character-${index}`}`,
          name,
          classKey,
          level,
          role,
          bossMule,
          expTrack,
      note: "",
          noteEn: "",
          server: server || base.server,
          region,
          avatarDataUrl,
          equipment,
          professions,
          hexa,
          hexaStats: deepCopy(base.hexaStats || fallback.hexaStats || []),
          stats,
        };
      })
      .filter(Boolean);
  }

  function applyScoreToItems(items, score) {
    const safeScore = Math.max(0, Math.min(100, score || 0));
    const targetDone = Math.round((safeScore / 100) * items.length);
    items.forEach((item, index) => {
      if (index < targetDone) {
        item.status = "done";
      } else if (index === targetDone && targetDone < items.length) {
        item.status = "in-progress";
      } else {
        item.status = "waiting";
      }
    });
  }

  function exportCSV() {
    const headers = [
      "角色",
      "职业",
      "等级",
      "服务器",
      "区域",
      "定位",
      "BOSS Mule",
      "经验统计",
      "角色形象",
      "装备进度",
      "副专业进度",
      "六转进度",
      "主属性",
      "攻击力 / 魔法攻击力",
      "BOSS伤害",
      "无视防御",
      "暴击伤害",
      "伤害",
      "战斗力量",
      "日常完成",
      "周常完成",
      "搬蛋完成",
    ];
    const rows = state.characters.map((character) => {
      const daily = characterTaskProgress(character.id, "daily");
      const weekly = characterTaskProgress(character.id, "weekly");
      const boss = bossPlanProgress(character.id);
      return [
        character.name,
        character.classKey,
        character.level,
        character.server,
        character.region || "NA",
        character.role,
        character.bossMule ? "是" : "否",
        character.expTrack === false ? "否" : "是",
        character.avatarDataUrl || "",
        `${Math.round(equipmentScore(character))}%`,
        `${Math.round(professionsScore(character))}%`,
        `${Math.round(hexaScore(character))}%`,
        character.stats?.mainStat || "",
        character.stats?.att || "",
        character.stats?.boss || "",
        character.stats?.ied || "",
        character.stats?.critDamage || "",
        character.stats?.damage || "",
        character.stats?.combatPower || "",
        `${daily.done}/${daily.total}`,
        `${weekly.done}/${weekly.total}`,
        `${boss.done}/${boss.total}`,
      ];
    });
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `冒险岛进度_${state.weeklyKey}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast(t("toast.csvExported"), "success");
  }

  async function importCSV(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const characters = mapImportedRows(parseCSV(text));
      if (!characters.length) throw new Error("empty");
      state.characters = characters;
      state.dailyTaskAssignments = {};
      state.weeklyTaskAssignments = {};
      state.bossMulePlans = {};
      state.dailyBossPlans = {};
      state.dailyBossCompletions = {};
      state.dailyWapUsage = {};
      state.eventCompletions = {};
      ensureDailyBossSchema(state);
      state.dataSource = { type: "imported", url: "", lastSync: new Date().toISOString(), note: `已导入 ${file.name}` };
      saveState();
      render();
      showToast(t("toast.csvImported", { count: characters.length }), "success");
    } catch {
      showToast(t("toast.csvError"), "error");
    }
  }

  function cycleItemStatus(list, index) {
    if (!list?.[index]) return;
    const cycle = ["waiting", "in-progress", "done"];
    const current = list[index].status;
    const next = cycle[(cycle.indexOf(current) + 1) % cycle.length];
    list[index].status = next;
    saveState();
    render();
  }

  function createBlankCharacter() {
    const template = state.characters[0] || cloneSeed().characters[0];
    const blankTemplate = cloneSeed().characters[0] || template;
    return {
      ...deepCopy(template),
      id: "",
      name: "",
      classKey: "NightLord",
      level: 200,
      role: "mule",
      bossMule: true,
      expTrack: true,
      expMetrics: null,
      server: "Scania",
      region: "NA",
      avatarDataUrl: "",
      note: "",
      stats: {
        main: "LUK",
        secondary: "DEX",
        xenonStats: { str: 0, luk: 0, dex: 0 },
        mainStat: 0,
        att: 0,
        boss: 0,
        ied: 0,
        critDamage: 0,
        damage: 0,
        combatPower: 0,
        arcane: 0,
        sacred: 0,
      },
      equipment: deepCopy(blankTemplate.equipment || []).map((item) => ({
        ...item,
        stars: 0,
        targetStars: 0,
        potential: "",
        flame: "",
        note: "",
        noteEn: "",
        catalogId: undefined,
        catalogIcon: undefined,
        catalogLevel: undefined,
        enhancementUnlock: undefined,
        starCap: undefined,
        status: "waiting",
        ...(item.type === "ring_special" ? { specialRingLevel: 0 } : {}),
      })),
      professions: deepCopy(blankTemplate.professions || []).map((item) => ({
        ...item,
        level: 0,
        targetLevel: 0,
        experience: 0,
        experienceGoal: 0,
        mastery: "等级 0",
        masteryEn: "Level 0",
        status: "waiting",
      })),
      hexa: deepCopy(blankTemplate.hexa || []).map((item) => ({ ...item, level: 0, targetLevel: 30, status: "waiting" })),
      hexaStats: (blankTemplate.hexaStats || [{ enabled: false, level: 0, targetLevel: 0 }, { enabled: false, level: 0, targetLevel: 0 }, { enabled: false, level: 0, targetLevel: 0 }]).map((node) => ({ ...node, enabled: false, level: 0, targetLevel: 0 })),
    };
  }

  function updateStatsForClass(draft) {
    if (!draft?.stats) return;
    if (draft.classKey === "Xenon") {
      draft.stats.main = "STR / LUK / DEX";
      draft.stats.secondary = "";
      draft.stats.xenonStats = draft.stats.xenonStats || { str: 0, luk: 0, dex: 0 };
      draft.stats.mainStat =
        Number(draft.stats.xenonStats.str || 0) +
        Number(draft.stats.xenonStats.luk || 0) +
        Number(draft.stats.xenonStats.dex || 0);
      return;
    }
    const style = getClassStyle(draft.classKey);
    const mainByCategory = { 战士: "STR", 弓箭手: "DEX", 盗贼: "LUK", 法师: "INT", 海盗: "STR" };
    const secondaryByCategory = { 战士: "DEX", 弓箭手: "STR", 盗贼: "DEX", 法师: "LUK", 海盗: "DEX" };
    draft.stats.main = mainByCategory[style.category] || draft.stats.main || "STR";
    draft.stats.secondary = secondaryByCategory[style.category] || draft.stats.secondary || "DEX";
  }

  function openCharacterEditor(mode = "create", characterId = null) {
    const draft = mode === "edit" && characterId ? deepCopy(getCharacter(characterId)) : createBlankCharacter();
    characterEditor = {
      mode,
      originalId: characterId,
      draft,
      lookup: { state: "idle", message: "", data: null },
      saving: false,
    };
    renderCharacterEditor();
    $("#characterModal").showModal();
  }

  function closeCharacterEditor() {
    characterEditor = null;
    $("#characterModal")?.close();
  }

  function syncEditorFromForm() {
    if (!characterEditor) return;
    $$("[data-editor-field]", $("#characterForm")).forEach((field) => {
      const name = field.dataset.editorField;
      const value = field.type === "checkbox" ? field.checked : field.value;
      if (name === "avatarDataUrl" && value === "" && characterEditor.draft.avatarDataUrl?.startsWith("data:")) {
        return;
      }
      const parts = name.split(".");
      if (parts.length === 1) {
        characterEditor.draft[name] = value;
      } else if (parts[0] === "stats") {
        characterEditor.draft.stats = characterEditor.draft.stats || {};
        if (parts.length === 2) {
          characterEditor.draft.stats[parts[1]] = field.type === "number" ? Number(value) : value;
        } else if (parts[1] === "xenonStats") {
          characterEditor.draft.stats.xenonStats = characterEditor.draft.stats.xenonStats || {};
          characterEditor.draft.stats.xenonStats[parts[2]] = field.type === "number" ? Number(value) : value;
        }
      }
    });
  }

  function renderClassSelectOptions(selected) {
    return Object.entries(window.CLASS_STYLES)
      .sort((a, b) => (a[1].label || a[0]).localeCompare(b[1].label || b[0], "en"))
      .map(([key, style]) => `<option value="${escapeHtml(key)}" ${selected === key ? "selected" : ""}>${escapeHtml(style.label || key)}</option>`)
      .join("");
  }

  function renderAvatarPreview(draft) {
    if (draft.avatarDataUrl) {
      return `<img class="editor-avatar-image" src="${escapeHtml(draft.avatarDataUrl)}" alt="${escapeHtml(draft.name || "角色形象")}" />`;
    }
    const style = getClassStyle(draft.classKey);
    return `<span class="class-avatar class-avatar-xl" style="--class-color:${style.color}">${escapeHtml(style.short)}</span>`;
  }

  function renderCharacterEditor() {
    if (!characterEditor) return;
    const draft = characterEditor.draft;
    const lookup = characterEditor.lookup;
    const form = $("#characterForm");
    const isXenon = draft.classKey === "Xenon";
    const statFields = isXenon
      ? [
          ["stats.xenonStats.str", t("editor.xenonStr"), "number"],
          ["stats.xenonStats.luk", t("editor.xenonLuk"), "number"],
          ["stats.xenonStats.dex", t("editor.xenonDex"), "number"],
        ]
      : [["stats.mainStat", t("editor.mainStat"), "number"]];
    statFields.push(
      ["stats.att", t(isMagicAttackCharacter(draft) ? "editor.magicAttack" : "editor.attack"), "number"],
      ["stats.boss", t("editor.boss"), "number"],
      ["stats.ied", t("editor.ied"), "number"],
      ["stats.critDamage", t("editor.critDamage"), "number"],
      ["stats.damage", t("editor.damage"), "number"],
      ["stats.combatPower", t("editor.combatPower"), "number"],
      ["stats.arcane", t("editor.arcane"), "number"],
      ["stats.sacred", t("editor.sacred"), "number"],
    );
    form.innerHTML = `
      <div class="modal-heading">
        <div><span class="eyebrow">${characterEditor.mode === "edit" ? "EDIT CHARACTER" : "NEW CHARACTER"}</span><h2>${characterEditor.mode === "edit" ? t("editor.edit") : t("editor.new")}</h2></div>
        <button class="modal-close" type="button" data-close-editor aria-label="${state.language === "en" ? "Close" : "关闭"}">${icon("x", 18)}</button>
      </div>

      <div class="lookup-block">
        <div class="lookup-row">
          <label class="editor-field">
            <span>${t("editor.name")}</span>
            <input data-editor-field="name" type="text" value="${escapeHtml(draft.name)}" placeholder="e.g. NeNemoNe" />
          </label>
          <label class="editor-field editor-field-compact">
            <span>${t("editor.region")}</span>
            <select data-editor-field="region">
              <option value="NA" ${draft.region === "NA" ? "selected" : ""}>NA</option>
              <option value="EU" ${draft.region === "EU" ? "selected" : ""}>EU</option>
            </select>
          </label>
          <button class="button button-primary lookup-button" type="button" data-lookup-character ${lookup.state === "loading" ? "disabled" : ""}>
            ${lookup.state === "loading" ? icon("refresh", 15) : icon("search", 15)} ${lookup.state === "loading" ? t("editor.looking") : t("editor.lookup")}
          </button>
        </div>
        <div class="lookup-message lookup-${lookup.state}">${lookup.state === "error" ? escapeHtml(lookup.message) : lookup.state === "success" ? t("editor.lookupFound", { name: lookup.data?.name || "", level: lookup.data?.level || "—", class: lookup.data?.rawClass || "" }) : ""}</div>
      </div>

      <div class="editor-avatar-row">
        ${renderAvatarPreview(draft)}
        <div class="editor-avatar-fields">
          <label class="editor-field">
            <span>${t("editor.avatarUrl")}</span>
            <input data-editor-field="avatarDataUrl" type="url" value="${escapeHtml(draft.avatarDataUrl?.startsWith("data:") ? "" : draft.avatarDataUrl || "")}" placeholder="https://..." />
          </label>
          <label class="button button-ghost avatar-upload-button">
            ${icon("upload", 15)} ${t("editor.upload")}<input type="file" data-editor-avatar-file accept="image/*" hidden />
          </label>
        </div>
      </div>

      <div class="editor-grid">
        <label class="editor-field">
          <span>${t("editor.class")}</span>
          <select data-editor-field="classKey">${renderClassSelectOptions(draft.classKey)}</select>
        </label>
        <label class="editor-field">
          <span>${t("editor.level")}</span>
          <input data-editor-field="level" type="number" min="1" max="350" value="${escapeHtml(draft.level)}" />
        </label>
        <label class="editor-field">
          <span>${t("editor.server")}</span>
          <input data-editor-field="server" type="text" value="${escapeHtml(draft.server)}" />
        </label>
        <label class="editor-field editor-role-field">
          <span>${t("editor.role")}</span>
          <div class="editor-role-choice" role="radiogroup" aria-label="${t("editor.role")}">
            ${["main", "alt", "mule"]
              .map((role) => {
                const preview = { ...draft, role };
                return `
                  <button class="editor-role-option ${draft.role === role ? "is-active" : ""}" type="button" data-editor-role-option="${role}" aria-pressed="${draft.role === role}">
                    ${characterRoleMarker(preview)}
                    <span>${roleLabel(preview)}</span>
                  </button>
                `;
              })
              .join("")}
          </div>
          <input type="hidden" data-editor-field="role" value="${escapeHtml(draft.role)}" />
        </label>
        <label class="editor-field editor-field-wide">
          <span>${t("editor.note")}</span>
          <input data-editor-field="note" type="text" value="${escapeHtml(draft.note)}" />
        </label>
        <label class="editor-checkbox">
          <input data-editor-field="bossMule" type="checkbox" ${draft.bossMule ? "checked" : ""} />
          <span>${t("editor.bossMule")}</span>
        </label>
        <label class="editor-checkbox">
          <input data-editor-field="expTrack" type="checkbox" ${draft.expTrack !== false ? "checked" : ""} />
          <span>${t("editor.expTrack")}</span>
        </label>
      </div>

      <details class="editor-stats">
        <summary>${t("editor.stats")}</summary>
        <div class="editor-stats-grid">
          ${statFields
            .map(([key, label, type]) => `<label class="editor-field"><span>${label}</span><input data-editor-field="${key}" type="${type}" value="${escapeHtml(key.split(".").reduce((obj, part) => obj?.[part], draft) ?? "")}" /></label>`)
            .join("")}
        </div>
      </details>

      <div class="modal-actions editor-actions">
        <button class="button button-ghost" type="button" data-close-editor>${t("editor.cancel")}</button>
        ${
          characterEditor.mode === "edit"
            ? `<button class="button button-danger-text" type="button" data-delete-character>${icon("trash", 14)} ${t("editor.delete")}</button>`
            : ""
        }
        <button class="button button-primary" type="button" data-save-character>${icon("check", 14)} ${t("editor.save")}</button>
      </div>
    `;
  }

  async function lookupCharacter() {
    if (!characterEditor) return;
    syncEditorFromForm();
    characterEditor.lookup = { state: "loading", message: t("editor.lookupLoading"), data: null };
    renderCharacterEditor();
    try {
      const name = String(characterEditor.draft.name || "").trim();
      const region = characterEditor.draft.region || "NA";
      if (!name) throw new Error(t("editor.lookupError"));
      const response = await fetch(`${API_BASE}/api/character?name=${encodeURIComponent(name)}&region=${encodeURIComponent(region)}`);
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || t("editor.lookupFail"));
      }
      const data = await response.json();
      characterEditor.draft.name = data.name || name;
      characterEditor.draft.level = data.level || characterEditor.draft.level;
      characterEditor.draft.classKey = data.classKey || characterEditor.draft.classKey;
      characterEditor.draft.server = data.world || characterEditor.draft.server;
      characterEditor.draft.avatarDataUrl = data.avatarDataUrl || "";
      updateStatsForClass(characterEditor.draft);
      characterEditor.lookup = { state: "success", message: "", data };
    } catch (error) {
      characterEditor.lookup = { state: "error", message: error.message || t("editor.lookupFail"), data: null };
    }
    renderCharacterEditor();
  }

  function saveCharacterEditor() {
    if (!characterEditor) return;
    syncEditorFromForm();
    const editorMode = characterEditor.mode;
    const draft = characterEditor.draft;
    updateStatsForClass(draft);
    draft.name = String(draft.name || "").trim();
    draft.level = Math.max(1, Math.min(350, Number(draft.level) || 200));
    if (!draft.name) {
      showToast(t("editor.emptyName"), "error");
      return;
    }
    if (characterEditor.mode === "edit") {
      ensureEquipmentSchema([draft]);
    }
    if (draft.expTrack === false) {
      draft.expMetrics = { state: "excluded", fetchedAt: Date.now() };
    } else if (draft.expMetrics?.state === "excluded") {
      delete draft.expMetrics;
    }
    if (characterEditor.mode === "edit") {
      const index = state.characters.findIndex((character) => character.id === characterEditor.originalId);
      if (index >= 0) state.characters[index] = draft;
    } else {
      const baseId = draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "character";
      let id = baseId;
      let counter = 2;
      while (state.characters.some((character) => character.id === id)) {
        id = `${baseId}-${counter}`;
        counter += 1;
      }
      draft.id = id;
      state.characters.push(draft);
      const seedPlans = cloneSeed().dailyBossPlans;
      state.dailyBossPlans[draft.id] = deepCopy(
        seedPlans[state.characters[0]?.id] || Object.values(seedPlans)[0] || [],
      );
      state.bossMulePlans[draft.id] = [];
    }
    state.dataSource = { type: "local", url: "", lastSync: new Date().toISOString(), note: t("data.sourceLocal") };
    saveState();
    closeCharacterEditor();
    render();
    showToast(editorMode === "edit" ? t("editor.saved") : t("editor.added"), "success");
  }

  function removeCharacterRecords(ids) {
    const idSet = new Set(ids);
    const removedCount = state.characters.filter((character) => idSet.has(character.id)).length;
    state.characters = state.characters.filter((character) => !idSet.has(character.id));
    ["dailyCompletions", "eventCompletions", "weeklyCompletions", "bossCompletions"].forEach((field) => {
      state[field] = Object.fromEntries(
        Object.entries(state[field] || {}).filter(([key]) => !idSet.has(key.split(":")[0])),
      );
    });
    ids.forEach((id) => {
      delete state.mulePlans[id];
      delete state.dailyTaskAssignments[id];
      delete state.weeklyTaskAssignments[id];
      delete state.dailyBossPlans[id];
      delete state.dailyWapUsage[id];
      delete state.bossMulePlans[id];
    });
    state.dailyBossCompletions = Object.fromEntries(
      Object.entries(state.dailyBossCompletions || {}).filter(([key]) => !idSet.has(key.split(":")[0])),
    );
    if (detailCharId && idSet.has(detailCharId)) detailCharId = null;
    if (taskCharFilter !== "all" && !getCharacter(taskCharFilter)) {
      taskCharFilter = "all";
      state.lastTaskCharacterFilter = "all";
    }
    if (state.lastCharacterId && !getCharacter(state.lastCharacterId)) {
      state.lastCharacterId = null;
    }
    if (selectedMuleCharacterId && !getCharacter(selectedMuleCharacterId)) {
      selectedMuleCharacterId = null;
      state.lastMuleCharacterId = null;
    }
    return removedCount;
  }

  function deleteCharacterById(id) {
    confirmAction({
      title: t("confirm.deleteTitle"),
      message: t("confirm.deleteMessage"),
      onConfirm: () => {
        removeCharacterRecords([id]);
        saveState();
        render();
        showToast(t("editor.deleted"), "success");
      },
    });
  }

  function updateBatchDeleteUi() {
    const dialog = $("#batchDeleteModal");
    if (!dialog) return;
    const list = $("#batchDeleteList");
    const selectAll = $("#batchDeleteSelectAll");
    const count = $("#batchDeleteCount");
    const confirmButton = $("#batchDeleteConfirmButton");
    const selectedIds = [...batchDeleteSelection].filter((id) => getCharacter(id));

    list.innerHTML = state.characters.length
      ? state.characters
          .map(
            (character) => `
              <label class="batch-delete-item">
                <input
                  type="checkbox"
                  data-batch-delete-char="${escapeHtml(character.id)}"
                  ${batchDeleteSelection.has(character.id) ? "checked" : ""}
                />
                <span class="batch-delete-character">
                  ${classAvatar(character, "sm")}
                  <span class="batch-delete-meta">
                    <strong>${escapeHtml(character.name)}</strong>
                    <span>${escapeHtml(characterClassName(character))} · Lv.${character.level} · ${escapeHtml(character.server)}</span>
                  </span>
                </span>
                <span class="batch-delete-role">${escapeHtml(roleLabel(character))}</span>
              </label>
            `,
          )
          .join("")
      : `<div class="batch-delete-empty">${icon("users", 26)}<span>${t("batchDelete.empty")}</span></div>`;

    selectAll.checked = state.characters.length > 0 && selectedIds.length === state.characters.length;
    count.textContent = state.characters.length ? t("batchDelete.selected", { count: selectedIds.length }) : "";
    confirmButton.disabled = selectedIds.length === 0;
  }

  function openBatchDelete() {
    batchDeleteSelection = new Set();
    updateBatchDeleteUi();
    $("#batchDeleteModal")?.showModal();
  }

  function deleteSelectedCharacters() {
    const selectedIds = [...batchDeleteSelection].filter((id) => getCharacter(id));
    if (!selectedIds.length) {
      showToast(t("batchDelete.empty"), "error");
      return;
    }
    const removedCount = removeCharacterRecords(selectedIds);
    $("#batchDeleteModal")?.close();
    batchDeleteSelection = new Set();
    saveState();
    render();
    showToast(t("batchDelete.done", { count: removedCount }), "success");
  }

  function updateBatchDailyDeleteUi() {
    const character = getCharacter(batchDailyDeleteCharacterId);
    if (!character) return;
    const tasks = dailyTasksForCharacter(character);
    const list = $("#batchDailyDeleteList");
    const selectAll = $("#batchDailyDeleteSelectAll");
    const count = $("#batchDailyDeleteCount");
    const confirmButton = $("#batchDailyDeleteConfirmButton");
    const selectedIds = [...batchDailyDeleteSelection].filter((id) =>
      tasks.some((task) => task.id === id),
    );

    list.innerHTML = tasks.length
      ? tasks
          .map(
            (task) => `
              <label class="batch-delete-item batch-daily-delete-item">
                <input
                  type="checkbox"
                  data-batch-daily-delete-task="${escapeHtml(task.id)}"
                  ${batchDailyDeleteSelection.has(task.id) ? "checked" : ""}
                />
                <span class="batch-delete-character">
                  <span class="daily-task-symbol">${dailyTaskIcon(task)}</span>
                  <span class="batch-delete-meta">
                    <strong>${escapeHtml(localized(task, "name"))}</strong>
                    <span>${escapeHtml(localized(task, "note")) || localized(task, "category")}</span>
                  </span>
                </span>
                <span class="batch-delete-role">${escapeHtml(localized(task, "category"))}</span>
              </label>
            `,
          )
          .join("")
      : `<div class="batch-delete-empty">${icon("trash", 26)}<span>${t("daily.batchDeleteEmpty")}</span></div>`;

    selectAll.checked = tasks.length > 0 && selectedIds.length === tasks.length;
    count.textContent = tasks.length ? t("daily.batchDeleteSelected", { count: selectedIds.length }) : "";
    confirmButton.disabled = selectedIds.length === 0;
  }

  function openBatchDailyDelete() {
    const character = selectedDailyCharacter();
    if (!character) {
      showToast(t("daily.noCharacters"), "error");
      return;
    }
    batchDailyDeleteCharacterId = character.id;
    batchDailyDeleteSelection = new Set();
    updateBatchDailyDeleteUi();
    $("#batchDailyDeleteModal")?.showModal();
  }

  function deleteSelectedDailyTasks() {
    const character = getCharacter(batchDailyDeleteCharacterId);
    const tasks = character ? dailyTasksForCharacter(character) : [];
    const selectedIds = [...batchDailyDeleteSelection].filter((id) =>
      tasks.some((task) => task.id === id),
    );
    if (!character || !selectedIds.length) {
      showToast(t("daily.batchDeleteEmpty"), "error");
      return;
    }

    const removedIds = new Set(selectedIds);
    const assigned = state.dailyTaskAssignments[character.id];
    state.dailyTaskAssignments[character.id] = (Array.isArray(assigned) ? assigned : tasks.map((task) => task.id)).filter(
      (taskId) => !removedIds.has(taskId),
    );
    selectedIds.forEach((taskId) => {
      delete state.dailyCompletions[`${character.id}:${taskId}`];
      delete state.eventCompletions[`${character.id}:${taskId}`];
    });
    if (removedIds.has("daily-bosses")) {
      delete state.dailyBossPlans[character.id];
      state.dailyBossCompletions = Object.fromEntries(
        Object.entries(state.dailyBossCompletions || {}).filter(([key]) => !key.startsWith(`${character.id}:`)),
      );
    }
    if (removedIds.has("wap")) {
      delete state.dailyWapUsage[character.id];
      delete state.dailyCompletions[`${character.id}:wap`];
    }
    if (selectedDailyTaskId && removedIds.has(selectedDailyTaskId)) {
      selectedDailyTaskId = null;
      state.lastDailyTaskId = null;
    }

    $("#batchDailyDeleteModal")?.close();
    batchDailyDeleteSelection = new Set();
    batchDailyDeleteCharacterId = null;
    saveState();
    render();
    showToast(t("daily.batchDeleteDone", { count: selectedIds.length }), "success");
  }

  function deleteCharacterEditor() {
    const id = characterEditor?.originalId;
    if (!id) return;
    closeCharacterEditor();
    deleteCharacterById(id);
  }

  function setItemStatus(kind, index, status) {
    const character = getCharacter(detailCharId);
    if (!character) return;
    const list = kind === "equipment" ? character.equipment : kind === "professions" ? character.professions : character.hexa;
    if (!list?.[index] || !statusMeta[status]) return;
    list[index].status = status;
    saveState();
    render();
  }

  function setAllItemStatus(kind, status) {
    const character = getCharacter(detailCharId);
    if (!character) return;
    const list = kind === "equipment" ? character.equipment : kind === "professions" ? character.professions : character.hexa;
    list.forEach((item) => {
      item.status = status;
    });
    saveState();
    render();
  }

  function applyHexaBudget() {
    const character = getCharacter(detailCharId);
    const input = $("[data-hexa-budget]");
    if (!character || !input) return;
    character.hexaBudget = Math.max(0, Number(input.value) || 0);
    saveState();
    render();
  }

  function updateHexaStatNode(index, field, value) {
    const character = getCharacter(detailCharId);
    if (!character?.hexaStats?.[index]) return;
    const numeric = Math.max(0, Math.min(10, Number(value) || 0));
    character.hexaStats[index][field] = numeric;
    saveState();
    render();
  }

  function toggleHexaStatNode(index, enabled) {
    const character = getCharacter(detailCharId);
    if (!character?.hexaStats?.[index]) return;
    character.hexaStats[index].enabled = Boolean(enabled);
    saveState();
    render();
  }

  function updateHexaStatSettings(field, value) {
    const character = getCharacter(detailCharId);
    if (!character) return;
    if (field === "sunnySunday") character.hexaSunnySunday = Boolean(value);
    if (field === "fragmentPrice") character.hexaFragmentPrice = Math.max(0, Number(value) || 0);
    saveState();
    render();
  }

  function updateProgressNumber(input) {
    const character = getCharacter(detailCharId);
    if (!character) return;
    const kind = input.dataset.progressNumber;
    const index = Number(input.dataset.itemIndex);
    const field = input.dataset.progressField;
    const list = kind === "equipment" ? character.equipment : kind === "professions" ? character.professions : character.hexa;
    if (!list?.[index]) return;
    const item = list[index];
    if (kind === "equipment" && !canEquipmentHaveStars(item) && (field === "stars" || field === "targetStars")) return;
    const professionMax = kind === "professions" ? window.professionMaxLevel(item.type) : kind === "equipment" ? maxEquipmentStars(item) : 30;
    const max = kind === "professions" && field === "experience" ? window.professionMasteryGoal(item.level, item.type) : professionMax;
    const min = kind === "professions" && field !== "experience" ? 1 : 0;
    const value = Math.max(min, Math.min(max, Number(input.value) || 0));
    item[field] = value;
    input.value = value;

    if (kind === "professions" && field === "level") {
      item.targetLevel = Math.max(value, Math.min(professionMax, Number(item.targetLevel) || value));
      const experienceGoal = window.professionMasteryGoal(value, item.type);
      item.experienceGoal = experienceGoal;
      item.experience = Math.min(Number(item.experience) || 0, experienceGoal);
      const rank = window.professionRankMeta(item.type, value);
      item.mastery = rank.zh;
      item.masteryEn = rank.en;
    }

    saveState();

    const card = input.closest(".gear-slot, .profession-card, .hexa-card, .hexa-skill-row");
    const outputSelector = `[data-progress-output="${kind}-${index}"]`;
    const outputs =
      kind === "equipment"
        ? $$(outputSelector)
        : card?.querySelector(outputSelector)
          ? [card.querySelector(outputSelector)]
          : [];
    if (!outputs.length) return;
    if (kind === "equipment") {
      const starsOutput = `${item.stars}<i>★</i>${item.targetStars != null ? ` / ${item.targetStars}★` : ""}`;
      outputs.forEach((output) => {
        output.innerHTML = starsOutput;
      });
    } else if (kind === "professions") {
      const output = outputs[0];
      const experienceGoal = window.professionMasteryGoal(item.level, item.type);
      const experience = Math.max(0, Math.min(experienceGoal, Number(item.experience) || 0));
      const percent = experienceGoal ? (experience / experienceGoal) * 100 : 100;
      output.textContent = `Lv.${item.level}${item.targetLevel != null ? ` / ${item.targetLevel}` : ""}`;

      const experienceLabel = card?.querySelector(`[data-profession-experience="${index}"]`);
      if (experienceLabel) {
        experienceLabel.textContent = experienceGoal ? `${formatNumber(experience)} / ${formatNumber(experienceGoal)}` : t("profession.max");
        experienceLabel.classList.toggle("is-max", !experienceGoal);
      }
      const progressFill = card?.querySelector(`[data-profession-progress="${index}"] .progress-fill`);
      if (progressFill) progressFill.style.width = `${percent}%`;
      const rankLabel = card?.querySelector(`[data-profession-rank="${index}"]`);
      if (rankLabel) {
        const rank = window.professionRankMeta(item.type, item.level);
        rankLabel.textContent = state.language === "en" ? rank.en : rank.zh;
        rankLabel.classList.toggle("is-max", !experienceGoal);
      }
      const experienceInput = card?.querySelector('[data-progress-field="experience"]');
      if (experienceInput) {
        experienceInput.max = experienceGoal;
        experienceInput.disabled = experienceGoal === 0;
        if (Number(experienceInput.value) > experienceGoal) experienceInput.value = experience;
      }
    } else {
      const output = outputs[0];
      const maxLevel = item.type === "origin" ? 1 : 30;
      output.innerHTML = `Lv.${item.level}<small>/ ${item.targetLevel ?? maxLevel}</small>`;
    }
  }

  function applyEquipmentCatalog(select) {
    const index = Number(select.dataset.equipmentCatalog);
    applyEquipmentCatalogEntry(index, select.value);
  }

  function applyEquipmentCatalogEntry(index, catalogId) {
    const character = getCharacter(detailCharId);
    const item = character?.equipment?.[index];
    if (!item) return;
    let selectedCatalogEntry = null;

    if (catalogId) {
      selectedCatalogEntry = (window.EQUIPMENT_CATALOG?.items || []).find((catalogItem) => catalogItem.id === catalogId);
      if (!selectedCatalogEntry) return;
      item.catalogId = selectedCatalogEntry.id;
      item.catalogIcon = selectedCatalogEntry.icon;
      item.catalogLevel = selectedCatalogEntry.level;
      item.name = selectedCatalogEntry.name;
      item.nameEn = selectedCatalogEntry.name;
    } else {
      const template = cloneSeed().characters[0].equipment[index];
      if (template) {
        item.name = template.name;
        item.nameEn = template.nameEn;
      }
      delete item.catalogId;
      delete item.catalogIcon;
      delete item.catalogLevel;
    }
    if (equipmentPotentialBoost(item)) {
      const lowOptions = equipmentPotentialOptionsForTier(item, character, false);
      const highOptions = equipmentPotentialOptionsForTier(item, character, true);
      const lowIndex = lowOptions.indexOf(item.potential);
      if (lowIndex >= 0) item.potential = highOptions[lowIndex];
    }
    if (item.type === "badge") {
      const unlocked = Boolean(selectedCatalogEntry?.enhancementUnlock);
      item.enhancementUnlock = unlocked;
      item.flame = "";
      if (!unlocked) {
        item.stars = 0;
        item.targetStars = 0;
        item.potential = "";
      }
    } else if (item.type === "android") {
      const unlocked = Boolean(selectedCatalogEntry?.enhancementUnlock);
      item.enhancementUnlock = unlocked;
      item.starCap = Number(selectedCatalogEntry?.starCap) || 0;
      item.stars = Math.min(Number(item.stars) || 0, item.starCap);
      item.targetStars = Math.min(Number(item.targetStars) || 0, item.starCap);
      if (!unlocked) {
        item.stars = 0;
        item.targetStars = 0;
        item.potential = "";
      }
    } else if (["ring", "ring_special"].includes(item.type)) {
      const specialRing = selectedCatalogEntry?.slot === "ring_special";
      delete item.enhancementUnlock;
      delete item.starCap;
      if (specialRing) {
        const maxLevel = window.SPECIAL_RING_EFFECTS?.[selectedCatalogEntry.id]?.maxLevel || 6;
        item.specialRingLevel = Math.max(1, Math.min(maxLevel, Number(item.specialRingLevel) || 1));
        item.stars = 0;
        item.targetStars = 0;
        item.flame = "";
        item.potential = "";
      } else {
        delete item.specialRingLevel;
        item.flame = "";
      }
    } else {
      delete item.enhancementUnlock;
      delete item.starCap;
    }
    saveState();
    render();
  }

  function openEquipmentCatalogModal(character, index, item) {
    const entries = catalogEntriesForSlot(item.type, character);
    if (!entries.length) return;
    const group = armorClassGroup(character);
    $("#equipmentCatalogSlot").textContent = `${localized(item, "name")} · ${group}`;
    $("#equipmentCatalogTitle").textContent = t("equipment.catalog");
    $("#equipmentCatalogGrid").innerHTML = `
      <button
        class="equipment-catalog-card"
        type="button"
        data-equipment-catalog-choose=""
        data-equipment-catalog-index="${index}"
      >
        <span class="equipment-catalog-thumb equipment-catalog-reset-thumb">${icon("refresh", 20)}</span>
        <span class="equipment-catalog-copy">
          <b>${t("equipment.catalogDefault")}</b>
          <small>${t("equipment.catalogReset")}</small>
        </span>
      </button>
      ${entries
        .map(
          (entry) => `
            <button
              class="equipment-catalog-card ${item.catalogId === entry.id ? "is-selected" : ""}"
              type="button"
              data-equipment-catalog-choose="${escapeHtml(entry.id)}"
              data-equipment-catalog-index="${index}"
            >
              <span class="equipment-catalog-thumb">${equipmentVisual({ type: item.type, catalogIcon: entry.icon })}</span>
              <span class="equipment-catalog-copy">
                <b>${escapeHtml(entry.name)}</b>
                <small>Lv.${entry.level} · ${escapeHtml(entry.setName)}</small>
              </span>
            </button>
          `,
        )
        .join("")}
    `;
    $("#equipmentCatalogModal").showModal();
  }

  function openTaskEditor(group) {
    taskEditor = { group, name: "", note: "" };
    renderTaskEditor();
    $("#taskModal").showModal();
  }

  function closeTaskEditor() {
    taskEditor = null;
    $("#taskModal")?.close();
  }

  function renderTaskEditor() {
    if (!taskEditor) return;
    $("#taskForm").innerHTML = `
      <div class="modal-heading">
        <div><span class="eyebrow">CUSTOM TASK</span><h2>${t("task.addTitle")}</h2></div>
        <button class="modal-close" type="button" data-close-task-editor aria-label="${state.language === "en" ? "Close" : "关闭"}">${icon("x", 18)}</button>
      </div>
      <label class="editor-field">
        <span>${t("task.name")}</span>
        <input data-task-editor-field="name" type="text" value="${escapeHtml(taskEditor.name)}" />
      </label>
      <label class="editor-field">
        <span>${t("task.note")}</span>
        <input data-task-editor-field="note" type="text" value="${escapeHtml(taskEditor.note)}" />
      </label>
      <label class="editor-field">
        <span>${t("task.group")}</span>
        <select data-task-editor-field="group">
          <option value="daily" ${taskEditor.group === "daily" ? "selected" : ""}>${t("task.dailyOption")}</option>
          <option value="weekly" ${taskEditor.group === "weekly" ? "selected" : ""}>${t("task.weeklyOption")}</option>
        </select>
      </label>
      <div class="modal-actions">
        <button class="button button-ghost" type="button" data-close-task-editor>${t("editor.cancel")}</button>
        <button class="button button-primary" type="button" data-save-task>${icon("check", 14)} ${t("task.save")}</button>
      </div>
    `;
  }

  function syncTaskEditorFromForm() {
    if (!taskEditor) return;
    $$("[data-task-editor-field]", $("#taskForm")).forEach((field) => {
      taskEditor[field.dataset.taskEditorField] = field.value;
    });
  }

  function saveCustomTask() {
    syncTaskEditorFromForm();
    const name = String(taskEditor.name || "").trim();
    if (!name) {
      showToast(t("editor.emptyName"), "error");
      return;
    }
    const customTask = {
      id: `custom-${Date.now()}`,
      group: taskEditor.group === "weekly" ? "weekly" : "daily",
      category: "自定义",
      categoryEn: "Custom",
      name,
      nameEn: name,
      note: taskEditor.note || "",
      noteEn: taskEditor.note || "",
      minLevel: 0,
      custom: true,
    };
    state.taskDefinitions.push(customTask);
    if (customTask.group === "daily") {
      const selectedCharacter = getCharacter(taskCharFilter) || state.characters[0] || null;
      if (selectedCharacter) {
        const assigned = state.dailyTaskAssignments[selectedCharacter.id];
        state.dailyTaskAssignments[selectedCharacter.id] = [
          ...(Array.isArray(assigned) ? assigned : dailyTasksForCharacter(selectedCharacter).map((task) => task.id)),
          customTask.id,
        ];
        selectedDailyTaskId = customTask.id;
        state.lastDailyTaskId = customTask.id;
      }
    } else if (customTask.group === "weekly") {
      const selectedCharacter = getCharacter(taskCharFilter) || state.characters[0] || null;
      if (selectedCharacter) {
        const assigned = state.weeklyTaskAssignments[selectedCharacter.id];
        state.weeklyTaskAssignments[selectedCharacter.id] = [
          ...(Array.isArray(assigned) ? assigned : weeklyTasksForCharacter(selectedCharacter).map((task) => task.id)),
          customTask.id,
        ];
        selectedWeeklyTaskId = customTask.id;
        state.lastWeeklyTaskId = customTask.id;
      }
    }
    state.dataSource = { type: "local", url: "", lastSync: new Date().toISOString(), note: t("data.sourceLocal") };
    saveState();
    closeTaskEditor();
    render();
    showToast(t("task.added"), "success");
  }

  function deleteCustomTask(taskId) {
    state.taskDefinitions = state.taskDefinitions.filter((task) => task.id !== taskId);
    state.dailyCompletions = Object.fromEntries(Object.entries(state.dailyCompletions).filter(([key]) => !key.endsWith(`:${taskId}`)));
    state.eventCompletions = Object.fromEntries(Object.entries(state.eventCompletions || {}).filter(([key]) => !key.endsWith(`:${taskId}`)));
    state.weeklyCompletions = Object.fromEntries(Object.entries(state.weeklyCompletions).filter(([key]) => !key.endsWith(`:${taskId}`)));
    Object.entries(state.dailyTaskAssignments || {}).forEach(([characterId, taskIds]) => {
      if (Array.isArray(taskIds)) {
        state.dailyTaskAssignments[characterId] = taskIds.filter((id) => id !== taskId);
      }
    });
    Object.entries(state.weeklyTaskAssignments || {}).forEach(([characterId, taskIds]) => {
      if (Array.isArray(taskIds)) {
        state.weeklyTaskAssignments[characterId] = taskIds.filter((id) => id !== taskId);
      }
    });
    if (selectedWeeklyTaskId === taskId) {
      selectedWeeklyTaskId = null;
      state.lastWeeklyTaskId = null;
    }
    saveState();
    render();
    showToast(t("task.deleted"), "success");
  }

  function clearAllBosses(characterId) {
    const plan = bossPlan(characterId);
    plan.forEach((entry) => {
      entry.completed = true;
    });
    saveState();
    render();
  }

  function addBossMuleEntry(characterId, bossId, difficultyId, partySize) {
    const character = getCharacter(characterId);
    const boss = getBossMuleBoss(bossId);
    const difficulty = getBossMuleDifficulty(bossId, difficultyId);
    if (!character || !boss || !difficulty || character.level < (boss.minLevel || 0)) return null;
    const plan = state.bossMulePlans?.[characterId] || [];
    const entryId = `${bossId}:${difficultyId}`;
    if (plan.some((entry) => entry.id === entryId)) return null;
    const entry = {
      id: entryId,
      bossId,
      difficultyId,
      partySize: Math.max(1, Math.min(Number(boss.maxPartySize) || 6, Number(partySize) || 1)),
      completed: false,
    };
    state.bossMulePlans[characterId] = [...plan, entry];
    saveState();
    return entry;
  }

  function deleteBossMuleEntry(characterId, entryId) {
    const plan = state.bossMulePlans?.[characterId];
    if (!Array.isArray(plan)) return false;
    state.bossMulePlans[characterId] = plan.filter((entry) => entry.id !== entryId);
    saveState();
    return true;
  }

  function updateBossMuleEntryConfig(characterId, entryId, difficultyId, partySize) {
    const entry = bossPlan(characterId).find((item) => item.id === entryId);
    if (!entry) return;
    const boss = getBossMuleBoss(entry.bossId);
    const character = getCharacter(characterId);
    if (!boss || !character || character.level < (boss.minLevel || 0)) return;
    if (getBossMuleDifficulty(entry.bossId, difficultyId)) {
      entry.difficultyId = difficultyId;
    }
    entry.partySize = Math.max(1, Math.min(Number(boss?.maxPartySize) || 6, Number(partySize) || 1));
    saveState();
  }

  function bindStaticEvents() {
    $("#mobileMenuButton")?.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-open");
    });
    $("#backdrop")?.addEventListener("click", closeSidebar);
    $("#resetWeekButton")?.addEventListener("click", resetWeek);
    $("#exportButton")?.addEventListener("click", exportCSV);
    $("#batchDeleteOpenButton")?.addEventListener("click", openBatchDelete);
    $("#batchDeleteConfirmButton")?.addEventListener("click", deleteSelectedCharacters);
    $("#batchDeleteModal")?.addEventListener("close", () => {
      batchDeleteSelection = new Set();
    });
    $("#batchDailyDeleteConfirmButton")?.addEventListener("click", deleteSelectedDailyTasks);
    $("#batchDailyDeleteModal")?.addEventListener("close", () => {
      batchDailyDeleteSelection = new Set();
      batchDailyDeleteCharacterId = null;
    });
    $("#dailyAddModal")?.addEventListener("close", () => {
      dailyAddCharacterId = null;
      dailyAddSelection = new Set();
    });
    $("#batchWeeklyDeleteConfirmButton")?.addEventListener("click", deleteSelectedWeeklyTasks);
    $("#batchWeeklyDeleteModal")?.addEventListener("close", () => {
      batchWeeklyDeleteSelection = new Set();
      batchWeeklyDeleteCharacterId = null;
    });
    $("#weeklyAddModal")?.addEventListener("close", () => {
      weeklyAddCharacterId = null;
      weeklyAddSelection = new Set();
    });
    $("#muleAddModal")?.addEventListener("close", () => {
      muleAddDrafts = {};
    });
    $("#characterModal")?.addEventListener("close", () => {
      characterEditor = null;
    });
    $("#characterForm")?.addEventListener("keydown", (event) => {
      const field = event.target;
      const isEnterField =
        (field instanceof HTMLInputElement &&
          ["text", "search", "url", "number", "email", "password"].includes(field.type)) ||
        field instanceof HTMLSelectElement;
      if (event.key === "Enter" && isEnterField && !event.isComposing && characterEditor) {
        event.preventDefault();
        lookupCharacter();
      }
    });
    $("#taskModal")?.addEventListener("close", () => {
      taskEditor = null;
    });

    document.addEventListener("focusin", (event) => {
      if (event.target?.matches("[data-equipment-catalog-search]")) {
        event.target.closest(".equipment-catalog-searchbox")?.classList.remove("is-collapsed");
      }
    });

    document.addEventListener("pointerdown", (event) => {
      const orderHandle = event.target.closest("[data-order-drag-handle]");
      if (orderHandle) {
        orderDrag = {
          kind: orderHandle.dataset.orderDragHandle,
          characterId: orderHandle.dataset.orderCharacterId,
          itemId: orderHandle.dataset.orderItemId,
        };
        orderDragStartX = event.clientX;
        orderDragStartY = event.clientY;
        orderDragTarget = null;
        document.body.classList.add("is-order-dragging");
        orderHandle.classList.add("is-dragging");
        orderHandle.setPointerCapture?.(event.pointerId);
        event.preventDefault();
        return;
      }
      const handle = event.target.closest("[data-character-drag-handle]");
      if (!handle) return;
      characterDragId = handle.dataset.characterDragHandle;
      characterDragStartX = event.clientX;
      characterDragStartY = event.clientY;
      characterDragTarget = null;
      document.body.classList.add("is-character-dragging");
      handle.classList.add("is-dragging");
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });

    document.addEventListener("pointermove", (event) => {
      if (orderDrag) {
        const distance = Math.hypot(event.clientX - orderDragStartX, event.clientY - orderDragStartY);
        if (distance < 7) return;
        orderDragTarget?.classList.remove("is-order-target");
        orderDragTarget = null;
        const target = document
          .elementFromPoint(event.clientX, event.clientY)
          ?.closest("[data-order-item-id]");
        if (
          target &&
          target.dataset.orderKind === orderDrag.kind &&
          target.dataset.orderCharacterId === orderDrag.characterId &&
          target.dataset.orderItemId !== orderDrag.itemId
        ) {
          orderDragTarget = target;
          target.classList.add("is-order-target");
        }
        return;
      }
      if (!characterDragId) return;
      const distance = Math.hypot(event.clientX - characterDragStartX, event.clientY - characterDragStartY);
      if (distance < 7) return;
      characterDragTarget?.classList.remove("is-drag-target");
      characterDragTarget = null;
      const target = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest("[data-character-id]");
      if (target && target.dataset.characterId !== characterDragId) {
        characterDragTarget = target;
        target.classList.add("is-drag-target");
      }
    });

    document.addEventListener("pointerup", (event) => {
      if (orderDrag) {
        if (orderDragTarget) {
          const rect = orderDragTarget.getBoundingClientRect();
          const horizontal = rect.width > rect.height * 1.4;
          const before = horizontal
            ? event.clientX < rect.left + rect.width / 2
            : event.clientY < rect.top + rect.height / 2;
          reorderOrderedCollection(
            orderDrag.kind,
            orderDrag.characterId,
            orderDrag.itemId,
            orderDragTarget.dataset.orderItemId,
            before,
          );
          render();
        }
        clearOrderDragState();
        return;
      }
      if (!characterDragId) return;
      if (characterDragTarget) {
        const rect = characterDragTarget.getBoundingClientRect();
        const before = event.clientY < rect.top + rect.height / 2;
        reorderCharacters(characterDragId, characterDragTarget.dataset.characterId, before);
        render();
      }
      clearCharacterDragState();
    });

    document.addEventListener("pointercancel", () => {
      clearCharacterDragState();
      clearOrderDragState();
    });

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-character-drag-handle], [data-order-drag-handle]")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      const languageButton = event.target.closest("[data-language]");
      if (languageButton) {
        setLanguage(languageButton.dataset.language);
        return;
      }

      const navItem = event.target.closest("[data-view]");
      if (navItem) {
        event.preventDefault();
        if (navItem.dataset.view === "tasks" && navItem.dataset.taskGroup) {
          taskGroupFilter = navItem.dataset.taskGroup;
          state.lastTaskGroupFilter = taskGroupFilter;
        } else if (navItem.dataset.view === "tasks") {
          taskGroupFilter = taskGroupFilter === "weekly" ? "weekly" : "daily";
          state.lastTaskGroupFilter = taskGroupFilter;
        }
        setView(navItem.dataset.view);
        return;
      }

      const roleFilterButton = event.target.closest("[data-role-filter]");
      if (roleFilterButton) {
        roleFilter = roleFilterButton.dataset.roleFilter;
        render();
        return;
      }

      const taskFilterButton = event.target.closest("[data-task-filter]");
      if (taskFilterButton) {
        taskCharFilter = taskFilterButton.dataset.taskFilter;
        state.lastTaskCharacterFilter = taskCharFilter;
        saveStateNow();
        render();
        return;
      }

      const taskGroupButton = event.target.closest("[data-task-group]");
      if (taskGroupButton) {
        taskGroupFilter = taskGroupButton.dataset.taskGroup;
        state.lastTaskGroupFilter = taskGroupFilter;
        saveStateNow();
        render();
        return;
      }

      const weeklyTaskSelect = event.target.closest("[data-weekly-task-select]");
      if (weeklyTaskSelect) {
        const taskId = weeklyTaskSelect.dataset.weeklyTaskSelect;
        selectedWeeklyTaskId = taskId;
        state.lastWeeklyTaskId = selectedWeeklyTaskId;
        saveStateNow();
        if (taskId === "full-boss-clear") {
          setView("mules");
        } else {
          render();
        }
        return;
      }

      const batchWeeklyDeleteOpen = event.target.closest("[data-batch-delete-weekly-open]");
      if (batchWeeklyDeleteOpen) {
        openBatchWeeklyDelete();
        return;
      }

      const weeklyAddOpen = event.target.closest("[data-weekly-add-open]");
      if (weeklyAddOpen) {
        openWeeklyAdd();
        return;
      }

      const weeklyAddSelect = event.target.closest("[data-weekly-add-select]");
      if (weeklyAddSelect) {
        const taskId = weeklyAddSelect.dataset.weeklyAddSelect;
        if (weeklyAddSelection.has(taskId)) {
          weeklyAddSelection.delete(taskId);
        } else {
          weeklyAddSelection.add(taskId);
        }
        updateWeeklyAddUi();
        return;
      }

      const weeklyAddCustom = event.target.closest("[data-weekly-add-custom]");
      if (weeklyAddCustom) {
        openCustomWeeklyFromAdd();
        return;
      }

      const weeklyAddConfirm = event.target.closest("[data-weekly-add-confirm]");
      if (weeklyAddConfirm) {
        addWeeklyPresets([...weeklyAddSelection]);
        return;
      }

      const dailyTaskSelect = event.target.closest("[data-daily-task-select]");
      if (dailyTaskSelect) {
        selectedDailyTaskId = dailyTaskSelect.dataset.dailyTaskSelect;
        state.lastDailyTaskId = selectedDailyTaskId;
        saveStateNow();
        render();
        return;
      }

      const batchDailyDeleteOpen = event.target.closest("[data-batch-delete-daily-open]");
      if (batchDailyDeleteOpen) {
        openBatchDailyDelete();
        return;
      }

      const dailyAddOpen = event.target.closest("[data-daily-add-open]");
      if (dailyAddOpen) {
        openDailyAdd();
        return;
      }

      const dailyAddSelect = event.target.closest("[data-daily-add-select]");
      if (dailyAddSelect) {
        const taskId = dailyAddSelect.dataset.dailyAddSelect;
        if (dailyAddSelection.has(taskId)) {
          dailyAddSelection.delete(taskId);
        } else {
          dailyAddSelection.add(taskId);
        }
        updateDailyAddUi();
        return;
      }

      const dailyAddConfirm = event.target.closest("[data-daily-add-confirm]");
      if (dailyAddConfirm) {
        addDailyPresets([...dailyAddSelection]);
        return;
      }

      const dailyAddCustom = event.target.closest("[data-daily-add-custom]");
      if (dailyAddCustom) {
        openCustomDailyFromAdd();
        return;
      }

      const closeEditorButton = event.target.closest("[data-close-editor]");
      if (closeEditorButton) {
        closeCharacterEditor();
        return;
      }

      const editorRoleOption = event.target.closest("[data-editor-role-option]");
      if (editorRoleOption && characterEditor) {
        characterEditor.draft.role = editorRoleOption.dataset.editorRoleOption;
        const roleInput = $('[data-editor-field="role"]');
        if (roleInput) roleInput.value = characterEditor.draft.role;
        $$(".editor-role-option").forEach((option) => {
          option.classList.toggle("is-active", option.dataset.editorRoleOption === characterEditor.draft.role);
          option.setAttribute("aria-pressed", String(option.dataset.editorRoleOption === characterEditor.draft.role));
        });
        return;
      }

      const closeTaskEditorButton = event.target.closest("[data-close-task-editor]");
      if (closeTaskEditorButton) {
        closeTaskEditor();
        return;
      }

      const saveTaskButton = event.target.closest("[data-save-task]");
      if (saveTaskButton) {
        saveCustomTask();
        return;
      }

      const saveCharacterButton = event.target.closest("[data-save-character]");
      if (saveCharacterButton) {
        saveCharacterEditor();
        return;
      }

      const lookupButton = event.target.closest("[data-lookup-character]");
      if (lookupButton) {
        lookupCharacter();
        return;
      }

      const deleteModalCharacterButton = event.target.closest("[data-delete-character]");
      if (deleteModalCharacterButton) {
        deleteCharacterEditor();
        return;
      }

      const addTaskButton = event.target.closest("[data-add-task]");
      if (addTaskButton) {
        openTaskEditor(addTaskButton.dataset.addTask);
        return;
      }

      const deleteTaskButton = event.target.closest("[data-delete-task]");
      if (deleteTaskButton) {
        deleteCustomTask(deleteTaskButton.dataset.deleteTask);
        return;
      }

      const newCharacterButton = event.target.closest("[data-new-character]");
      if (newCharacterButton) {
        openCharacterEditor("create");
        return;
      }

      const lookupOpenButton = event.target.closest("[data-lookup-open]");
      if (lookupOpenButton) {
        openCharacterEditor("create");
        return;
      }

      const editCharacterButton = event.target.closest("[data-edit-char]");
      if (editCharacterButton) {
        openCharacterEditor("edit", editCharacterButton.dataset.editChar);
        return;
      }

      const deleteCharacterButton = event.target.closest("[data-delete-char]");
      if (deleteCharacterButton) {
        deleteCharacterById(deleteCharacterButton.dataset.deleteChar);
        return;
      }

      const refreshExpButton = event.target.closest("[data-refresh-exp-overview]");
      if (refreshExpButton) {
        refreshOverviewExp();
        return;
      }

      const overviewWeeklyTask = event.target.closest("[data-overview-weekly-task]");
      if (overviewWeeklyTask) {
        const taskId = overviewWeeklyTask.dataset.overviewWeeklyTask;
        const characterId = overviewWeeklyTask.dataset.characterId;
        const task = getTask(taskId);
        if (task && getCharacter(characterId)) {
          taskGroupFilter = "weekly";
          state.lastTaskGroupFilter = "weekly";
          taskCharFilter = characterId;
          state.lastTaskCharacterFilter = characterId;
          selectedWeeklyTaskId = taskId;
          state.lastWeeklyTaskId = taskId;
          if (taskId === "full-boss-clear") {
            setView("mules");
          } else {
            setView("tasks");
          }
        }
        return;
      }

      const overviewBossMule = event.target.closest("[data-overview-boss-mule-character]");
      if (overviewBossMule) {
        selectedMuleCharacterId = overviewBossMule.dataset.overviewBossMuleCharacter;
        state.lastMuleCharacterId = selectedMuleCharacterId;
        setView("mules");
        return;
      }

      const overviewDailyTask = event.target.closest("[data-overview-daily-task]");
      if (overviewDailyTask) {
        const taskId = overviewDailyTask.dataset.overviewDailyTask;
        const characterId = overviewDailyTask.dataset.characterId;
        const task = getTask(taskId);
        if (task && getCharacter(characterId)) {
          taskGroupFilter = "daily";
          state.lastTaskGroupFilter = "daily";
          taskCharFilter = characterId;
          state.lastTaskCharacterFilter = characterId;
          selectedDailyTaskId = taskId;
          state.lastDailyTaskId = taskId;
          setView("tasks");
        }
        return;
      }

      const overviewJump = event.target.closest("[data-overview-jump]");
      if (overviewJump) {
        const target = overviewJump.dataset.overviewJump;
        const characterId = overviewJump.dataset.characterId;
        if (target === "daily" || target === "weekly") {
          openTaskGroup(characterId, target);
        } else if (target === "boss") {
          setView("mules");
        } else {
          setView("characters");
        }
        return;
      }

      const openChar = event.target.closest("[data-open-char]");
      if (openChar) {
        detailCharId = openChar.dataset.openChar;
        detailTab = "gear";
        selectedEquipmentIndex = 0;
        state.lastView = "characters";
        state.lastCharacterId = detailCharId;
        state.lastDetailTab = detailTab;
        state.lastEquipmentIndex = selectedEquipmentIndex;
        saveStateNow();
        render();
        return;
      }

      const backButton = event.target.closest("[data-back-to-characters]");
      if (backButton) {
        detailCharId = null;
        state.lastCharacterId = null;
        state.lastDetailTab = "gear";
        saveStateNow();
        render();
        return;
      }

      const detailTabButton = event.target.closest("[data-detail-tab]");
      if (detailTabButton) {
        detailTab = detailTabButton.dataset.detailTab;
        state.lastDetailTab = detailTab;
        saveStateNow();
        render();
        return;
      }

      const catalogChoose = event.target.closest("[data-equipment-catalog-choose]");
      if (catalogChoose) {
        const index = Number(catalogChoose.dataset.equipmentCatalogIndex);
        applyEquipmentCatalogEntry(index, catalogChoose.dataset.equipmentCatalogChoose || "");
        $("#equipmentCatalogModal")?.close();
        showToast(t("equipment.catalogImported"), "success");
        return;
      }

      const catalogSearchChoose = event.target.closest("[data-equipment-catalog-search-choose]");
      if (catalogSearchChoose) {
        const index = Number(catalogSearchChoose.dataset.equipmentCatalogIndex);
        applyEquipmentCatalogEntry(index, catalogSearchChoose.dataset.equipmentCatalogSearchChoose || "");
        render();
        return;
      }

      const catalogSearchClear = event.target.closest("[data-equipment-catalog-clear]");
      if (catalogSearchClear) {
        const index = Number(catalogSearchClear.dataset.equipmentCatalogClear);
        applyEquipmentCatalogEntry(index, "");
        render();
        return;
      }

      const equipmentSelect = event.target.closest("[data-equipment-select]");
      if (equipmentSelect) {
        const index = Number(equipmentSelect.dataset.equipmentSelect);
        const character = getCharacter(detailCharId);
        const item = character?.equipment?.[index];
        if (item) {
          selectedEquipmentIndex = index;
          state.lastEquipmentIndex = index;
          saveStateNow();
          render();
        }
        return;
      }

      const setEffectDetail = event.target.closest("[data-set-effect-detail]");
      if (setEffectDetail) {
        openSetEffectModal(setEffectDetail.dataset.setEffectDetail);
        return;
      }

      const setStatusButton = event.target.closest("[data-set-status]");
      if (setStatusButton) {
        setItemStatus(setStatusButton.dataset.setStatus, Number(setStatusButton.dataset.itemIndex), setStatusButton.dataset.status);
        return;
      }

      const setAllStatusButton = event.target.closest("[data-set-all-status]");
      if (setAllStatusButton) {
        setAllItemStatus(setAllStatusButton.dataset.setAllStatus, setAllStatusButton.dataset.status);
        return;
      }

      const applyHexaBudgetButton = event.target.closest("[data-apply-hexa-budget]");
      if (applyHexaBudgetButton) {
        applyHexaBudget();
        return;
      }

      const collapseHexaGroupButton = event.target.closest("[data-collapse-hexa-group]");
      if (collapseHexaGroupButton) {
        toggleHexaGroup(collapseHexaGroupButton.dataset.collapseHexaGroup);
        return;
      }

      const collapseHexaStatButton = event.target.closest("[data-collapse-hexa-stat]");
      if (collapseHexaStatButton) {
        toggleHexaStatSection();
        return;
      }

      if (event.target.closest("[data-progress-number]")) {
        return;
      }

      const slotButton = event.target.closest("[data-slot-cycle]");
      if (slotButton) {
        const character = getCharacter(detailCharId);
        cycleItemStatus(character?.equipment, Number(slotButton.dataset.slotCycle));
        return;
      }

      const professionButton = event.target.closest("[data-profession-cycle]");
      if (professionButton) {
        const character = getCharacter(detailCharId);
        cycleItemStatus(character?.professions, Number(professionButton.dataset.professionCycle));
        return;
      }

      const hexaButton = event.target.closest("[data-hexa-cycle]");
      if (hexaButton) {
        const character = getCharacter(detailCharId);
        cycleItemStatus(character?.hexa, Number(hexaButton.dataset.hexaCycle));
        return;
      }

      const dailyBossExpand = event.target.closest("[data-daily-boss-expand]");
      if (dailyBossExpand) {
        dailyBossExpanded = !dailyBossExpanded;
        render();
        return;
      }

      const dailyBossToggle = event.target.closest("[data-daily-boss-toggle]");
      if (dailyBossToggle) {
        toggleDailyBoss(dailyBossToggle.dataset.characterId, dailyBossToggle.dataset.dailyBossToggle);
        render();
        return;
      }

      const dailyBossRemove = event.target.closest("[data-daily-boss-remove]");
      if (dailyBossRemove) {
        deleteDailyBoss(dailyBossRemove.dataset.characterId, dailyBossRemove.dataset.dailyBossRemove);
        render();
        showToast(t("dailyBoss.deleted"), "success");
        return;
      }

      const dailyBossAdd = event.target.closest("[data-daily-boss-add]");
      if (dailyBossAdd) {
        const select = $("[data-daily-boss-add-select]");
        if (select?.value && addDailyBoss(dailyBossAdd.dataset.dailyBossAdd, select.value)) {
          render();
          showToast(t("dailyBoss.added"), "success");
        }
        return;
      }

      const dailyBossMarkAll = event.target.closest("[data-daily-boss-mark-all]");
      if (dailyBossMarkAll) {
        const characterId = dailyBossMarkAll.dataset.dailyBossMarkAll;
        const progress = dailyBossProgress(characterId);
        setAllDailyBosses(characterId, !(progress.total > 0 && progress.done === progress.total));
        render();
        return;
      }

      const wapReset = event.target.closest("[data-wap-reset]");
      if (wapReset) {
        const characterId = wapReset.dataset.wapReset;
        state.dailyWapUsage[characterId] = 0;
        delete state.dailyCompletions[`${characterId}:wap`];
        saveState();
        render();
        return;
      }

      const taskToggle = event.target.closest("[data-task-toggle]");
      if (taskToggle) {
        toggleTask(taskToggle.dataset.taskToggle, taskToggle.dataset.characterId);
        render();
        return;
      }

      const markDailyCharacter = event.target.closest("[data-mark-daily-character]");
      if (markDailyCharacter) {
        markAllGroup("daily", markDailyCharacter.dataset.markDailyCharacter);
        return;
      }

      const markWeeklyCharacter = event.target.closest("[data-mark-weekly-character]");
      if (markWeeklyCharacter) {
        markAllGroup("weekly", markWeeklyCharacter.dataset.markWeeklyCharacter);
        return;
      }

      const taskCharacterToggle = event.target.closest("[data-task-character]");
      if (taskCharacterToggle) {
        toggleTask(taskCharacterToggle.dataset.taskCharacter, taskCharacterToggle.dataset.characterId);
        render();
        return;
      }

      const markGroup = event.target.closest("[data-mark-group]");
      if (markGroup) {
        markAllGroup(markGroup.dataset.markGroup);
        return;
      }

      const muleCharacterButton = event.target.closest("[data-mule-character]");
      if (muleCharacterButton) {
        selectedMuleCharacterId = muleCharacterButton.dataset.muleCharacter;
        state.lastMuleCharacterId = selectedMuleCharacterId;
        saveStateNow();
        render();
        return;
      }

      const muleAddOpen = event.target.closest("[data-mule-add-open]");
      if (muleAddOpen) {
        openMuleAdd();
        return;
      }

      const muleAddSingle = event.target.closest("[data-mule-add-single]");
      if (muleAddSingle) {
        addSingleMuleBoss(muleAddSingle.dataset.muleAddSingle);
        return;
      }

      const muleAllDone = event.target.closest("[data-mule-all-done]");
      if (muleAllDone) {
        clearAllBosses(muleAllDone.dataset.muleAllDone);
        return;
      }

      const muleBossRemove = event.target.closest("[data-mule-boss-remove]");
      if (muleBossRemove) {
        deleteBossMuleEntry(muleBossRemove.dataset.characterId, muleBossRemove.dataset.muleBossRemove);
        render();
        showToast(t("mule.deleted"), "success");
        return;
      }

      const muleBossToggle = event.target.closest("[data-mule-boss-toggle]");
      if (muleBossToggle) {
        if (event.target.closest(".mule-selected-boss-controls")) return;
        toggleBoss(muleBossToggle.dataset.characterId, muleBossToggle.dataset.muleBossToggle);
        render();
        return;
      }

      const bossToggle = event.target.closest("[data-boss-id]");
      if (bossToggle) {
        toggleBoss(bossToggle.dataset.bossChar, bossToggle.dataset.bossId);
        render();
        return;
      }

      const clearAll = event.target.closest("[data-boss-clear-all]");
      if (clearAll) {
        clearAllBosses(clearAll.dataset.bossClearAll);
        return;
      }

      const resetSampleButton = event.target.closest("#resetSampleButton");
      if (resetSampleButton) {
        resetSample();
        return;
      }

      const exportCsvButton = event.target.closest("[data-export-csv]");
      if (exportCsvButton) {
        exportCSV();
      }
    });

    document.addEventListener("change", (event) => {
      if (event.target?.matches("[data-batch-delete-char]")) {
        const characterId = event.target.dataset.batchDeleteChar;
        if (event.target.checked) {
          batchDeleteSelection.add(characterId);
        } else {
          batchDeleteSelection.delete(characterId);
        }
        updateBatchDeleteUi();
        return;
      }
      if (event.target?.id === "batchDeleteSelectAll") {
        batchDeleteSelection = event.target.checked
          ? new Set(state.characters.map((character) => character.id))
          : new Set();
        updateBatchDeleteUi();
        return;
      }
      if (event.target?.matches("[data-batch-daily-delete-task]")) {
        const taskId = event.target.dataset.batchDailyDeleteTask;
        if (event.target.checked) {
          batchDailyDeleteSelection.add(taskId);
        } else {
          batchDailyDeleteSelection.delete(taskId);
        }
        updateBatchDailyDeleteUi();
        return;
      }
      if (event.target?.id === "batchDailyDeleteSelectAll") {
        const character = getCharacter(batchDailyDeleteCharacterId);
        const tasks = character ? dailyTasksForCharacter(character) : [];
        batchDailyDeleteSelection = event.target.checked
          ? new Set(tasks.map((task) => task.id))
          : new Set();
        updateBatchDailyDeleteUi();
        return;
      }
      if (event.target?.matches("[data-batch-weekly-delete-task]")) {
        const taskId = event.target.dataset.batchWeeklyDeleteTask;
        if (event.target.checked) {
          batchWeeklyDeleteSelection.add(taskId);
        } else {
          batchWeeklyDeleteSelection.delete(taskId);
        }
        updateBatchWeeklyDeleteUi();
        return;
      }
      if (event.target?.id === "batchWeeklyDeleteSelectAll") {
        const character = getCharacter(batchWeeklyDeleteCharacterId);
        const tasks = character ? weeklyTasksForCharacter(character) : [];
        batchWeeklyDeleteSelection = event.target.checked
          ? new Set(tasks.map((task) => task.id))
          : new Set();
        updateBatchWeeklyDeleteUi();
        return;
      }
      if (event.target?.matches("[data-mule-add-difficulty]")) {
        const bossId = event.target.dataset.muleAddDifficulty;
        muleAddDrafts[bossId] = {
          ...(muleAddDrafts[bossId] || {}),
          difficultyId: event.target.value,
        };
        return;
      }
      if (event.target?.matches("[data-mule-add-party]")) {
        const bossId = event.target.dataset.muleAddParty;
        muleAddDrafts[bossId] = {
          ...(muleAddDrafts[bossId] || {}),
          partySize: event.target.value,
        };
        return;
      }
      if (event.target?.matches("[data-mule-edit-difficulty]")) {
        const characterId = selectedMuleCharacter()?.id;
        const entryId = event.target.dataset.muleEditDifficulty;
        const entry = characterId ? bossPlan(characterId).find((item) => item.id === entryId) : null;
        if (characterId && entry) {
          updateBossMuleEntryConfig(characterId, entryId, event.target.value, entry.partySize);
          render();
        }
        return;
      }
      if (event.target?.matches("[data-mule-edit-party]")) {
        const characterId = selectedMuleCharacter()?.id;
        const entryId = event.target.dataset.muleEditParty;
        const entry = characterId ? bossPlan(characterId).find((item) => item.id === entryId) : null;
        if (characterId && entry) {
          updateBossMuleEntryConfig(characterId, entryId, entry.difficultyId, event.target.value);
          render();
        }
        return;
      }
      if (event.target?.matches("[data-wap-usage-input]")) {
        const characterId = event.target.dataset.characterId;
        const value = Math.max(0, Math.floor(Number(event.target.value) || 0));
        state.dailyWapUsage[characterId] = value;
        saveState();
        render();
        return;
      }
      if (event.target?.id === "csvFile") {
        importCSV(event.target.files?.[0]);
        event.target.value = "";
      }
      if (event.target?.matches("[data-editor-field]")) {
        syncEditorFromForm();
        if (event.target.dataset.editorField === "classKey" && characterEditor) {
          updateStatsForClass(characterEditor.draft);
          renderCharacterEditor();
        }
      }
      if (event.target?.matches("[data-editor-avatar-file]") && event.target.files?.[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (characterEditor) {
            characterEditor.draft.avatarDataUrl = String(reader.result || "");
            renderCharacterEditor();
          }
        };
        reader.readAsDataURL(file);
      }
      if (event.target?.matches("[data-hexa-stat-toggle]")) {
        toggleHexaStatNode(Number(event.target.dataset.hexaStatToggle), event.target.checked);
      }
      if (event.target?.matches("[data-hexa-stat-field]")) {
        updateHexaStatNode(
          Number(event.target.dataset.hexaStatIndex),
          event.target.dataset.hexaStatField,
          event.target.value,
        );
      }
      if (event.target?.matches("[data-hexa-stat-sunny]")) {
        updateHexaStatSettings("sunnySunday", event.target.checked);
      }
      if (event.target?.matches("[data-hexa-stat-fragment-price]")) {
        updateHexaStatSettings("fragmentPrice", event.target.value);
      }
      if (event.target?.matches("[data-equipment-catalog]")) {
        applyEquipmentCatalog(event.target);
      }
      if (event.target?.matches("[data-equipment-potential]")) {
        const character = getCharacter(detailCharId);
        const item = character?.equipment?.[Number(event.target.dataset.equipmentPotential)];
        if (item && canEquipmentHavePotential(item)) {
          item.potential = event.target.value;
          saveState();
          render();
        }
      }
      if (event.target?.matches("[data-equipment-special-ring-level]")) {
        const character = getCharacter(detailCharId);
        const item = character?.equipment?.[Number(event.target.dataset.equipmentSpecialRingLevel)];
        if (item && isSpecialRingEquipment(item)) {
          const maxLevel = specialRingEffectData(item)?.maxLevel || 6;
          item.specialRingLevel = Math.max(1, Math.min(Number(maxLevel), Number(event.target.value) || 1));
          saveState();
          render();
        }
      }
    });

    document.addEventListener("input", (event) => {
      if (event.target?.matches("[data-equipment-catalog-search]")) {
        updateEquipmentCatalogSearch(event.target);
        return;
      }
      if (event.target?.matches("[data-progress-number]")) {
        updateProgressNumber(event.target);
        return;
      }
      if (event.target?.id === "characterSearch") {
        characterSearch = event.target.value;
        render();
        $("#characterSearch")?.focus();
      }
      if (event.target?.matches("[data-editor-field]")) {
        syncEditorFromForm();
      }
      if (event.target?.matches("[data-task-editor-field]")) {
        syncTaskEditorFromForm();
      }
    });
  }

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
  }

  function hydrateIcons() {
    $$("[data-icon]").forEach((element) => {
      element.innerHTML = icon(element.dataset.icon);
    });
  }

  function init() {
    hydrateIcons();
    normalizePeriods();
    bindStaticEvents();
    renderResetStrip();
    render();
    setInterval(() => {
      if (normalizePeriods()) render();
      renderResetStrip();
    }, 30000);
  }

  init();
})();
