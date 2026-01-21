// @ts-ignore
import type { Module, ActionContext } from 'vuex';
import type { Horse, HorsesState, RootState } from '@/store/types';
import {
  TOTAL_HORSES,
  generateColor,
  generateCondition,
  generateHorseName,
} from '@/utils/constants';
import { Mutations, Getters, Actions } from '../../types.ts';

type HorsesContext = ActionContext<HorsesState, RootState>;

const index: Module<HorsesState, RootState> = {
  namespaced: true,

  state: (): HorsesState => ({
    horsesList: [],
  }),

  getters: {
    [Getters.HORSES_LIST]: (state: HorsesState) => state.horsesList,
  },

  mutations: {
    [Mutations.SET_HORSES](state: HorsesState, horses: Horse[]) {
      state.horsesList = horses;
    },
  },

  actions: {
    [Actions.GENERATE_HORSES]({ commit }: HorsesContext) {
      const horses: Horse[] = Array.from(
        { length: TOTAL_HORSES },
        (_, index) => ({
          id: index,
          name: generateHorseName(),
          color: generateColor(),
          condition: generateCondition(),
        })
      );
      commit(Mutations.SET_HORSES, horses);
    },
  },
};

export default index;
