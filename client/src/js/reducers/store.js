import Immutable from 'seamless-immutable';
import * as types from '../constants/ActionTypes';

const initialState = Immutable({
  fetchInProgress: false,
  games: {},
  characters: {},
  error: '',
});

export default function store(state = initialState, action) {
  switch (action.type) {
    case types.PURGE_CACHE:
      return Immutable.merge(state, { games: {}, characters: {} });

    case types.FETCH_GAMES_BEGIN:
    case types.FETCH_CHARACTERS_BEGIN:
    case types.FETCH_CHARACTER_BEGIN:
    case types.FETCH_TEST_INFO_BEGIN:
      return Immutable.merge(state, { fetchInProgress: true });

    case types.FETCH_GAMES_SUCCESS:
    case types.FETCH_CHARACTERS_SUCCESS:
    case types.FETCH_CHARACTER_SUCCESS:
    case types.FETCH_TEST_INFO_SUCCESS:
      return Immutable.merge(state, [{ fetchInProgress: false }, action.response]);

    case types.FETCH_GAMES_FAIL:
    case types.FETCH_CHARACTERS_FAIL:
    case types.FETCH_CHARACTER_FAIL:
    case types.FETCH_TEST_INFO_FAIL:
      return Immutable.merge(state, { error: action.error, fetchInProgress: false });

    default: {
      return state;
    }
  }
}
