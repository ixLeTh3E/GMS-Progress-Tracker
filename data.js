window.GMS_CONFIG = Object.freeze({
  resetUtcHour: 0,
  eventResetDay: 3,
  weeklyResetDay: 4,
  bossResetDay: 4,
});

const professionMaxLevels = Object.freeze({
  smithing: 12,
  accessory: 12,
  alchemy: 12,
  mining: 10,
  herbalism: 10,
});

const professionMasteryGoals = Object.freeze({
  1: 250,
  2: 600,
  3: 1050,
  4: 1600,
  5: 2250,
  6: 3000,
  7: 3850,
  8: 4900,
  9: 5850,
  10: 45000,
  11: 160000,
});

const professionMesosToLevel = Object.freeze({
  1: 15000,
  2: 25000,
  3: 40000,
  4: 60000,
  5: 85000,
  6: 115000,
  7: 150000,
  8: 190000,
  9: 235000,
  10: 1000000,
  11: 0,
});

function professionMaxLevel(type) {
  return professionMaxLevels[type] ?? 10;
}

function professionMasteryGoal(level, type) {
  const maxLevel = professionMaxLevel(type);
  if (level >= maxLevel) return 0;
  return professionMasteryGoals[level] ?? 0;
}

function professionRankMeta(type, level) {
  if (professionMaxLevel(type) === 12 && level >= 12) {
    return { zh: "匠人", en: "Meister" };
  }
  if (professionMaxLevel(type) === 12 && level >= 11) {
    return { zh: "名匠", en: "Master Craftsman" };
  }
  return { zh: `等级 ${level}`, en: `Level ${level}` };
}

window.PROFESSION_RULES = Object.freeze({
  maxLevels: professionMaxLevels,
  masteryGoals: professionMasteryGoals,
  mesosToLevel: professionMesosToLevel,
});
window.professionMaxLevel = professionMaxLevel;
window.professionMasteryGoal = professionMasteryGoal;
window.professionRankMeta = professionRankMeta;

window.CLASS_STYLES = Object.freeze({
  NightLord: { short: "NL", color: "#9d7cf5", category: "盗贼", label: "Night Lord" },
  Shadower: { short: "SD", color: "#7c6ef2", category: "盗贼", label: "Shadower" },
  DualBlade: { short: "DB", color: "#b37ded", category: "盗贼", label: "Dual Blade" },
  NightWalker: { short: "NW", color: "#8c74ee", category: "盗贼", label: "Night Walker" },
  Phantom: { short: "PH", color: "#9ba7d6", category: "盗贼", label: "Phantom" },
  Cadena: { short: "CD", color: "#ef8aa8", category: "盗贼", label: "Cadena" },
  Hoyoung: { short: "HY", color: "#4fc6c1", category: "盗贼", label: "Hoyoung" },
  Khali: { short: "KH", color: "#9a6dd6", category: "盗贼", label: "Khali" },
  Hero: { short: "HE", color: "#e56a5d", category: "战士", label: "Hero" },
  Paladin: { short: "PA", color: "#f2d35c", category: "战士", label: "Paladin" },
  DarkKnight: { short: "DK", color: "#a86568", category: "战士", label: "Dark Knight" },
  DawnWarrior: { short: "DW", color: "#f0a44a", category: "战士", label: "Dawn Warrior" },
  Mihile: { short: "MI", color: "#f0c15d", category: "战士", label: "Mihile" },
  Aran: { short: "AR", color: "#6aa9e8", category: "战士", label: "Aran" },
  Kaiser: { short: "KS", color: "#e25f55", category: "战士", label: "Kaiser" },
  Adele: { short: "AD", color: "#9ad2ef", category: "战士", label: "Adele" },
  Ren: { short: "RN", color: "#e68aa6", category: "战士", label: "Ren" },
  ErelLight: { short: "EL", color: "#f0c66b", category: "战士", label: "Erel Light" },
  Zero: { short: "ZR", color: "#c8d96c", category: "战士", label: "Zero" },
  DemonSlayer: { short: "DS", color: "#8b6ccf", category: "战士", label: "Demon Slayer" },
  DemonAvenger: { short: "DA", color: "#d25e77", category: "战士", label: "Demon Avenger" },
  Blaster: { short: "BL", color: "#ee7db0", category: "战士", label: "Blaster" },
  Xenon: { short: "XE", color: "#75c5c5", category: "海盗", label: "Xenon", groups: ["Pirate", "Thief"] },
  MoXuan: { short: "MX", color: "#5fb5a4", category: "海盗", label: "Mo Xuan" },
  Bowmaster: { short: "BM", color: "#68b95c", category: "弓箭手", label: "Bowmaster" },
  Marksman: { short: "MM", color: "#79c264", category: "弓箭手", label: "Marksman" },
  Pathfinder: { short: "PF", color: "#62c49c", category: "弓箭手", label: "Pathfinder" },
  WindArcher: { short: "WA", color: "#91cf5d", category: "弓箭手", label: "Wind Archer" },
  WildHunter: { short: "WH", color: "#6aa6e8", category: "弓箭手", label: "Wild Hunter" },
  Mercedes: { short: "ME", color: "#72a9e8", category: "弓箭手", label: "Mercedes" },
  Kain: { short: "KN", color: "#a05f78", category: "弓箭手", label: "Kain" },
  Buccaneer: { short: "BU", color: "#57bed0", category: "海盗", label: "Buccaneer" },
  Corsair: { short: "CS", color: "#5a91ce", category: "海盗", label: "Corsair" },
  Cannoneer: { short: "CN", color: "#65a8bf", category: "海盗", label: "Cannoneer" },
  Mechanic: { short: "MC", color: "#6fc0a8", category: "海盗", label: "Mechanic" },
  Shade: { short: "SH", color: "#68c99b", category: "海盗", label: "Shade" },
  ThunderBreaker: { short: "TB", color: "#f2a04c", category: "海盗", label: "Thunder Breaker" },
  Ark: { short: "AK", color: "#9a72d8", category: "海盗", label: "Ark" },
  AngelicBuster: { short: "AB", color: "#ef77b4", category: "海盗", label: "Angelic Buster" },
  Bishop: { short: "BS", color: "#68b9f6", category: "法师", label: "Bishop" },
  IceLightning: { short: "IL", color: "#68b8f2", category: "法师", label: "Arch Mage (Ice/Lightning)" },
  FirePoison: { short: "FP", color: "#f06b5e", category: "法师", label: "Arch Mage (Fire/Poison)" },
  Luminous: { short: "LU", color: "#e2c765", category: "法师", label: "Luminous" },
  Evan: { short: "EV", color: "#6c7fe0", category: "法师", label: "Evan" },
  BattleMage: { short: "BAM", color: "#7b6dd8", category: "法师", label: "Battle Mage" },
  BlazeWizard: { short: "BW", color: "#f08c52", category: "法师", label: "Blaze Wizard" },
  Kinesis: { short: "KI", color: "#58a9a8", category: "法师", label: "Kinesis" },
  Illium: { short: "IL2", color: "#9b8dde", category: "法师", label: "Illium" },
  Lara: { short: "LA", color: "#e5a25f", category: "法师", label: "Lara" },
  Kanna: { short: "KA", color: "#dd7390", category: "法师", label: "Kanna" },
  Lynn: { short: "LN", color: "#68bfa2", category: "法师", label: "Lynn" },
  Hayato: { short: "HT", color: "#d8674f", category: "战士", label: "Hayato" },
  Sia: { short: "SI", color: "#7f7de8", category: "法师", label: "Sia Astelle" },
});

const equipmentTemplate = [
  { name: "主武器", nameEn: "Weapon", type: "weapon", stars: 23, targetStars: 23, potential: "36% ATT", flame: "S", status: "done", note: "23星 9攻", noteEn: "23★ 9 ATT" },
  { name: "副武器", nameEn: "Secondary", type: "secondary", stars: 22, targetStars: 22, potential: "36% ATT", flame: "", status: "done", note: "21% BOSS", noteEn: "21% Boss" },
  { name: "徽章", nameEn: "Emblem", type: "emblem", stars: 0, targetStars: 0, potential: "33% ATT", flame: "", status: "done", note: "3条攻击", noteEn: "3L ATT" },
  { name: "帽子", nameEn: "Hat", type: "hat", stars: 22, targetStars: 22, potential: "27% Main Stat", flame: "S", status: "done", note: "幸运装备", noteEn: "Lucky item" },
  { name: "上衣", nameEn: "Top", type: "top", stars: 22, targetStars: 22, potential: "30% Main Stat", flame: "A", status: "done", note: "", noteEn: "" },
  { name: "裤子", nameEn: "Bottom", type: "bottom", stars: 22, targetStars: 22, potential: "27% Main Stat", flame: "A", status: "done", note: "", noteEn: "" },
  { name: "手套", nameEn: "Gloves", type: "gloves", stars: 22, targetStars: 22, potential: "30% Main Stat", flame: "A", status: "in-progress", note: "洗爆率", noteEn: "Cube crit" },
  { name: "披风", nameEn: "Cape", type: "cape", stars: 21, targetStars: 22, potential: "27% Main Stat", flame: "A", status: "done", note: "", noteEn: "" },
  { name: "鞋子", nameEn: "Shoes", type: "shoes", stars: 22, targetStars: 22, potential: "27% Main Stat", flame: "A", status: "done", note: "", noteEn: "" },
  { name: "腰带", nameEn: "Belt", type: "belt", stars: 22, targetStars: 22, potential: "24% Main Stat", flame: "S", status: "in-progress", note: "缺一条", noteEn: "One line missing" },
  { name: "吊坠 I", nameEn: "Pendant I", type: "pendant", stars: 22, targetStars: 22, potential: "30% Main Stat", flame: "S", status: "done", note: "", noteEn: "" },
  { name: "吊坠 II", nameEn: "Pendant II", type: "pendant", stars: 0, targetStars: 22, potential: "", flame: "", status: "waiting", note: "", noteEn: "" },
  { name: "戒指 I", nameEn: "Ring I", type: "ring", stars: 22, targetStars: 22, potential: "27% Main Stat", flame: "", status: "done", note: "", noteEn: "" },
  { name: "戒指 II", nameEn: "Ring II", type: "ring", stars: 22, targetStars: 23, potential: "24% Main Stat", flame: "", status: "waiting", note: "待换根源戒指", noteEn: "Awaiting Genesis ring" },
  { name: "戒指 III", nameEn: "Ring III", type: "ring", stars: 0, targetStars: 22, potential: "", flame: "", status: "waiting", note: "", noteEn: "" },
  { name: "戒指 IV", nameEn: "Ring IV", type: "ring", stars: 0, targetStars: 22, potential: "", flame: "", status: "waiting", note: "", noteEn: "" },
  { name: "口袋", nameEn: "Pocket", type: "pocket", stars: 0, targetStars: 0, potential: "", flame: "S", status: "waiting", note: "BOSS 口袋待换", noteEn: "Replace boss pocket" },
  { name: "脸饰", nameEn: "Face Accessory", type: "face", stars: 0, targetStars: 0, potential: "", flame: "", status: "waiting", note: "", noteEn: "" },
  { name: "眼饰", nameEn: "Eye Accessory", type: "eye", stars: 0, targetStars: 0, potential: "", flame: "", status: "waiting", note: "", noteEn: "" },
  { name: "勋章", nameEn: "Medal", type: "medal", stars: 0, targetStars: 0, potential: "", flame: "", status: "waiting", note: "", noteEn: "" },
  { name: "徽章", nameEn: "Badge", type: "badge", stars: 0, targetStars: 0, potential: "", flame: "", status: "waiting", note: "", noteEn: "" },
  { name: "机器人心脏", nameEn: "Android Heart", type: "android", stars: 0, targetStars: 0, potential: "", flame: "", status: "waiting", note: "", noteEn: "" },
  { name: "肩饰", nameEn: "Shoulder", type: "shoulder", stars: 0, targetStars: 22, potential: "", flame: "", status: "waiting", note: "", noteEn: "" },
  { name: "耳环", nameEn: "Earrings", type: "earrings", stars: 0, targetStars: 22, potential: "", flame: "", status: "waiting", note: "", noteEn: "" },
  { name: "特殊戒指", nameEn: "Special Ring", type: "ring_special", stars: 0, targetStars: 0, potential: "", flame: "", specialRingLevel: 1, status: "waiting", note: "", noteEn: "" },
];

function makeEquipment(overrides = {}) {
  return equipmentTemplate.map((item, index) => {
    const isAttackType = ["weapon", "secondary", "emblem"].includes(item.type);
    const cannotHaveStars = ["emblem", "pocket", "medal", "ring_special"].includes(item.type);
    return {
      ...item,
      stars: cannotHaveStars
        ? 0
        : overrides.starsFloor != null
          ? Math.max(0, item.stars - (index % 3) - overrides.starsFloor)
          : item.stars,
      targetStars: cannotHaveStars
        ? 0
        : overrides.starsFloor != null
          ? Math.max(0, item.targetStars - (index % 3) - overrides.starsFloor)
          : item.targetStars,
      potential:
        item.potential && overrides.tier === "mid"
          ? isAttackType
            ? overrides.magicAttack
              ? "30% MATT"
              : "30% ATT"
            : "21% Main Stat"
          : overrides.magicAttack && isAttackType && item.potential
            ? "36% MATT"
            : item.potential,
      status: overrides.weakIndexes?.includes(index) ? "waiting" : item.status,
    };
  });
}

const professionsTemplate = [
  { name: "锻造", nameEn: "Smithing", type: "smithing", level: 12, targetLevel: 12, experience: 0, status: "done" },
  { name: "饰品制作", nameEn: "Accessory Crafting", type: "accessory", level: 12, targetLevel: 12, experience: 0, status: "done" },
  { name: "炼金术", nameEn: "Alchemy", type: "alchemy", level: 10, targetLevel: 12, experience: 28500, status: "in-progress" },
  { name: "采矿", nameEn: "Mining", type: "mining", level: 8, targetLevel: 10, experience: 3250, focus: "采集", focusEn: "Gather", status: "in-progress" },
  { name: "药草采集", nameEn: "Herbalism", type: "herbalism", level: 7, targetLevel: 10, experience: 2400, focus: "采集", focusEn: "Gather", status: "in-progress" },
];

function makeProfessions(overrides = {}) {
  return professionsTemplate.map((item, index) => {
    const maxLevel = professionMaxLevel(item.type);
    const level = Math.max(1, Math.min(maxLevel, item.level - (overrides.levelOffset || 0)));
    const targetLevel = Math.max(level, Math.min(maxLevel, item.targetLevel ?? maxLevel));
    const experienceGoal = professionMasteryGoal(level, item.type);
    const experience = Math.max(0, Math.min(experienceGoal, item.experience ?? 0));
    const rank = professionRankMeta(item.type, level);
    return {
      ...item,
      level,
      targetLevel,
      experience,
      experienceGoal,
      mastery: rank.zh,
      masteryEn: rank.en,
      status: overrides.waitingIndexes?.includes(index) ? "waiting" : item.status,
    };
  });
}

const hexaTemplate = [
  { name: "精通技能 I", nameEn: "Mastery Skill I", type: "mastery-1", category: "精通技能", categoryEn: "Mastery Skills", level: 30, targetLevel: 30, core: "精通", coreEn: "Mastery", status: "done", erdaGoal: 83, fragmentGoal: 2252 },
  { name: "精通技能 II", nameEn: "Mastery Skill II", type: "mastery-2", category: "精通技能", categoryEn: "Mastery Skills", level: 25, targetLevel: 30, core: "精通", coreEn: "Mastery", status: "in-progress", erdaGoal: 83, fragmentGoal: 2252 },
  { name: "精通技能 III", nameEn: "Mastery Skill III", type: "mastery-3", category: "精通技能", categoryEn: "Mastery Skills", level: 20, targetLevel: 30, core: "精通", coreEn: "Mastery", status: "in-progress", erdaGoal: 83, fragmentGoal: 2252 },
  { name: "精通技能 IV", nameEn: "Mastery Skill IV", type: "mastery-4", category: "精通技能", categoryEn: "Mastery Skills", level: 15, targetLevel: 30, core: "精通", coreEn: "Mastery", status: "in-progress", erdaGoal: 83, fragmentGoal: 2252 },
  { name: "强化技能 I", nameEn: "Enhancement Skill I", type: "enhancement-1", category: "强化技能", categoryEn: "Enhancement Skills", level: 20, targetLevel: 25, core: "强化", coreEn: "Enhancement", status: "in-progress", erdaGoal: 123, fragmentGoal: 3383 },
  { name: "强化技能 II", nameEn: "Enhancement Skill II", type: "enhancement-2", category: "强化技能", categoryEn: "Enhancement Skills", level: 15, targetLevel: 25, core: "强化", coreEn: "Enhancement", status: "in-progress", erdaGoal: 123, fragmentGoal: 3383 },
  { name: "强化技能 III", nameEn: "Enhancement Skill III", type: "enhancement-3", category: "强化技能", categoryEn: "Enhancement Skills", level: 10, targetLevel: 25, core: "强化", coreEn: "Enhancement", status: "in-progress", erdaGoal: 123, fragmentGoal: 3383 },
  { name: "强化技能 IV", nameEn: "Enhancement Skill IV", type: "enhancement-4", category: "强化技能", categoryEn: "Enhancement Skills", level: 5, targetLevel: 20, core: "强化", coreEn: "Enhancement", status: "waiting", erdaGoal: 123, fragmentGoal: 3383 },
  { name: "起源技能 I", nameEn: "Origin Skill I", type: "origin-1", category: "起源技能", categoryEn: "Origin Skills", level: 1, targetLevel: 1, core: "起源", coreEn: "Origin", status: "done", erdaGoal: 150, fragmentGoal: 4500 },
  { name: "起源技能 II", nameEn: "Origin Skill II", type: "origin-2", category: "起源技能", categoryEn: "Origin Skills", level: 1, targetLevel: 1, core: "起源", coreEn: "Origin", status: "done", erdaGoal: 150, fragmentGoal: 4500 },
  { name: "Sol Janus", nameEn: "Sol Janus", type: "common-janus", category: "共通技能", categoryEn: "Common Skills", level: 12, targetLevel: 20, core: "共通", coreEn: "Common", status: "in-progress", erdaGoal: 208, fragmentGoal: 6268 },
  { name: "Sol Hecate", nameEn: "Sol Hecate", type: "common-hecate", category: "共通技能", categoryEn: "Common Skills", level: 8, targetLevel: 20, core: "共通", coreEn: "Common", status: "waiting", erdaGoal: 208, fragmentGoal: 6268 },
  { name: "六转属性", nameEn: "Hexa Stat", type: "common-stat", category: "共通技能", categoryEn: "Common Skills", level: 3, targetLevel: 10, core: "六转属性", coreEn: "Hexa Stat", status: "waiting", erdaGoal: 30, fragmentGoal: 1522 },
];

const hexaStatsTemplate = [
  { enabled: true, level: 0, targetLevel: 10 },
  { enabled: false, level: 0, targetLevel: 0 },
  { enabled: false, level: 0, targetLevel: 0 },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

function makeHexa(overrides = {}) {
  return hexaTemplate.map((item, index) => ({
    ...item,
    level:
      overrides.floorIndexes?.includes(index)
        ? Math.max(0, item.level - 4)
        : overrides.freshIndexes?.includes(index)
          ? 1
          : item.level,
    targetLevel:
      overrides.floorIndexes?.includes(index)
        ? Math.max(1, item.targetLevel - 4)
        : item.targetLevel,
    status: overrides.waitingIndexes?.includes(index) ? "waiting" : item.status,
  }));
}

const characters = [
  {
    id: "feliuca",
    name: "Feliuca",
    classKey: "Xenon",
    level: 292,
    role: "main",
    bossMule: true,
    expTrack: true,
    server: "Scania",
    region: "NA",
    avatarDataUrl: "",
    note: "",
    noteEn: "",
    stats: {
      main: "STR / LUK / DEX",
      secondary: "",
      mainStat: 81000,
      xenonStats: { str: 27000, luk: 27000, dex: 27000 },
      att: 4380,
      boss: 486,
      ied: 96.8,
      critDamage: 91,
      damage: 38,
      combatPower: 186,
      arcane: 1450,
      sacred: 350,
    },
    equipment: makeEquipment(),
    professions: makeProfessions(),
    hexa: makeHexa(),
    hexaStats: clone(hexaStatsTemplate),
  },
  {
    id: "Yat1ma",
    name: "Yat1ma",
    classKey: "Lynn",
    level: 286,
    role: "mule",
    bossMule: true,
    expTrack: true,
    server: "Scania",
    region: "NA",
    avatarDataUrl: "",
    note: "",
    noteEn: "",
    stats: {
      main: "INT",
      secondary: "LUK",
      mainStat: 49200,
      att: 3860,
      boss: 421,
      ied: 95.2,
      critDamage: 78,
      damage: 27,
      combatPower: 158,
      arcane: 1420,
      sacred: 300,
    },
    equipment: makeEquipment({ starsFloor: 1, weakIndexes: [13, 16], magicAttack: true }),
    professions: makeProfessions({ levelOffset: 40 }),
    hexa: makeHexa({ floorIndexes: [4], waitingIndexes: [5] }),
    hexaStats: clone(hexaStatsTemplate).map((node) => ({ ...node, enabled: false })),
  },
];

const taskDefinitions = [
  { id: "arcane-dailies", group: "daily", category: "每日核心", categoryEn: "Core Daily", name: "神秘河每日", nameEn: "Arcane River Dailies", minLevel: 200, note: "Arcane 区域任务与灵魂艾尔达", noteEn: "Arcane quests and Soul Erda" },
  { id: "grandis-dailies", group: "daily", category: "每日核心", categoryEn: "Core Daily", name: "格兰蒂斯每日", nameEn: "Grandis Dailies", minLevel: 260, note: "Sacred 区域任务", noteEn: "Sacred region quests" },
  { id: "monster-park", group: "daily", category: "每日核心", categoryEn: "Core Daily", name: "怪物公园", nameEn: "Monster Park", minLevel: 105, note: "每日 7 次", noteEn: "7 runs daily" },
  { id: "ursus", group: "daily", category: "经济日常", categoryEn: "Meso Daily", name: "乌鲁斯", nameEn: "Ursus", minLevel: 200, note: "3 次", noteEn: "3 runs" },
  { id: "maple-tour", group: "daily", category: "经济日常", categoryEn: "Meso Daily", name: "Maple Tour", nameEn: "Maple Tour", minLevel: 105, note: "2 次", noteEn: "2 runs" },
  { id: "wap", group: "daily", category: "经济日常", categoryEn: "Meso Daily", name: "WAP", nameEn: "WAP", minLevel: 0, note: "Wealth Acquisition Potion (30min)", noteEn: "Wealth Acquisition Potion (30min)" },
  { id: "daily-bosses", group: "daily", category: "经济日常", categoryEn: "Meso Daily", name: "每日 BOSS", nameEn: "Daily Bosses", minLevel: 200, note: "展开管理每日 BOSS", noteEn: "Expand to manage daily bosses" },
  { id: "event-daily", group: "daily", category: "活动日常", categoryEn: "Event Daily", name: "活动日常", nameEn: "Event Daily", minLevel: 0, note: "北京时间周三 08:00 重置", noteEn: "Resets Wednesday 08:00 CST" },
  { id: "monster-park-extreme", group: "weekly", category: "周常副本", categoryEn: "Weekly Dungeon", name: "怪物公园极限", nameEn: "Monster Park Extreme", minLevel: 140, note: "周日开放", noteEn: "Sundays only" },
  { id: "epic-high-mountain", group: "weekly", category: "史诗副本", categoryEn: "Epic Dungeon", name: "史诗副本 · 高山", nameEn: "Epic Dungeon: High Mountain", minLevel: 260, note: "Lv.260+ · 每周 1 次", noteEn: "Lv. 260+ · Once weekly" },
  { id: "epic-angler", group: "weekly", category: "史诗副本", categoryEn: "Epic Dungeon", name: "史诗副本 · 钓鱼公司", nameEn: "Epic Dungeon: Angler Company", minLevel: 270, note: "Lv.270+ · 每周 1 次", noteEn: "Lv. 270+ · Once weekly" },
  { id: "epic-nightmare-paradise", group: "weekly", category: "史诗副本", categoryEn: "Epic Dungeon", name: "史诗副本 · 噩梦乐园", nameEn: "Epic Dungeon: Nightmare Paradise", minLevel: 280, note: "Lv.280+ · 每周 1 次", noteEn: "Lv. 280+ · Once weekly" },
  { id: "full-boss-clear", group: "weekly", category: "周常 BOSS", categoryEn: "Weekly Boss", name: "每周 BOSS 全清", nameEn: "Full Weekly Boss Clear", minLevel: 230, note: "按角色 Boss 表完成", noteEn: "Complete each character boss plan" },
  { id: "dojo", group: "weekly", category: "成长资源", categoryEn: "Growth Resource", name: "武陵道场", nameEn: "Mu Lung Dojo", minLevel: 105, note: "每周结算", noteEn: "Weekly settlement" },
  { id: "guild-flag", group: "weekly", category: "社区周常", categoryEn: "Community Weekly", name: "公会旗赛", nameEn: "Guild Flag Race", minLevel: 101, note: "每周参与", noteEn: "Weekly participation" },
  { id: "guild-culvert", group: "weekly", category: "社区周常", categoryEn: "Community Weekly", name: "公会水道", nameEn: "Guild Culvert", minLevel: 101, note: "Sharenian Culvert", noteEn: "Sharenian Culvert" },
];

const bossCatalog = [
  { id: "zakum", name: "扎昆", nameEn: "Zakum", tier: "入门", tierEn: "Entry", reward: 11 },
  { id: "pinkbean", name: "品克缤", nameEn: "Pink Bean", tier: "入门", tierEn: "Entry", reward: 12 },
  { id: "cygnus", name: "希纳斯", nameEn: "Cygnus", tier: "入门", tierEn: "Entry", reward: 14 },
  { id: "cra-vonbon", name: "班·雷昂", nameEn: "Von Bon", tier: "CRA", tierEn: "CRA", reward: 15 },
  { id: "cra-pierre", name: "皮埃尔", nameEn: "Pierre", tier: "CRA", tierEn: "CRA", reward: 15 },
  { id: "cra-queen", name: "女王", nameEn: "Queen", tier: "CRA", tierEn: "CRA", reward: 15 },
  { id: "cra-vellum", name: "贝伦", nameEn: "Vellum", tier: "CRA", tierEn: "CRA", reward: 18 },
  { id: "hmag", name: "困难麦格纳斯", nameEn: "Hard Magnus", tier: "进阶", tierEn: "Advanced", reward: 22 },
  { id: "akechi", name: "阿卡伊勒", nameEn: "Arkarium", tier: "进阶", tierEn: "Advanced", reward: 16 },
  { id: "cpap", name: "混沌品克缤", nameEn: "Chaos Pink Bean", tier: "进阶", tierEn: "Advanced", reward: 18 },
  { id: "pno", name: "露希德公主", nameEn: "Princess No", tier: "进阶", tierEn: "Advanced", reward: 18 },
  { id: "nlotus", name: "普通斯乌", nameEn: "Normal Lotus", tier: "Lomien", tierEn: "Lomien", reward: 28 },
  { id: "ndamien", name: "普通戴米安", nameEn: "Normal Damien", tier: "Lomien", tierEn: "Lomien", reward: 28 },
  { id: "nlucid", name: "普通路西德", nameEn: "Normal Lucid", tier: "260+", tierEn: "260+", reward: 42 },
  { id: "nwill", name: "普通威尔", nameEn: "Normal Will", tier: "260+", tierEn: "260+", reward: 45 },
  { id: "ngloom", name: "普通露希妲", nameEn: "Normal Gloom", tier: "260+", tierEn: "260+", reward: 45 },
  { id: "ndarknell", name: "普通戴斯克", nameEn: "Normal Darknell", tier: "260+", tierEn: "260+", reward: 48 },
  { id: "nverus-hilla", name: "普通希拉", nameEn: "Normal Verus Hilla", tier: "270+", tierEn: "270+", reward: 55 },
  { id: "nblackmage", name: "普通黑魔法师", nameEn: "Normal Black Mage", tier: "终局", tierEn: "Endgame", reward: 68 },
];

const dailyBossCatalog = [
  { id: "zakum", name: "扎昆", nameEn: "Zakum", icon: "assets/ui/daily-boss/zakum.png" },
  { id: "pink-bean", name: "品克缤", nameEn: "Pink Bean", icon: "assets/ui/daily-boss/pink-bean.png" },
  { id: "cygnus", name: "希纳斯", nameEn: "Cygnus", icon: "assets/ui/daily-boss/cygnus.png" },
  { id: "arkarium", name: "阿卡伊勒", nameEn: "Arkarium", icon: "assets/ui/daily-boss/arkarium.png" },
  { id: "magnus", name: "麦格纳斯", nameEn: "Magnus", icon: "assets/ui/daily-boss/magnus.png" },
  { id: "papulatus", name: "帕普拉图斯", nameEn: "Papulatus", icon: "assets/ui/daily-boss/papulatus.png" },
  { id: "gollux", name: "贝勒德", nameEn: "Gollux", icon: "assets/ui/gollux.png" },
  { id: "cra-vonbon", name: "班·雷昂", nameEn: "Von Bon", icon: "assets/ui/daily-boss/cra-vonbon.png" },
  { id: "cra-pierre", name: "皮埃尔", nameEn: "Pierre", icon: "assets/ui/daily-boss/cra-pierre.png" },
  { id: "cra-queen", name: "女王", nameEn: "Queen", icon: "assets/ui/daily-boss/cra-queen.png" },
  { id: "cra-vellum", name: "贝伦", nameEn: "Vellum", icon: "assets/ui/daily-boss/cra-vellum.png" },
];

const dailyBossPlans = {
  feliuca: ["zakum", "pink-bean", "cygnus", "arkarium", "magnus", "papulatus", "gollux"],
  Yat1ma: ["zakum", "pink-bean", "cygnus", "arkarium", "magnus", "papulatus", "gollux"],
};

const mulePlans = {
  feliuca: ["zakum", "pinkbean", "cygnus", "cra-vonbon", "cra-pierre", "cra-queen", "cra-vellum", "hmag", "akechi", "cpap", "pno", "nlotus", "ndamien", "nlucid", "nwill", "ngloom", "ndarknell", "nverus-hilla", "nblackmage"],
  Yat1ma: ["zakum", "pinkbean", "cygnus", "cra-vonbon", "cra-pierre", "cra-queen", "cra-vellum", "hmag", "akechi", "cpap", "pno", "nlotus", "ndamien", "nlucid", "nwill", "ngloom", "ndarknell"],
};

window.SEED_DATA = Object.freeze({
  characters,
  taskDefinitions,
  bossCatalog,
  dailyBossCatalog,
  dailyBossPlans,
  mulePlans,
});
