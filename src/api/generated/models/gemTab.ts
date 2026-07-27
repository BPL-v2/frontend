import type { GemPage } from "./gemPage.ts";

export interface GemTab {
  name?: string;
  pages: GemPage[];
}
