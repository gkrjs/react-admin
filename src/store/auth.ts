import { createModel } from '@rematch/core';

import type { RootModel } from './models';

type Names = 'custom';
type ComplexCountState = {
    count: number;
    multiplierName: Names;
};
export const auth = createModel<RootModel>()({
    state: {
        count: 0,
        multiplierName: 'custom',
    } as ComplexCountState,
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
