import { normalize } from 'normalizr';
import { charactersEntity, gameEntity } from '../schemas/characters';
import { generateTest } from './mainActions';
import * as types from '../constants/ActionTypes';

export function purgeCache() {
  return {
    type: types.PURGE_CACHE,
  };
}

function checkResponseStatus(response) {
  if (response.status !== 200) {
    throw new Error(`Resource unavailable: ${response.statusText} (${response.status})`);
  }
}

export function fetchTestInfo() {
  return {
    type: types.FETCH_TEST_INFO_BEGIN,
  };
}

export function beginTest() {
  return (dispatch) => {
    const maxSteps = 20;
    fetch('/api/characters')
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .then((characters) => {
        const response = { characters };
        const result = generateTest(characters, maxSteps);

        dispatch({
          type: types.TEST_BEGIN,
          steps: result,
          maxSteps,
        });

        dispatch({
          type: types.FETCH_TEST_INFO_SUCCESS,
          response,
        });
      })
      .catch((err) => {
        dispatch({
          type: types.FETCH_TEST_INFO_FAIL,
          err,
        });
      });
  };
}

export function resetTest() {
  return (dispatch) => {
    dispatch(purgeCache());
    dispatch(beginTest());
  };
}

export function fetchGamesBegin() {
  return {
    type: types.FETCH_GAMES_BEGIN,
  };
}

export function fetchGames() {
  return (dispatch) => {
    fetch('/api/games')
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .then((games) => {
        const data = normalize(games, [gameEntity]);
        dispatch({
          type: types.FETCH_GAMES_SUCCESS,
          response: data.entities,
        });
      })
      .catch((err) => {
        dispatch({
          type: types.FETCH_GAMES_FAIL,
          err,
        });
      });
  };
}

export function fetchCharactersBegin() {
  return {
    type: types.FETCH_CHARACTERS_BEGIN,
  };
}

export function fetchCharacters(game) {
  return (dispatch) => {
    fetch(`/api/characters/${game}`)
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .then((characters) => {
        const data = normalize(characters, [charactersEntity]);
        dispatch({
          type: types.FETCH_CHARACTERS_SUCCESS,
          response: data.entities,
        });
      })
      .catch((err) => {
        dispatch({
          type: types.FETCH_CHARACTERS_FAIL,
          err,
        });
      });
  };
}

export function fetchCharacterBegin() {
  return {
    type: types.FETCH_CHARACTER_BEGIN,
  };
}

export function fetchCharacter(char) {
  return (dispatch) => {
    fetch(`/api/character/${char}`)
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .then((character) => {
        const data = normalize(character, [charactersEntity]);
        dispatch({
          type: types.FETCH_CHARACTER_SUCCESS,
          response: data.entities,
        });
      })
      .catch((err) => {
        dispatch({
          type: types.FETCH_CHARACTER_FAIL,
          err,
        });
      });
  };
}
