import Immutable from 'seamless-immutable';
import { characterEntityOnly } from '../../schemas/appSchemas';
import { generateComponent } from '../../ducks/domain';
import { getData } from '../../actions/fetchAndSave';

const componentName = 'CharactersList';
const component = generateComponent(componentName);

const ADD_GAME_INFO = `${componentName}/ADD_GAME_INFO`;

export function getGameInfo(gameId) {
  return dispatch =>
    dispatch(getData(`/api/games/${gameId}`)).asJson().exec(component)
      .then((game) => {
        dispatch({ type: ADD_GAME_INFO, game });
      });
}

export function fetchCharacters(gameId) {
  return dispatch =>
    dispatch(getData(`/api/games/${gameId}/characters`))
      .normalize([characterEntityOnly])
      .save()
      .asJson()
      .exec(component);
}

const defaultState = Immutable({
  gameInfo: {},
});

function reducer(state = null, action) {
  switch (action.type) {
    case ADD_GAME_INFO:
      return Immutable.merge(state, { gameInfo: action.game });

    default:
      return state;
  }
}

export default {
  defaultState,
  reducer,
};
