import { useCreation } from 'ahooks';
import merge from 'deepmerge';
import { useMemo } from 'react';

import shallow from 'zustand/shallow';

import { createImmer } from '@/utils/store';

import { useStorageInit } from '../Storage';

import { defaultConfig } from './_default.config';
import type { Config, ConfigState } from './types';

type ConfigStore = { config: ConfigState; inited: boolean };
const useStore = createImmer<ConfigStore>(() => ({ config: defaultConfig, inited: false }));
export const useConfigInit = (config?: Config) => {
    const inited = useStore((state) => state.inited);
    const storageInited = useStorageInit();
    if (config && storageInited && !inited) {
        useStore.setState((draft) => {
            draft.config = merge(draft.config, config, {
                arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])),
            }) as ConfigState;
            draft.inited = true;
        });
    }
    return useMemo(() => inited, [inited]);
};

export const useConfigure = () => useStore;
export const useConfig = () => {
    const config = useStore((s) => s.config, shallow);
    return useCreation(() => config, [config]);
};
