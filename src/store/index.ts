// @ts-ignore
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import type { InjectionKey } from 'vue';
export const key: InjectionKey<Store<RootState>> = Symbol();

// store modules
import insex from './modules/horses/insex.ts';

import index from './modules/race';
// types

import { HorsesTypes, Round } from "@/utils/types";

export interface RootState {
  horses: HorsesTypes[];
  race: {
    rounds: Round[];
    currentRoundIndex: number;
    isRacing: boolean;
  }
}

export function useStore(): Store<RootState> {
  return baseUseStore(key);
}

export default createStore<RootState>({
  modules: {
    horses: insex,
    race: index,
  },
});
