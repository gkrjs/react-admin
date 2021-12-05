export type Permission<T extends Record<string, any> = Record<string, any>> = {
    id: string;
    name: string;
} & T;
export type User<
    T extends Record<string, any> = Record<string, any>,
    P extends Record<string, any> = Record<string, any>,
> = {
    id: string;
    username: string;
    permissions?: Permission<P>[];
} & T;
