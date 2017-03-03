import { normalize } from 'normalizr';
import { SubmissionError } from 'redux-form';
import request from '../api';

import * as entitiesActions from '../ducks/entities';
import * as flashMessageActions from '../ducks/flashMessage';

class GetData {
  constructor(url, dispatch) {
    this.props = {
      url,
      dispatch,
      schema: null,
      save: false,
      raw: false,
      asObject: false,
    };
  }

  normalize = (schema) => {
    this.props.schema = schema;
    return this;
  }

  save = () => {
    this.props.save = true;
    return this;
  }

  asObject = () => {
    this.props.asObject = true;
    return this;
  }

  raw = () => {
    this.props.raw = true;
    return this;
  }

  exec = (component) => {
    const data = {
      json: undefined,
      hashTable: undefined,
    };

    const { url, save, dispatch, schema, raw, asObject } = this.props;

    const promise = new Promise((resolve, reject) => {
      dispatch(component.requestBegin(url));

      request(url)
        .then((response) => {
          data.json = response.json;

          if (schema) {
            const obj = normalize(response.json, schema);
            data.hashTable = obj.entities;

            if (save) {
              dispatch(entitiesActions.addEntities(obj.entities));
              dispatch(component.addVisible(obj.result, response.headers.total));
            }
          }

          dispatch(component.requestSuccess(url));

          if (asObject) {
            return resolve(data.hashTable);
          }
          return resolve(data.json);
        })
        .catch((err) => {
          dispatch(component.requestFail(url));
          dispatch(flashMessageActions.add(err.status, err.message, 3));
          return reject(err);
        });
    });

    if (raw) {
      return promise;
    }

    return promise.then(any => any).catch(() => {});
  }
}

export function getData(url) {
  return dispatch => new GetData(url, dispatch);
}

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
