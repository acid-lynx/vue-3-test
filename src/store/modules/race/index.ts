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
import { Mutations, Getters, Actions } from '../../types.ts';

type RaceContext = ActionContext<RaceState, RootState>;

const index: Module<RaceState, RootState> = {
  namespaced: true,

  state: (): RaceState => ({
    rounds: [],
    currentRoundIndex: 0,
    isRacing: false,
  }),

  getters: {
    [Getters.IS_START_DISABLED]: (state: RaceState): boolean =>
      state.isRacing ||
      (state.currentRoundIndex === state.rounds.length - 1 &&
        state.rounds[state.currentRoundIndex]?.horsesPerRound?.every(
          (h: RaceHorse) => h.finished
        )),
    [Getters.GET_CURRENT_ROUND]: (state: RaceState): Round | undefined =>
      state.rounds[state.currentRoundIndex],
  },

  mutations: {
    [Mutations.SET_ROUNDS](state: RaceState, rounds: Round[]) {
      state.rounds = rounds;
    },
    [Mutations.SET_CURRENT_ROUND](state: RaceState, roundIndex: number) {
      state.currentRoundIndex = roundIndex;
    },
    [Mutations.SET_ROUND_RESULT](
      state: RaceState,
      { roundIndex, result }: { roundIndex: number; result: RaceResult[] }
    ) {
      state.rounds[roundIndex].results = result;
    },
    [Mutations.SET_ROUND_PROGRESS](
      state: RaceState,
      {
        roundIndex,
        updatedHorses,
      }: { roundIndex: number; updatedHorses: RaceHorse[] }
    ) {
      state.rounds[roundIndex].horsesPerRound = updatedHorses;
    },
    [Mutations.SET_IS_RACING](state: RaceState, isRacing: boolean) {
      state.isRacing = isRacing;
    },
  },

  actions: {
    [Actions.GENERATE_PROGRAM]({ dispatch, commit }: RaceContext) {
      dispatch(`horses/${Actions.GENERATE_HORSES}`, null, { root: true });
      dispatch(Actions.GENERATE_ROUNDS);
      commit(Mutations.SET_CURRENT_ROUND, 0);
      commit(Mutations.SET_IS_RACING, false);
    },

    [Actions.GENERATE_ROUNDS]({ commit, rootState }: RaceContext) {
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

      commit(Mutations.SET_ROUNDS, rounds);
    },

    [Actions.START_RACE]({ commit, state }: RaceContext, roundIndex: number) {
      if (!state.rounds[roundIndex] || state.isRacing) return;

      commit(Mutations.SET_IS_RACING, true);

      const round = state.rounds[roundIndex];
      const distanceFactor = calculateDistanceFactor(round.distance);

      const timer = setInterval(() => {
        const { updatedHorses, updatedResults, isRaceFinished } =
          simulateRaceTick(round.horsesPerRound, round.results, distanceFactor);

        commit(Mutations.SET_ROUND_PROGRESS, { roundIndex, updatedHorses });
        commit(Mutations.SET_ROUND_RESULT, { roundIndex, result: updatedResults });

        if (isRaceFinished) {
          if (roundIndex + 1 < state.rounds.length) {
            commit(Mutations.SET_CURRENT_ROUND, roundIndex + 1);
          }
          commit(Mutations.SET_IS_RACING, false);
          clearInterval(timer);
        }
      }, 100);
    },
  },
};

export default index;
