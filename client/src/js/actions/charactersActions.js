import * as types from '../constants/ActionTypes';

export function changeMode(mode) {
    return {
        type: types.CHANGE_MODE,
        mode,
    };
}
