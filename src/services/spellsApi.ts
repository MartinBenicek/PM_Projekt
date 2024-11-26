export interface Spell {
  index: string;
  name: string;
  level: number;
  url: string;
}

export interface SpellsResponse {
  count: number;
  results: Spell[];
}
