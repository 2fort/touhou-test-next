import { normalize } from 'normalizr';
import { SubmissionError } from 'redux-form';

import { charactersEntity, characterEntityOnly, gameEntity } from '../schemas/adminSchemas';
import checkResponseStatus from './asyncHelpers';
import * as types from '../constants/ActionTypes';

export function flushMsg() {
  return {
    type: types.FLUSH_MSG,
  };
}

export function fetchAllGames(component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    fetch('/api/admin/games')
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .then((games) => {
        const data = normalize(games, [gameEntity]);
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

export function fetchAllCharacters(component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    fetch('/api/admin/characters')
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .then((characters) => {
        const data = normalize(characters, [charactersEntity]);
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

export function fetchOneGame(gameId, component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    fetch(`/api/admin/games/edit/${gameId}`)
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .then((game) => {
        const data = normalize(game, gameEntity);
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

    fetch('/api/admin/games')
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .then((games) => {
        const data = normalize(games, [gameEntity]);
        dispatch({
          type: types.FETCH_SUCCESS,
          entities: data.entities,
        });
        return fetch(`/api/admin/characters/edit/${characterId}`);
      })
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .then((characters) => {
        const data = normalize(characters, characterEntityOnly);
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

export function editGame(gameId, values, component) {
  const formData = new FormData();
  formData.append('prefix', values.prefix);
  formData.append('title', values.title);
  formData.append('year', values.year);
  formData.append('cover', values.cover);

  if (values.newcover[0]) {
    formData.append('newcover', values.newcover[0], values.newcover[0].name);
  }

  return dispatch =>
    fetch(`/api/admin/games/edit/${gameId}`, {
      method: 'post',
      body: formData,
    })
    .then((response) => {
      checkResponseStatus(response);
      return response.json();
    })
    .then((newGame) => {
      dispatch({
        type: types.SUBMIT_SUCCESS,
      });

      const data = normalize(newGame, gameEntity);

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
        type: types.SUBMIT_FAIL,
        err,
      });
      throw new SubmissionError({ _error: err.message });
    });
}
