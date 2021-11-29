import { createModel } from '@rematch/core';

import type { RootModel } from './models';

type AuthState = {
    token: stirng | null;
};
export const auth = createModel<RootModel>()({
    state: { token: null },
    reducers: {
        increment(state, payload: number) {
            return {
                count: state.count + payload,
                multiplierName: 'custom',
            };
        },
    },
    effects: (dispatch) => ({
        incrementEffect(payload: number, rootState) {
            dispatch.count.increment(payload);
        },
    }),
});
