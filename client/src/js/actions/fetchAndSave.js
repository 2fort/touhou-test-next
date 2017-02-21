import { normalize } from 'normalizr';
import { SubmissionError } from 'redux-form';
import request from '../api';

import * as entitiesActions from '../ducks/entities';
import * as flashMessageActions from '../ducks/flashMessage';

export default function (url, schema, component, saveVisible = true) {
  return (dispatch) => {
    dispatch(component.fetchBegin());

    return request(url)
      .then((response) => {
        const data = normalize(response.json, schema);
        dispatch(entitiesActions.addEntities(data.entities));

        if (saveVisible) {
          dispatch(component.addVisible(data.result, response.headers.total));
        }

        dispatch(component.fetchSuccess());
        return response.json;
      })
      .catch((err) => {
        dispatch(component.fetchFail());
        dispatch(flashMessageActions.add(err.status, err.message, 3));
      });
  };
}

export function fetchAndReturnJson(url, component, schema = null) {
  return (dispatch) => {
    dispatch(component.fetchBegin());

    return request(url)
      .then((response) => {
        dispatch(component.fetchSuccess());

        if (schema) {
          const data = normalize(response.json, schema);
          return data.entities;
        }

        return response.json;
      })
      .catch((err) => {
        dispatch(component.fetchFail());
        dispatch(flashMessageActions.add(err.status, err.message, 3));
      });
  };
}

export function fetchAndSaveEntities(url, schema) {
  return dispatch =>
    request(url)
      .then((response) => {
        const data = normalize(response.json, schema);
        dispatch(entitiesActions.addEntities(data.entities));
        return response.json;
      })
      .catch((err) => {
        dispatch(flashMessageActions.add(err.status, err.message, 3));
      });
}

// mainReq is a { url: '', schema }
// restReqs is a [{ url: '', schema }, { url: '', schema }, ...]
export function fetchManyAndSave(mainReq, restReqs, component) {
  return (dispatch) => {
    dispatch(component.fetchBegin());

    Promise.all(restReqs.map(pair => request(pair.url)))
      .then((results) => {
        for (let i = 0; i < results.length; i++) {
          const data = normalize(results[i].json, restReqs[i].schema);
          dispatch(entitiesActions.addEntities(data.entities));
        }
        return request(mainReq.url);
      })
      .then((response) => {
        const data = normalize(response.json, mainReq.schema);
        dispatch(entitiesActions.addEntities(data.entities));
        dispatch(component.addVisible(data.result));
        dispatch(component.fetchSuccess());
      })
      .catch((err) => {
        dispatch(component.fetchFail());
        dispatch(flashMessageActions.add(err.status, err.message, 3));
      });
  };
}

export function formSubmit(route, options) {
  return dispatch =>
    request(route, options)
    .then((response) => {
      const message = response.json ? response.json.message : response.statusText;
      dispatch(flashMessageActions.add(response.status, message, 0));
    })
    .catch((err) => {
      throw new SubmissionError({ _error: err.message });
    });
}

export function jsonSubmit(route, method, fields) {
  return dispatch =>
    request(route, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fields),
    })
    .then((response) => {
      const message = response.json ? response.json.message : response.statusText;
      dispatch(flashMessageActions.add(response.status, message, 0));
    })
    .catch((err) => {
      dispatch(flashMessageActions.add(err.status, err.message, 3));
    });
}
