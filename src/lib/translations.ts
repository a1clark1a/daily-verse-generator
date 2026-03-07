export const VALID_TRANSLATIONS = [
  "kjv", "web", "asv", "bbe", "darby", "ylt", "oeb-us",
] as const;

export type Translation = (typeof VALID_TRANSLATIONS)[number];
