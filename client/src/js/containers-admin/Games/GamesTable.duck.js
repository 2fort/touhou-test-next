import Immutable from 'seamless-immutable';
import { stringify } from 'qs';

import { gameEntity } from '../../schemas/adminSchemas';
import { generateComponent } from '../../ducks/domain';
import { getData, submitData } from '../../actions/fetchAndSave';

const componentName = 'GamesTable';
const component = generateComponent(componentName);
const route = '/api/admin/games';

export function fetchGames() {
  return (dispatch) => {
    const query = dispatch(component.getState()).query;
    return dispatch(getData(`${route}?${stringify(query)}`))
      .normalize([gameEntity])
      .save()
      .asJson()
      .exec(component);
  };
}

export function deleteGame(id) {
  return dispatch =>
    dispatch(submitData(`${route}/${id}`)).delete().exec();
}

export function changeOrder(id, order) {
  return dispatch =>
    dispatch(submitData(`${route}/${id}?action=swaporder`)).patch().json({ order }).exec();
}

const defaultState = Immutable({
  query: {
    sort: 'order',
  },
});

export default {
  defaultState,
};
