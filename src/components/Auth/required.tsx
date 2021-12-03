import type { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import type { AntdRouteOption, RouteOption } from '../Router';

import { useAuth } from './hooks';

export const RequirdAuth: FC<{
    route: RouteOption | AntdRouteOption;
    path?: string;
    element: ReactElement;
}> = ({ route: { auth }, element, path = '/auth/login' }) => {
    const location = useLocation();
    const { token } = useAuth();
    if (auth) {
        return token ? element : <Navigate to={path} state={{ from: location }} />;
    }
    return element;
};
