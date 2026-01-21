// @ts-ignore
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import type { InjectionKey } from 'vue';

// store modules
import horses from './modules/horses';
import race from './modules/race';

// types
import type { HorsesState } from './modules/horses/horsesTypes';
import type { RaceState } from './modules/race/raceTypes';

export interface RootState {
  horses: HorsesState;
  race: RaceState;
}

export const key: InjectionKey<Store<RootState>> = Symbol();

export function useStore(): Store<RootState> {
  return baseUseStore(key);
}

export default createStore<RootState>({
  modules: {
    horses,
    race,
  },
});
