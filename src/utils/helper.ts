import produce from 'immer';
import type { Draft } from 'immer';
import type { State, GetState, SetState, StateCreator, StoreApi } from 'zustand';

export function isPromise(promise: any) {
    return !!promise && typeof promise === 'function' && typeof promise().then === 'function';
}
export const zimmer =
    <
        T extends State,
        CustomSetState extends SetState<T>,
        CustomGetState extends GetState<T>,
        CustomStoreApi extends StoreApi<T>,
    >(
        config: StateCreator<
            T,
            (partial: ((draft: Draft<T>) => void) | T, replace?: boolean) => void,
            CustomGetState,
            CustomStoreApi
        >,
    ): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>
    (set, get, api) =>
        config(
            (partial, replace) => {
                const nextState =
                    typeof partial === 'function'
                        ? produce(partial as (state: Draft<T>) => T)
                        : (partial as T);
                return set(nextState, replace);
            },
            get,
            api,
        );
