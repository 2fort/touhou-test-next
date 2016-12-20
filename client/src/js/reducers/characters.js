import * as types from '../constants/ActionTypes';

const initialState = {
    mode: 'grid',
};

export default function characters(state = initialState, action) {
    switch (action.type) {
        case types.CHANGE_MODE: {
            return {
                ...state,
                mode: action.mode,
            };
        }

        default: {
            return state;
        }
    }
}
