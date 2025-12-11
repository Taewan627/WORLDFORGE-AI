export interface Location {
  id: string;
  name: string;
  name_ko: string;
  role: string;
  role_ko: string;
  mood: string;
  mood_ko: string;
  story_hint: string;
  story_hint_ko: string;
  image_prompt_short: string;
  image_prompt_long: string;
  generatedImage?: string; // Base64 data URI
  isGeneratingImage?: boolean;
}

export interface Pillar {
  en: string;
  ko: string;
}

export interface World {
  title: string;
  title_ko: string;
  tagline: string;
  tagline_ko: string;
  pillars: Pillar[];
  locations: Location[];
}

export interface WorldGenerationResponse {
  world: World;
}