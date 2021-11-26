import { routes } from './routes';

export const router = {
    basename: import.meta.env.BASE_URL,
    window: undefined,
    hash: false,
    routes,
};
