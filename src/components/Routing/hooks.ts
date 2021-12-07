import { useDeepCompareEffect } from 'ahooks';
import merge from 'deepmerge';

import { isArray, omit } from 'lodash-es';
import { useCallback, useEffect, useMemo } from 'react';
import type { RouteObject } from 'react-router-dom';
import shallow from 'zustand/shallow';

import { useDeepCompareMemo } from '@/hooks';
import { createImmer } from '@/utils/store';

import { useUser, useUserInit } from '../Auth';

import { useRequest } from '../Request';

import { getDefaultState } from './_defaultConfig';
import type { RouteOption, RouterConfig, RouterState } from './types';
import { factoryRoutes, filteAccessRoutes } from './utils';

const useInitStore = createImmer<{ config: boolean; routes: boolean }>(() => ({
    config: false,
    routes: false,
}));
const useRouterStore = createImmer<RouterState>(() => getDefaultState());
const useDataStore = createImmer<{ routes: RouteObject[]; names: Record<string, string> }>(() => ({
    routes: [],
    names: {},
}));

export const useRouter = (config?: RouterConfig) => {
    const { constants, dynamic } = useRouterStore((state) => state.routes, shallow);
    const { inited: userInited } = useUserInit();
    const state = useRouterStore.getState();
    const { user } = useUser();
    const configInited = useInitStore((s) => s.config);
    const routesInited = useInitStore((s) => s.routes);
    useEffect(() => {
        if (!configInited && config !== undefined) {
            useRouterStore.setState(
                (draft) =>
                    merge(config, draft, {
                        arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])),
                    }) as RouterState,
                true,
            );
            useInitStore.setState((s) => {
                s.config = true;
            });
        }
    }, [config]);
    useDeepCompareEffect(() => {
        const canUser = (state.auth.enabled && userInited) || !state.auth.enabled;
        if (canUser && !routesInited && configInited) {
            let accessRoutes = [...constants, ...dynamic];
            if (state.auth.enabled) {
                if (userInited) {
                    accessRoutes = filteAccessRoutes(accessRoutes, user, state.permission);
                }
            }
            const { routes: items, nameMaps } = factoryRoutes(accessRoutes, {
                basePath: state.basePath,
                render: state.render,
            });
            useDataStore.setState((s) => {
                s.routes = items;
            });
            useDataStore.setState((s) => {
                s.names = nameMaps;
            });
            useInitStore.setState((s) => ({ ...s, routes: true }));
        }
    }, [constants, dynamic, userInited, configInited]);
    const finalRoutes = useDataStore((s) => s.routes, shallow);
    const finalNames = useDataStore((s) => s.names, shallow);
    return {
        inited: useMemo(() => routesInited, [routesInited]),
        config: useDeepCompareMemo(() => state, [state]),
        routes: useDeepCompareMemo(() => finalRoutes, [finalRoutes]),
        names: useDeepCompareMemo(() => finalNames, [finalNames]),
        setInit: useCallback(
            (inited: boolean) => useInitStore.setState((s) => ({ ...s, routes: inited })),
            [],
        ),
    };
};

export const useRouterMutation = () => {
    const { inited, setInit } = useRouter();
    const add = useDynamicStore((state) => state.add);
    const addRoutes = useCallback((routes: RouteOption[]) => {
        if (inited) {
            setInit(false);
            add(routes);
        }
    }, []);
    return {
        configure: useCallback(useRouterStore.setState, []),
        addRoutes,
    };
};

const useRouterConfig = () => useRouterStore((state) => omit(state, ['routes']), shallow);
const useDynamicStore = createImmer<{
    routes: RouteOption[];
    add: (routes: RouteOption[]) => void;
    set: (routes: RouteOption[]) => void;
}>((set) => ({
    routes: [],
    add: (routes: RouteOption[]) =>
        set((draft) => {
            draft.routes = [...draft.routes, ...routes];
        }),
    set: (routes: RouteOption[]) =>
        set((draft) => {
            draft.routes = routes;
        }),
}));
export const useRouterListner = () => {
    const { configure } = useRouterMutation();
    const { getAuthRequest } = useRequest();
    const request = getAuthRequest();
    const { server } = useRouterConfig();
    const { inited } = useRouter();
    const dynamicRoutes = useDynamicStore((state) => state.routes, shallow);
    const setRoutes = useDynamicStore((state) => state.set);
    useDeepCompareEffect(() => {
        (async () => {
            if (!inited && request && server.enabled && server.api_url !== null) {
                try {
                    const { data } = await request.get<RouteOption[]>(server.api_url);
                    if (isArray(data)) setRoutes(data);
                } catch (error) {
                    console.log(error);
                }
            }
        })();
    }, [server]);
    useDeepCompareEffect(() => {
        if (!inited) {
            configure((draft) => {
                draft.routes.dynamic = dynamicRoutes;
            });
        }
    }, [dynamicRoutes]);
};
