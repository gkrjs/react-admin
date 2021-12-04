import { memo, useCallback } from 'react';
import create from 'zustand';

import createContext from 'zustand/context';

import type { RouterConfig, RouterState } from './types';

const { Provider, useStore } = createContext();
export const RouterContextProvider = memo(Provider);
export const useRouterConfigState = () => {
    return useCallback(() => useStore, []);
};
export const useRouterCreator = (config: RouterConfig) =>
    useCallback(
        () =>
            create<RouterState>(() => ({
                ...config,
                basename: config.basePath ?? '/',
                routes: [],
            })),
        [],
    );
