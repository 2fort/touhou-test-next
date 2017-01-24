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
