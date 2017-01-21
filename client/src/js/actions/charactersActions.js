import { normalize } from 'normalizr';
import { charactersEntity, gameEntity } from '../schemas/appSchemas';
import request from './api';
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

    request('/api/games')
      .then((games) => {
        const data = normalize(games.json, [gameEntity]);
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

    request(`/api/characters/${game}`)
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

export function fetchCharacter(char, component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    request(`/api/character/${char}`)
      .then((character) => {
        const data = normalize(character.json, [charactersEntity]);
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
