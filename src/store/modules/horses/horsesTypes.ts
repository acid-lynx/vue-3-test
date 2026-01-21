export interface Horse {
  id: number;
  name: string;
  color: string;
  condition: number;
}

export interface RaceHorse extends Horse {
  progress: number;
  finished?: boolean;
}

export interface HorsesState {
  horsesList: Horse[];
}
