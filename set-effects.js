// Equipment set definitions sourced from MapleStory Wiki and DigitalTQ.
// https://maplestorywiki.net/w/Eternal_Set
// https://maplestorywiki.net/w/Pitched_Boss_Set
// https://maplestorywiki.net/w/Brilliant_Boss_Set
// https://www.digitaltq.com/maplestory-set-effects
window.EQUIPMENT_SET_EFFECTS = Object.freeze([
  {
    id: "cra",
    nameZh: "CRA",
    nameEn: "CRA",
    max: 4,
    color: "#b04a48",
    armorSet: true,
    match: (entry, item) => String(entry?.setName || "").startsWith("Root Abyss Set"),
    tiers: {
      2: "Main/Secondary Stat +20, HP/MP +1,000",
      3: "HP/MP +10%, ATT/MATT +50",
      4: "Boss Damage +30%",
    },
  },
  {
    id: "dawn",
    nameZh: "Dawn",
    nameEn: "Dawn",
    max: 4,
    color: "#5db2b6",
    match: (entry, item) =>
      ["Daybreak Pendant", "Twilight Mark", "Estella Earrings", "Dawn Guardian Angel Ring"].includes(item?.name),
    tiers: {
      2: "All Stat +10, HP +250, ATT/MATT +10, Boss +10%",
      3: "All Stat +10, HP +250, ATT/MATT +10",
      4: "All Stat +10, HP +250, ATT/MATT +10, DEF +100, IED +10%",
    },
  },
  {
    id: "superior-gollux",
    nameZh: "Gollux Superior",
    nameEn: "Gollux Superior",
    max: 4,
    color: "#cf6f32",
    match: (entry, item) => {
      const name = String(item?.name || "");
      return name.startsWith("Superior Gollux") || name.startsWith("Superior Engraved Gollux");
    },
    tiers: {
      2: "All Stat +20, HP/MP +1,500",
      3: "HP/MP +13%, ATT/MATT +35",
      4: "IED +30%, Boss Damage +30%",
    },
  },
  {
    id: "reinforced-gollux",
    nameZh: "Gollux Reinforced",
    nameEn: "Gollux Reinforced",
    max: 4,
    color: "#b56c58",
    match: (entry, item) => {
      const name = String(item?.name || "");
      return name.startsWith("Reinforced Gollux") || name.startsWith("Reinforced Engraved Gollux");
    },
    tiers: {
      2: "All Stat +15, HP/MP +1,200",
      3: "HP/MP +10%, ATT/MATT +30",
      4: "IED +15%, Boss Damage +30%",
    },
  },
  {
    id: "solid-gollux",
    nameZh: "Gollux Solid",
    nameEn: "Gollux Solid",
    max: 4,
    color: "#9e7263",
    match: (entry, item) => {
      const name = String(item?.name || "");
      return name.startsWith("Solid Gollux") || name.startsWith("Solid Engraved Gollux");
    },
    tiers: {
      2: "All Stat +12, HP/MP +800",
      3: "HP/MP +8%, ATT/MATT +20",
      4: "IED +15%, 5% chance Lv.2 Freeze",
    },
  },
  {
    id: "cracked-gollux",
    nameZh: "Gollux Cracked",
    nameEn: "Gollux Cracked",
    max: 4,
    color: "#8d7568",
    match: (entry, item) => {
      const name = String(item?.name || "");
      return name.startsWith("Cracked Gollux") || name.startsWith("Cracked Engraved Gollux");
    },
    tiers: {
      2: "All Stat +10, HP/MP +500",
      3: "HP/MP +5%, ATT/MATT +12",
      4: "IED +15%, 5% chance Lv.2 Freeze",
    },
  },
  {
    id: "absolab",
    nameZh: "AbsoLab",
    nameEn: "AbsoLab",
    max: 7,
    color: "#d28a3d",
    armorSet: true,
    match: (entry, item) => String(entry?.setName || "").startsWith("AbsoLab Set"),
    tiers: {
      2: "HP/MP +1,500, ATT/MATT +20, Boss +10%",
      3: "All Stat +30, ATT/MATT +20, Boss +10%",
      4: "ATT/MATT +25, DEF +200, IED +10%",
      5: "ATT/MATT +30, Boss +10%",
      6: "HP/MP +20%, ATT/MATT +20",
      7: "ATT/MATT +20, IED +10%",
    },
  },
  {
    id: "arcane",
    nameZh: "Arcane",
    nameEn: "Arcane",
    max: 7,
    color: "#8d68dd",
    armorSet: true,
    match: (entry, item) => String(entry?.setName || "").startsWith("Arcane Umbra Set"),
    tiers: {
      2: "ATT/MATT +30, Boss +10%",
      3: "ATT/MATT +30, DEF +400, IED +10%",
      4: "All Stat +50, ATT/MATT +35, Boss +10%",
      5: "HP/MP +2,000, ATT/MATT +40, Boss +10%",
      6: "HP/MP +30%, ATT/MATT +30",
      7: "ATT/MATT +30, IED +10%",
    },
  },
  {
    id: "eternal",
    nameZh: "Eternal",
    nameEn: "Eternal",
    max: 8,
    color: "#4fa3d8",
    armorSet: true,
    match: (entry, item) => String(entry?.setName || "").startsWith("Eternal Set"),
    tiers: {
      2: "ATT/MATT +40, Boss +10%",
      3: "All Stat +50, ATT/MATT +40, Boss +10%",
      4: "ATT/MATT +40, Boss +10%",
      5: "ATT/MATT +40, IED +20%",
      6: "ATT/MATT +40, Boss +15%",
      7: "All Stat +50, ATT/MATT +40, Boss +15%",
      8: "ATT/MATT +40, Boss +15%",
    },
  },
  {
    id: "pitched",
    nameZh: "Pitched",
    nameEn: "Pitched",
    max: 10,
    color: "#d85b72",
    groupKey: (entry, item) =>
      ["Black Heart", "Total Control"].includes(item?.name) ? "android-heart" : item?.name,
    match: (entry, item) =>
      [
        "Endless Terror",
        "Berserked",
        "Magic Eyepatch",
        "Commanding Force Earring",
        "Source of Suffering",
        "Dreamy Belt",
        "Genesis Badge",
        "Black Heart",
        "Total Control",
        "Cursed Blue Spellbook",
        "Cursed Green Spellbook",
        "Cursed Red Spellbook",
        "Cursed Yellow Spellbook",
      ].includes(item?.name) || String(item?.name || "").includes("Mitra's Rage"),
    tiers: {
      2: "All Stat +10, HP +250, ATT/MATT +10, Boss +10%",
      3: "All Stat +10, HP +250, ATT/MATT +10, DEF +250, IED +10%",
      4: "All Stat +15, HP +375, ATT/MATT +15, Crit Dmg +5%",
      5: "All Stat +15, HP +375, ATT/MATT +15, Boss +10%",
      6: "All Stat +15, HP +375, ATT/MATT +15, IED +10%",
      7: "All Stat +15, HP +375, ATT/MATT +15, Crit Dmg +5%",
      8: "All Stat +15, HP +375, ATT/MATT +15, Boss +10%",
      9: "All Stat +15, HP +375, ATT/MATT +15, Crit Dmg +5%",
      10: "All Stat +20, HP +500, ATT/MATT +20, Boss +10%",
    },
  },
  {
    id: "brilliant",
    nameZh: "Brilliant",
    nameEn: "Brilliant",
    max: 5,
    color: "#e1a832",
    match: (entry, item) =>
      [
        "Original Sin of Pride",
        "Whisper of the Source",
        "Blissful Nightmare",
        "Oath of Death",
        "Immortal Legacy",
      ].includes(item?.name),
    tiers: {
      2: "All Stat +20, HP +500, ATT/MATT +20, Boss +15%",
      3: "All Stat +20, HP +500, ATT/MATT +20, IED +15%",
      4: "All Stat +20, HP +500, ATT/MATT +20, Crit Dmg +5%",
      5: "All Stat +20, HP +500, ATT/MATT +20, Boss +15%",
    },
  },
]);
