import { useCreation } from 'ahooks';
import produce from 'immer';
import { memo, useCallback } from 'react';
import create from 'zustand';

import createContext from 'zustand/context';

import type { RouteOption } from '../Router';

import type { RouterConfig, RouterState } from './types';
import { factoryRoutes } from './utils';

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
    useCallback(() => {
        const basename = config.basePath ?? '/';
        const { routes } = factoryRoutes(config.routes ?? [], {
            basePath: basename,
            render: config.render,
        });
        return create<RouterState>(() => ({
            ...config,
            basename,
            routes,
        }));
    }, []);
export const useRouterConfig = () => {
    const getter = useRouterGetter();
    const { basename, hash, window } = getter();
    return {
        basePath: useCreation(() => basename, [basename]),
        hash: useCreation(() => hash, [hash]),
        window: useCreation(() => window, [window]),
    };
};
export const useRoutes = () => {
    const { setState } = useRouterMutation();
    const setRoutes = useCallback(
        <M extends Record<string, any> | null = null>(routes: RouteOption<M>[]) => {
            const { basename, render } = useRouterState();
            setState(
                produce((draft) => {
                    draft.routes = factoryRoutes(routes, { basePath: basename, render });
                }),
            );
        },
        [],
    );
    // const setRoutes = useCallback((routes: RouteOption[]) => store,[]);
};
