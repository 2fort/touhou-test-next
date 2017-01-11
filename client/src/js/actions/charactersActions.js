import { normalize } from 'normalizr';
import { charactersEntity, gameEntity } from '../schemas/characters';
import checkResponseStatus from './asyncHelpers';
import * as types from '../constants/ActionTypes';

export function changeMode(mode) {
  return {
    type: types.CHANGE_MODE,
    mode,
  };
}

export function fetchGames(component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    fetch('/api/games')
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

export function fetchCharacters(game, component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    fetch(`/api/characters/${game}`)
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

export function fetchCharacter(char, component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    fetch(`/api/character/${char}`)
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .then((character) => {
        // console.log(character);
        const data = normalize(character, [charactersEntity]);
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
