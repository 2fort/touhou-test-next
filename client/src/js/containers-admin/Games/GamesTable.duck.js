import Immutable from 'seamless-immutable';
import { stringify } from 'qs';

import { gameEntity } from '../../schemas/adminSchemas';
import { generateComponent } from '../../ducks/domain';
import { getData, formSubmit, jsonSubmit } from '../../actions/fetchAndSave';

const componentName = 'GamesTable';
const component = generateComponent(componentName);
const route = '/api/admin/games';

export function fetchGames() {
  return (dispatch) => {
    const query = dispatch(component.getState()).query;
    return dispatch(getData(`${route}?${stringify(query)}`)).normalize([gameEntity]).save().exec(component);
  };
}

export function deleteGame(id) {
  return dispatch =>
    dispatch(formSubmit(`${route}/${id}`, { method: 'DELETE' }));
}

export function changeOrder(id, order) {
  return dispatch =>
    dispatch(jsonSubmit(`${route}/${id}?action=swaporder`, 'PATCH', { order }));
}

const defaultState = Immutable({
  query: {
    sort: 'order',
  },
});

function reducer(state = null, action) {
  switch (action.type) {
    default: {
      return state;
    }
  }
}

export default {
  defaultState,
  reducer,
};
