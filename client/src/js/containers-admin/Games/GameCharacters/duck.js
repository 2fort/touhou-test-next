import Immutable from 'seamless-immutable';
import { stringify } from 'qs';

import { charactersEntity } from '../../../schemas/adminSchemas';
import { generateComponent } from '../../../ducks/domain';
import { getData, submitData } from '../../../actions/fetchAndSave';

const componentName = 'GameCharactersTable';
const ADD_GAME_INFO = `${componentName}/ADD_GAME_INFO`;
const SET_GAME_ID = `${componentName}/SET_GAME_ID`;

const component = generateComponent(componentName);

const route = '/api/admin/characters';
const routeGameChars = id => `/api/admin/games/${id}/characters`;

export function setGameId(id) {
  return { type: SET_GAME_ID, id };
}

export function fetchCharacters() {
  return (dispatch) => {
    const { gameId, query } = dispatch(component.getState());
    return dispatch(getData(`${routeGameChars(gameId)}?${stringify(query)}`))
      .normalize([charactersEntity])
      .save()
      .exec(component);
  };
}

export function fetchGameInfo() {
  return (dispatch) => {
    const gameId = dispatch(component.getState()).gameId;
    return dispatch(getData(`/api/admin/games/${gameId}`)).asJson().exec(component)
      .then((game) => {
        dispatch({ type: ADD_GAME_INFO, game });
      });
  };
}

export function changeOrder(id, order) {
  return dispatch =>
    dispatch(submitData(`${route}/${id}?action=swaporder`)).patch().json({ link: { order } }).exec();
}

export function deleteCharacter(id) {
  return dispatch =>
    dispatch(submitData(`${route}/${id}`)).delete().exec();
}

const defaultState = Immutable({
  query: {
    sort: 'link.order',
  },
  gameId: '',
  gameInfo: {},
});

function reducer(state = null, action) {
  switch (action.type) {
    case ADD_GAME_INFO:
      return Immutable.merge(state, { gameInfo: action.game });

    case SET_GAME_ID:
      return Immutable.merge(state, { gameId: action.id });

    default: {
      return state;
    }
  }
}

export default {
  defaultState,
  reducer,
};

