import { normalize } from 'normalizr';
import request from '../api';

import * as entitiesActions from '../ducks/entities';
import * as flashMessageActions from '../ducks/flashMessage';

export default function (url, schema, component) {
  return (dispatch) => {
    dispatch(component.fetchBegin());

    return request(url)
      .then((response) => {
        const data = normalize(response.json, schema);
        dispatch(entitiesActions.addEntities(data.entities));
        dispatch(component.fetchSuccess(data.result));
        return response.json;
      })
      .catch((err) => {
        dispatch(component.fetchFail());
        dispatch(flashMessageActions.add(err.status, err.message, 3));
      });
  };
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
        dispatch(component.fetchSuccess(data.result));
      })
      .catch((err) => {
        dispatch(component.fetchFail());
        dispatch(flashMessageActions.add(err.status, err.message, 3));
      });
  };
}
