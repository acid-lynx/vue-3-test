// @ts-ignore
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import type { InjectionKey } from 'vue';
import type { RootState } from '@/utils/types';

import horses from './modules/horses';
import race from './modules/race';

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
