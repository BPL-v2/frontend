// Roles a player can pick for the team sheet, and the specializations
// available once a role is picked. Each role has its own Tailwind hue;
// specializations cycle through shades of that hue (lightest first for
// "No Preference"), so they visually read as belonging to their role.

export const ROLES = [
  "Anything",
  "Janitor",
  "Crafter",
  "Mapper",
  "Delver",
  "Lab",
  "Heister",
  "Bosser",
  "Sanctum",
  "Support",
  "Side Content",
];

export const SPECIALIZATIONS: Record<string, string[]> = {
  Anything: ["No Preference"],
  Janitor: ["No Preference", "I will do the thing", "Trade Bot", "Card Opener"],
  Crafter: ["No Preference", "Advanced Crafter", "Basic Crafter"],
  Mapper: [
    "No Preference",
    "Abyss",
    "Bestiary",
    "Legion",
    "MF/Div Card",
    "Breach",
    "Incursion",
    "Harvest",
    "Atlas",
    "Blight",
    "Syndicate",
    "Expedition",
    "Delirium",
    "Ritual",
    "Ultimatum",
    "League Mechanic",
  ],
  Delver: ["No Preference", "Sideways", "Deep Delve", "Bossing", "Delve Race"],
  Lab: ["No Preference", "Carry", "Chests", "Gifts"],
  Heister: ["No Preference", "Contracts", "Blueprints"],
  Bosser: ["No Preference", "Invitations", "End-Game", "Voidstone Carry"],
  Sanctum: [
    "No Preference",
    "Floor 1-2 Runner",
    "No Hit Runner",
    "3-4 Floor Runner",
  ],
  Support: ["No Preference", "Aura", "Curse", "Taunt", "Link", "Mana", "Other"],
  "Side Content": ["No Preference", "Simulacrum", "Atziri Jail"],
};

export const ROLE_COLORS: Record<string, string> = {
  Anything: "text-gray-500",
  Janitor: "text-amber-500",
  Crafter: "text-purple-500",
  Mapper: "text-pink-500",
  Delver: "text-yellow-500",
  Lab: "text-red-500",
  Heister: "text-indigo-500",
  Bosser: "text-rose-500",
  Sanctum: "text-amber-700",
  Support: "text-green-500",
  "Side Content": "text-cyan-500",
};

export const SPECIALIZATION_COLORS: Record<string, Record<string, string>> = {
  Anything: {
    "No Preference": "text-gray-300",
  },
  Janitor: {
    "No Preference": "text-amber-300",
    "I will do the thing": "text-amber-400",
    "Trade Bot": "text-amber-500",
    "Card Opener": "text-amber-600",
  },
  Crafter: {
    "No Preference": "text-purple-300",
    "Advanced Crafter": "text-purple-600",
    "Basic Crafter": "text-purple-400",
  },
  // Each Mapper specialization is a real Atlas league mechanic, so these are
  // hand-picked to loosely match how each one is branded in-game, rather
  // than cycling shades of one hue like the other roles.
  Mapper: {
    "No Preference": "text-gray-300",
    Abyss: "text-green-500",
    Bestiary: "text-red-500",
    Legion: "text-purple-500",
    "MF/Div Card": "text-blue-500",
    Breach: "text-purple-300",
    Incursion: "text-orange-500",
    Harvest: "text-teal-500",
    Atlas: "text-slate-400",
    Blight: "text-yellow-500",
    Syndicate: "text-stone-500",
    Expedition: "text-gray-500",
    Delirium: "text-white",
    Ritual: "text-red-300",
    Ultimatum: "text-orange-700",
    // The current temporary league's own mechanic - deliberately loud and
    // unlike anything else in this list, since it's a fresh guest each
    // league rather than a permanent Atlas mechanic.
    "League Mechanic": "text-fuchsia-500",
  },
  Delver: {
    "No Preference": "text-yellow-300",
    Sideways: "text-yellow-400",
    "Deep Delve": "text-yellow-500",
    Bossing: "text-yellow-600",
    "Delve Race": "text-yellow-700",
  },
  Lab: {
    "No Preference": "text-red-300",
    Carry: "text-red-400",
    Chests: "text-red-500",
    Gifts: "text-red-600",
  },
  Heister: {
    "No Preference": "text-indigo-300",
    Contracts: "text-indigo-400",
    Blueprints: "text-indigo-500",
  },
  Bosser: {
    "No Preference": "text-rose-300",
    Invitations: "text-rose-400",
    "End-Game": "text-rose-500",
    "Voidstone Carry": "text-rose-600",
  },
  Sanctum: {
    "No Preference": "text-amber-300",
    "Floor 1-2 Runner": "text-amber-400",
    "No Hit Runner": "text-amber-500",
    "3-4 Floor Runner": "text-amber-600",
  },
  Support: {
    "No Preference": "text-green-300",
    Aura: "text-green-400",
    Curse: "text-green-500",
    Taunt: "text-green-600",
    Link: "text-green-700",
    Mana: "text-green-300",
    Other: "text-green-400",
  },
  "Side Content": {
    "No Preference": "text-cyan-300",
    Simulacrum: "text-cyan-500",
    "Atziri Jail": "text-cyan-700",
  },
};
