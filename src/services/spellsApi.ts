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

export interface SpellDetail {
  index: string;
  name: string;
  desc: string[];
  higher_level: string[];
  range: string;
  components: string[];
  material: string;
  ritual: boolean;
  duration: string;
  concentration: boolean;
  casting_time: string;
  level: number;
  attack_type: string;
  area_of_effect: AreaOfEffect;
  dc: Dc;
  damage: Damage;
  school: School;
  classes: Class[];
  subclasses: Subclass[];
  url: string;
}

export interface AreaOfEffect {
  type: string;
  size: number;
}

export interface School {
  index: string;
  name: string;
  url: string;
}

export interface Damage {
  damage_type: DamageType;
  damage_at_character_level: DamageAtCharacterLevel;
}

export interface DamageType {
  index: string;
  name: string;
  url: string;
}

export interface DamageAtCharacterLevel {
  "1": string;
  "5": string;
  "11": string;
  "17": string;
}

export interface Dc {
  dc_type: DcType;
  dc_success: string;
}

export interface DcType {
  index: string;
  name: string;
  url: string;
}

export interface School {
  index: string;
  name: string;
  url: string;
}

export interface Class {
  index: string;
  name: string;
  url: string;
}

export interface Subclass {
  index: string;
  name: string;
  url: string;
}

export interface SpellTable {
  level: number;
  prof_bonus: number;
  spellcasting: Spellcasting;
}

export interface Spellcasting {
  cantrips_known: number;
  spells_known: number;
  spell_slots_level_1: number;
  spell_slots_level_2: number;
  spell_slots_level_3: number;
  spell_slots_level_4: number;
  spell_slots_level_5: number;
  spell_slots_level_6: number;
  spell_slots_level_7: number;
  spell_slots_level_8: number;
  spell_slots_level_9: number;
}
