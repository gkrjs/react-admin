import type { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import type { AntdRouteOption, RouteOption } from '../Router';

export const RequirdAuth: FC<{
    route: RouteOption | AntdRouteOption;
    path?: string;
    element: ReactElement;
}> = ({ route: { auth }, element, path = '/auth/login' }) => {
    const location = useLocation();
    const isAuth = false;
    if (auth) {
        return isAuth ? element : <Navigate to={path} state={{ from: location }} />;
    }
    return element;
};
