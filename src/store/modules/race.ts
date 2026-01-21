// @ts-ignore
import type { Module, ActionContext } from 'vuex';
import type {
  RaceHorse,
  RaceResult,
  RaceState,
  Round,
  RootState,
} from '@/utils/types';
import { HORSES_PER_ROUND, RACE_DISTANCES } from '@/utils/constants';
import {
  calculateDistanceFactor,
  simulateRaceTick,
} from '@/utils/services';

type RaceContext = ActionContext<RaceState, RootState>;

const race: Module<RaceState, RootState> = {
  namespaced: true,

  state: (): RaceState => ({
    rounds: [],
    currentRoundIndex: 0,
    isRacing: false,
  }),

  getters: {
    isStartDisabled: (state: RaceState): boolean =>
      state.isRacing ||
      (state.currentRoundIndex === state.rounds.length - 1 &&
        state.rounds[state.currentRoundIndex]?.horsesPerRound?.every(
          (h: RaceHorse) => h.finished
        )),
    getCurrentRound: (state: RaceState): Round | undefined =>
      state.rounds[state.currentRoundIndex],
  },

  mutations: {
    SET_ROUNDS(state: RaceState, rounds: Round[]) {
      state.rounds = rounds;
    },
    SET_CURRENT_ROUND(state: RaceState, roundIndex: number) {
      state.currentRoundIndex = roundIndex;
    },
    SET_ROUND_RESULT(
      state: RaceState,
      { roundIndex, result }: { roundIndex: number; result: RaceResult[] }
    ) {
      state.rounds[roundIndex].results = result;
    },
    SET_ROUND_PROGRESS(
      state: RaceState,
      {
        roundIndex,
        updatedHorses,
      }: { roundIndex: number; updatedHorses: RaceHorse[] }
    ) {
      state.rounds[roundIndex].horsesPerRound = updatedHorses;
    },
    SET_IS_RACING(state: RaceState, isRacing: boolean) {
      state.isRacing = isRacing;
    },
  },

  actions: {
    generateProgram({ dispatch, commit }: RaceContext) {
      dispatch('horses/generateHorses', null, { root: true });
      dispatch('generateRounds');
      commit('SET_CURRENT_ROUND', 0);
      commit('SET_IS_RACING', false);
    },

    generateRounds({ commit, rootState }: RaceContext) {
      const rounds: Round[] = RACE_DISTANCES.map((distance, index) => {
        const selectedHorses: RaceHorse[] = [...rootState.horses.horsesList]
          .sort(() => 0.5 - Math.random())
          .slice(0, HORSES_PER_ROUND)
          .map((horse) => ({
            ...horse,
            progress: 0,
          }));

        return {
          lap: index + 1,
          distance,
          horsesPerRound: selectedHorses,
          isFinished: false,
          results: Array.from({ length: selectedHorses.length }, () => ({
            horseName: '',
          })),
        };
      });

      commit('SET_ROUNDS', rounds);
    },

    startRace({ commit, state }: RaceContext, roundIndex: number) {
      if (!state.rounds[roundIndex] || state.isRacing) return;

      commit('SET_IS_RACING', true);

      const round = state.rounds[roundIndex];
      const distanceFactor = calculateDistanceFactor(round.distance);

      const timer = setInterval(() => {
        const { updatedHorses, updatedResults, isRaceFinished } =
          simulateRaceTick(round.horsesPerRound, round.results, distanceFactor);

        commit('SET_ROUND_PROGRESS', { roundIndex, updatedHorses });
        commit('SET_ROUND_RESULT', { roundIndex, result: updatedResults });

        if (isRaceFinished) {
          if (roundIndex + 1 < state.rounds.length) {
            commit('SET_CURRENT_ROUND', roundIndex + 1);
          }
          commit('SET_IS_RACING', false);
          clearInterval(timer);
        }
      }, 100);
    },
  },
};

export default race;
