// Legendary potential menus derived from MathBro's cubing calculator.
// https://brendonmay.github.io/cubingCalculator/
(() => {
  "use strict";

  const range = (start, end, suffix) =>
    Array.from({ length: (end - start) / 3 + 1 }, (_, index) => `${start + index * 3}% ${suffix}`);

  window.EQUIPMENT_POTENTIAL_MAIN_OPTIONS_LOW = Object.freeze(range(18, 36, "Main Stat"));
  window.EQUIPMENT_POTENTIAL_MAIN_OPTIONS_HIGH = Object.freeze(range(21, 39, "Main Stat"));
  window.EQUIPMENT_POTENTIAL_XENON_ALL_OPTIONS_LOW = Object.freeze(range(9, 27, "All Stat"));
  window.EQUIPMENT_POTENTIAL_XENON_ALL_OPTIONS_HIGH = Object.freeze(range(12, 30, "All Stat"));

  window.EQUIPMENT_POTENTIAL_ATT_OPTIONS_LOW = Object.freeze([18, 21, 24, 30, 33, 36].map((value) => `${value}% ATT`));
  window.EQUIPMENT_POTENTIAL_ATT_OPTIONS_HIGH = Object.freeze([20, 23, 26, 33, 36, 39].map((value) => `${value}% ATT`));
  window.EQUIPMENT_POTENTIAL_MATT_OPTIONS_LOW = Object.freeze([18, 21, 24, 30, 33, 36].map((value) => `${value}% MATT`));
  window.EQUIPMENT_POTENTIAL_MATT_OPTIONS_HIGH = Object.freeze([20, 23, 26, 33, 36, 39].map((value) => `${value}% MATT`));

  window.EQUIPMENT_POTENTIAL_NORMAL_HAT_LINES_LOW = Object.freeze([
    "6% All Stat",
    "9% All Stat",
    "9% Main Stat",
    "12% Main Stat",
  ]);
  window.EQUIPMENT_POTENTIAL_NORMAL_HAT_LINES_HIGH = Object.freeze([
    "7% All Stat",
    "10% All Stat",
    "10% Main Stat",
    "13% Main Stat",
  ]);
  window.EQUIPMENT_POTENTIAL_XENON_HAT_LINES_LOW = Object.freeze([
    "6% All Stat",
    "9% All Stat",
  ]);
  window.EQUIPMENT_POTENTIAL_XENON_HAT_LINES_HIGH = Object.freeze([
    "9% All Stat",
    "12% All Stat",
  ]);

  window.EQUIPMENT_POTENTIAL_HAT_CD_OPTIONS = Object.freeze([
    "-2sec+ CD Reduction",
    "-3sec+ CD Reduction",
    "-4sec+ CD Reduction",
    "-5sec+ CD Reduction",
    "-6sec+ CD Reduction",
  ]);

  window.buildPotentialCdOneLineOptions = (lineOptions) =>
    ["-2sec+", "-3sec+", "-4sec+"].flatMap((cooldown) =>
      lineOptions.map((line) => `${cooldown} CD Reduction and ${line}`),
    );

  window.buildPotentialCdTwoLineOptions = (lineOptions) => {
    const combinations = [];
    for (let firstIndex = 0; firstIndex < lineOptions.length; firstIndex += 1) {
      for (let secondIndex = firstIndex; secondIndex < lineOptions.length; secondIndex += 1) {
        const firstValue = Number(lineOptions[firstIndex].match(/(\d+)/)?.[1] || 0);
        const secondValue = Number(lineOptions[secondIndex].match(/(\d+)/)?.[1] || 0);
        combinations.push({
          total: firstValue + secondValue,
          label: `${lineOptions[firstIndex]} + ${lineOptions[secondIndex]}`,
        });
      }
    }
    combinations.sort((left, right) => left.total - right.total || left.label.localeCompare(right.label));
    return combinations.map(({ label }) => `-2sec+ CD Reduction and ${label}`);
  };

  window.buildPotentialCritDamageOptions = (statLabel) => [
    "1 Line Crit Dmg%",
    "2 Lines Crit Dmg%",
    "3 Lines Crit Dmg%",
    `1 Line Crit Dmg% + 1 Line ${statLabel}`,
    `1 Line Crit Dmg% + 2 Lines ${statLabel}`,
    `2 Lines Crit Dmg% + 1 Line ${statLabel}`,
  ];

  window.POTENTIAL_CATALOG = Object.freeze({
    source: "https://brendonmay.github.io/cubingCalculator/",
    tier: "legendary",
    generatedAt: "2026-08-16",
  });
})();
