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
      asJson: false,
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

  asJson = () => {
    this.props.asJson = true;
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

    const { url, save, dispatch, schema, asJson, asObject, raw } = this.props;

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

          if (asJson) {
            return resolve(data.json);
          } else if (asObject) {
            return resolve(data.hashTable);
          }
          return response;
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

class SubmitData {
  constructor(url, dispatch) {
    this.props = {
      url,
      dispatch,
      asFormData: false,
      asJson: false,
    };

    this.options = {
      method: '',
      headers: {},
      body: {},
    };
  }

  post = () => {
    this.options.method = 'POST';
    return this;
  }

  put = () => {
    this.options.method = 'PUT';
    return this;
  }

  patch = () => {
    this.options.method = 'PATCH';
    return this;
  }

  delete = () => {
    this.options.method = 'DELETE';
    return this;
  }

  form = (formData) => {
    this.props.asFormData = true;
    this.options.body = formData;
    return this;
  }

  json = (object) => {
    this.props.asJson = true;
    this.options.headers = { 'Content-Type': 'application/json' };
    this.options.body = JSON.stringify(object);
    return this;
  }

  exec = () => {
    const { url, dispatch, asFormData } = this.props;

    return request(url, this.options)
      .then((response) => {
        const message = response.json ? response.json.message : response.statusText;
        dispatch(flashMessageActions.add(response.status, message, 0));
        return true;
      })
      .catch((err) => {
        if (asFormData) {
          throw new SubmissionError({ _error: err.message });
        } else {
          dispatch(flashMessageActions.add(err.status, err.message, 3));
        }
      });
  }
}

export function submitData(url) {
  return dispatch => new SubmitData(url, dispatch);
}
