export const Mutations = {
  SET_HORSES: 'SET_HORSES',
  SET_ROUNDS: 'SET_ROUNDS',
  SET_CURRENT_ROUND: 'SET_CURRENT_ROUND',
  SET_ROUND_RESULT: 'SET_ROUND_RESULT',
  SET_ROUND_PROGRESS: 'SET_ROUND_PROGRESS',
  SET_IS_RACING: 'SET_IS_RACING',
} as const;

export const Getters = {
  HORSES_LIST: 'horsesList',
  IS_START_DISABLED: 'isStartDisabled',
  GET_CURRENT_ROUND: 'getCurrentRound',
} as const;

export const Actions = {
  GENERATE_HORSES: 'generateHorses',
  GENERATE_PROGRAM: 'generateProgram',
  GENERATE_ROUNDS: 'generateRounds',
  START_RACE: 'startRace',
} as const;

export * from './modules/horses/horsesTypes.ts';
export * from './modules/race/raceTypes.ts';