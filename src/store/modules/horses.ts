// @ts-ignore
import type { Module, ActionContext } from 'vuex';
import type { Horse, HorsesState, RootState } from '@/utils/types';
import {
  TOTAL_HORSES,
  generateColor,
  generateCondition,
  generateHorseName,
} from '@/utils/constants';

type HorsesContext = ActionContext<HorsesState, RootState>;

const horses: Module<HorsesState, RootState> = {
  namespaced: true,

  state: (): HorsesState => ({
    horsesList: [],
  }),

  getters: {
    horsesList: (state: HorsesState) => state.horsesList,
  },

  mutations: {
    SET_HORSES(state: HorsesState, horses: Horse[]) {
      state.horsesList = horses;
    },
  },

  actions: {
    generateHorses({ commit }: HorsesContext) {
      const horses: Horse[] = Array.from(
        { length: TOTAL_HORSES },
        (_, index) => ({
          id: index,
          name: generateHorseName(),
          color: generateColor(),
          condition: generateCondition(),
        })
      );
      commit('SET_HORSES', horses);
    },
  },
};

export default horses;
