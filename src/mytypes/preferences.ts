export type Preferences = {
  theme: string;
  uniqueSets: {
    showCompleted: boolean;
    showFirstAvailable: boolean;
  };
  ladder: {
    Rank: boolean;
    Account: boolean;
    Discord: boolean;
    Character: boolean;
    Team: boolean;
    Ascendancy: boolean;
    Level: boolean;
    Delve: boolean;
    DPS: boolean;
    EHP: boolean;
    Armour: boolean;
    Evasion: boolean;
    ES: false;
    "Ele max hit": boolean;
    "Phys max hit": boolean;
    HP: boolean;
    Mana: boolean;
    "Movement Speed": boolean;
    Pantheon: boolean;
    "Uber Lab": boolean;
    Atlas: boolean;
    "P.O.": boolean;
  };
  teamSheet: {
    Discord: boolean;
    Character: boolean;
    Realm: boolean;
    LFG: boolean;
    Role: boolean;
    Specialization: boolean;
    "2nd Role": boolean;
    "2nd Specialization": boolean;
    Altars: boolean;
    Ascendancy: boolean;
    "Main Skill": boolean;
    "Extra Notes": boolean;
    "Uniques Needed": boolean;
    "Transfigured Gems": boolean;
    PoB: boolean;
    Guide: boolean;
  };
  limitTeams: number;
  // Per-category toggles for the per-option colors on the team sheet's
  // pickers. Charts always keep their colors regardless of these.
  colorfulRoles: boolean;
  colorfulSpecializations: boolean;
  colorfulAscendancy: boolean;
  colorfulRealms: boolean;
  colorfulAltars: boolean;
  colorfulMainSkill: boolean;
  version?: number;
};
export const defaultPreferences: Preferences = {
  theme: "system",
  uniqueSets: {
    showCompleted: true,
    showFirstAvailable: true,
  },
  ladder: {
    Rank: true,
    Account: false,
    Discord: false,
    Character: true,
    Team: true,
    Ascendancy: true,
    Level: true,
    Delve: false,
    DPS: true,
    EHP: true,
    Armour: false,
    Evasion: false,
    ES: false,
    HP: false,
    Mana: false,
    "Ele max hit": false,
    "Phys max hit": false,
    "Movement Speed": false,
    Pantheon: false,
    "Uber Lab": false,
    Atlas: false,
    "P.O.": false,
  },
  teamSheet: {
    Discord: false,
    Character: true,
    Realm: true,
    LFG: true,
    Role: true,
    Specialization: true,
    "2nd Role": false,
    "2nd Specialization": false,
    Altars: false,
    Ascendancy: true,
    "Main Skill": true,
    "Extra Notes": false,
    "Uniques Needed": false,
    "Transfigured Gems": false,
    PoB: false,
    Guide: false,
  },
  limitTeams: 0,
  colorfulRoles: false,
  colorfulSpecializations: false,
  colorfulAscendancy: false,
  colorfulRealms: false,
  colorfulAltars: false,
  colorfulMainSkill: false,
  version: 0,
};

export function initPreferences(): Preferences {
  const playerPreferences = localStorage.getItem("preferences");
  if (!playerPreferences) {
    return defaultPreferences;
  }
  const parsedPreferences = JSON.parse(playerPreferences);
  if (parsedPreferences.version === undefined) {
    parsedPreferences.ladder = defaultPreferences.ladder;
  }
  return {
    ...defaultPreferences,
    ...parsedPreferences,
  };
}
