import Immutable from 'seamless-immutable';
import { stringify } from 'qs';
import { initialize } from 'redux-form';

import { charactersEntity, gameEntity } from '../../../schemas/adminSchemas';
import { generateComponent } from '../../../ducks/domain';
import { getData, formSubmit, jsonSubmit } from '../../../actions/fetchAndSave';

const componentName = 'GameCharactersTable';
const NEW_CHAR_MODAL_OPEN = `${componentName}/NEW_CHAR_MODAL_OPEN`;
const NEW_CHAR_MODAL_CLOSE = `${componentName}/NEW_CHAR_MODAL_CLOSE`;
const EDIT_CHAR_MODAL_OPEN = `${componentName}/EDIT_CHAR_MODAL_OPEN`;
const EDIT_CHAR_MODAL_CLOSE = `${componentName}/EDIT_CHAR_MODAL_CLOSE`;

const component = generateComponent(componentName);
const routeChars = '/api/admin/characters';
const routeGameChars = id => `/api/admin/games/${id}/characters`;



export function changeOrder(id, order) {
  return dispatch =>
    dispatch(jsonSubmit(`${route}/${id}`, 'PATCH', { link: { rel: order } }));
}

export function newCharacter(values) {
  return dispatch =>
    dispatch(formSubmit(route, { method: 'POST', body: values }));
}

export function editCharacter(id, values) {
  return dispatch =>
    dispatch(formSubmit(`${route}/${id}`, { method: 'PATCH', body: values }));
}

export function deleteCharacter(id) {
  return dispatch =>
    dispatch(formSubmit(`${route}/${id}`, { method: 'DELETE' }));
}

const defaultState = Immutable({
  query: {
    sort: 'rel.order',
  },
  allGames: {},
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
