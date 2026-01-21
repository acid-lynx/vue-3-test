export interface HorsesTypes {
  id: number;
  name: string;
  color: string;
  condition: number;
}

export interface RaceHorse extends HorsesTypes {
  progress: number;
  finished?: boolean;
}
