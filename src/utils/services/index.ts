import { MAX_CONDITION, BASE_DISTANCE } from '@/utils/constants';
import type { RaceHorse, RaceResult } from '@/store/types';

export const calculateDistanceFactor = (distance: number): number => {
  return BASE_DISTANCE / distance;
};

export const calculateSpeed = (
  condition: number,
  distanceFactor: number
): number => {
  const baseSpeed = condition / MAX_CONDITION + Math.random() * 2;
  return baseSpeed * distanceFactor;
};

interface RaceTickResult {
  updatedHorses: RaceHorse[];
  updatedResults: RaceResult[];
  isRaceFinished: boolean;
}

export const simulateRaceTick = (
  horses: RaceHorse[],
  results: RaceResult[],
  distanceFactor: number
): RaceTickResult => {
  const updatedResults = [...results];
  let finishPosition = horses.filter((h) => h.finished).length;

  const updatedHorses = horses.map((horse) => {
    if (horse.finished) {
      return horse;
    }

    const speed = calculateSpeed(horse.condition, distanceFactor);
    const nextProgress = Math.min(horse.progress + speed, 100);

    if (nextProgress >= 100) {
      updatedResults[finishPosition] = { horseName: horse.name };
      finishPosition++;
      return { ...horse, progress: 100, finished: true };
    }

    return { ...horse, progress: nextProgress };
  });

  const isRaceFinished = updatedHorses.every((h) => h.finished);

  return {
    updatedHorses,
    updatedResults,
    isRaceFinished,
  };
};
