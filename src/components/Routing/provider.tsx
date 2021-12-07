/* eslint-disable no-unused-vars */
/* eslint-disable autofix/no-unused-vars */
import { useDeepCompareEffect } from 'ahooks';
import { FC, useEffect } from 'react';
import { BrowserRouter, HashRouter, useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { useUserInit } from '../Auth';

import { useRouter, useRouterListner } from './hooks';

// export const RoutesList: FC<{ routes: RouteObject[] }> = ({ routes }) => useRoutes(routes);
// export const AppRouter: FC = () => {
//     const {
//         config: { hash, window, basePath: basename },
//         routes,
//     } = useRouter();

//     // const { routes } = useAppRouter();
//     return hash ? (
//         <HashRouter {...{ window, basename }}>
//             <RoutesList routes={routes} />
//         </HashRouter>
//     ) : (
//         <BrowserRouter {...{ window, basename }}>
//             <RoutesList routes={routes} />
//         </BrowserRouter>
//     );
// };
export const DDD: FC = ({ children }) => {
    useRouterListner();
    const { routes } = useRouter();
    useDeepCompareEffect(() => {
        console.log(routes);
    }, [routes]);
    return <div>{children}</div>;
};
