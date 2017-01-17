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
  return dispatch =>
    fetch(`/api/admin/games/edit/${gameId}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
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
