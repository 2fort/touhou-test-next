import Immutable from 'seamless-immutable';
import { stringify } from 'qs';

import { charactersEntity, gameEntity } from '../../schemas/adminSchemas';
import { generateComponent } from '../../ducks/domain';
import { getData, submitData } from '../../actions/fetchAndSave';

const componentName = 'CharactersTable';
const ADD_ALL_GAMES = `${componentName}/ADD_ALL_GAMES`;

const component = generateComponent(componentName);
const route = '/api/admin/characters';

export function fetchCharacters() {
  return (dispatch) => {
    const query = dispatch(component.getState()).query;
    return dispatch(getData(`${route}?${stringify(query)}`))
      .normalize([charactersEntity])
      .save()
      .asJson()
      .exec(component);
  };
}

export function fetchAllGames() {
  return dispatch =>
    dispatch(getData('/api/admin/games')).normalize([gameEntity]).asObject().exec(component)
      .then(({ games }) => {
        dispatch({ type: ADD_ALL_GAMES, games });
      });
}

export function deleteCharacter(id) {
  return dispatch =>
    dispatch(submitData(`${route}/${id}`)).delete().exec();
}

const defaultState = Immutable({
  query: {
    sort: 'name',
  },
  allGames: {},
});

function reducer(state = null, action) {
  switch (action.type) {
    case ADD_ALL_GAMES:
      return Immutable.merge(state, { allGames: action.games });

    default: {
      return state;
    }
  }
}

export default {
  defaultState,
  reducer,
};
