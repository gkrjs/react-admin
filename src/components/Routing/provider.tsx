import type { FC } from 'react';
import { BrowserRouter, HashRouter, useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { useRouter } from './hooks';

export const RoutesList: FC<{ routes: RouteObject[] }> = ({ routes }) => useRoutes(routes);
export const AppRouter: FC = () => {
    const {
        config: { hash, window, basePath: basename },
        routes,
    } = useRouter();

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
