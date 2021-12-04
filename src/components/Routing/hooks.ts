import { useCreation } from 'ahooks';
import { memo, useCallback } from 'react';
import create from 'zustand';

import createContext from 'zustand/context';

import type { RouterConfig, RouterState } from './types';

const { Provider, useStore, useStoreApi } = createContext<RouterState>();
export const RouterContextProvider = memo(Provider);
export const useRouterState = () => {
    const state = useStore();
    return useCreation(() => state, [state]);
};
export const useRouterGetter = () => {
    const { getState } = useStoreApi();
    return useCallback(getState, []);
};
export const useRouterMutation = () => {
    const { setState, subscribe, destroy } = useStoreApi();
    return {
        setState: useCallback(setState, []),
        subscribe: useCallback(subscribe, []),
        destroy: useCallback(destroy, []),
    };
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
export const useRouterAction = () => {
    const state = useRouterState();
    // const setRoutes = useCallback((routes: RouteOption[]) => store,[]);
};
