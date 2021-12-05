import { useCreation } from 'ahooks';
import merge from 'deepmerge';
import create from 'zustand';

import shallow from 'zustand/shallow';

import { zimmer } from '@/utils/helper';

import { defaultConfig } from './_default.config';
import type { Config, ConfigState } from './types';

const useStore = create<ConfigState>(zimmer(() => defaultConfig));
export const useInitConfig = (config: Config) =>
    useStore.setState((s) => merge(s, config) as ConfigState, true);
export const useConfigure = () => useStore;
export const useConfig = () => {
    const state = useStore((s) => s, shallow);
    return useCreation(() => state, [state]);
};
