import type { RaceHorse } from '../horses/horsesTypes.ts';

export interface RaceResult {
  horseName: string;
}

export interface Round {
  lap: number;
  distance: number;
  horsesPerRound: RaceHorse[];
  isFinished: boolean;
  results: RaceResult[];
}
