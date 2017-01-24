import * as types from '../constants/ActionTypes';
import request from '../api';

export function fetchAllCharacters(component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    request('/api/admin/characters')
      .then((characters) => {
        const data = normalize(characters.json, [charactersEntity]);
        dispatch({
          type: types.FETCH_SUCCESS,
          component,
          entities: data.entities,
          visible: data.result,
          fetchedAt: Date.now(),
        });
      })
      .catch((err) => {
        dispatch({
          type: types.FETCH_FAIL,
          component,
          err,
        });
      });
  };
}

export function fetchOneCharacter(characterId, component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    request('/api/admin/games')
      .then((games) => {
        const data = normalize(games.json, [gameEntity]);
        dispatch({
          type: types.FETCH_SUCCESS,
          entities: data.entities,
        });
        return request(`/api/admin/characters/edit/${characterId}`);
      })
      .then((characters) => {
        const data = normalize(characters.json, characterEntityOnly);
        dispatch({
          type: types.FETCH_SUCCESS,
          component,
          entities: data.entities,
          visible: data.result,
          fetchedAt: Date.now(),
        });
      })
      .catch((err) => {
        dispatch({
          type: types.FETCH_FAIL,
          component,
          err,
        });
      });
  };
}

