// Lucky Equipment rules from MapleStory Wiki:
// https://maplestorywiki.net/w/Category:Lucky_Equipment
window.LUCKY_EQUIPMENT_RULES = Object.freeze({
  source: "https://maplestorywiki.net/w/Category:Lucky_Equipment",
  armorTypes: ["weapon", "hat", "top", "bottom", "overall", "cape", "gloves", "shoes", "shoulder"],
  isLuckyItem(item) {
    const name = String(item?.name || "");
    const type = item?.type;
    if (type === "weapon") {
      return (
        name.startsWith("Genesis ") ||
        name.startsWith("Destiny ") ||
        name.startsWith("Scarlet ") ||
        name.startsWith("Terminus ") ||
        name === "火焰环刃"
      );
    }
    if (type === "shoulder") {
      return name === "Crimsonheart Epaulette" || name === "Scarlet Shoulder";
    }
    if (type === "hat") {
      return [
        "Chaos Pierre Hat",
        "Chaos Queen's Tiara",
        "Chaos Vellum's Helm",
        "Chaos Von Bon Helmet",
      ].includes(name);
    }
    if (type === "gloves") {
      return ["Expert's Gloves", "Hero's Gloves", "Mu Gong's Gloves", "So Gong's Gloves"].includes(name);
    }
    return false;
  },
  affectsArmorSets(item) {
    return this.armorTypes.includes(item?.type) && this.isLuckyItem(item);
  },
});
