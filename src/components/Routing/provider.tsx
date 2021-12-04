import type { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { RouterContextProvider, useRouterCreator } from './hooks';

import type { RouterConfig } from './types';

export const RouterWrapper: FC<{
    config: Pick<RouterConfig, 'hash' | 'window' | 'basename'>;
    routes: RouteObject[];
}> = ({ config, routes }) => {
    const { hash, window, basename } = config;

    // const { routes } = useAppRouter();
    return hash ? (
        <HashRouter {...{ window, basename }}>
            <RoutesList routes={routes} />
        </HashRouter>
    ) : (
        <BrowserRouter {...{ window, basename }}>
            <RoutesList routes={routes} />
        </BrowserRouter>
    );
};

export const AppRouter: FC<{ config: RouterConfig }> = ({ config, children }) => {
    const createStore = useRouterCreator(config);
    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <RouterContextProvider createStore={createStore}>
            <RouterWrapper
                config={{ ...pick(config, ['window', 'hash']), basename: basePath }}
                routes={routes}
            />
        </RouterContextProvider>
    );
};
