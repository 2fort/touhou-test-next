import _ from 'lodash';
import Immutable from 'seamless-immutable';
import hoc from './hoc';

// mounting actions
const CONTAINER_MOUNT = 'CONTAINER_MOUNT';
const CONTAINER_UNMOUNT = 'CONTAINER_UNMOUNT';
const CONTAINER_DESTROY = 'CONTAINER_DESTROY';

// fetching actions
const FETCH_BEGIN = 'FETCH_BEGIN';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_FAIL = 'FETCH_FAIL';
const ADD_VISIBLE = 'ADD_VISIBLE';
const SET_SORT = 'SET_SORT';
const SET_FILTER = 'SET_FILTER';
const SET_PAGE = 'SET_PAGE';
const SET_LIMIT = 'SET_LIMIT';
const SET_QUERY = 'SET_QUERY';

export const domainHoc = hoc;

export function generateComponent(component) {
  return {
    containerMount: () => (
      { type: CONTAINER_MOUNT, component }
    ),

    containerUnmount: () => (
      { type: CONTAINER_UNMOUNT, component }
    ),

    containerDestroy: () => (
      { type: CONTAINER_DESTROY, component }
    ),

    fetchBegin: () => (
      { type: FETCH_BEGIN, component }
    ),

    addVisible: (visible, total = 0) => (
      { type: ADD_VISIBLE, component, visible, total: Number(total) }
    ),

    fetchSuccess: () => (
      { type: FETCH_SUCCESS, component }
    ),

    fetchFail: () => (
      { type: FETCH_FAIL, component }
    ),

    setSort: field => (
      { type: SET_SORT, component, field }
    ),

    setFilter: filter => (
      { type: SET_FILTER, component, filter }
    ),

    setPage: page => (
      { type: SET_PAGE, component, page }
    ),

    setLimit: limit => (
      { type: SET_LIMIT, component, limit }
    ),

    setQuery: query => (
      { type: SET_QUERY, component, query }
    ),

    getState: () => (dispatch, getState) =>
      getState().domain[_.lowerFirst(component)],
  };
}

function defaultDomainReducer(state = null, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const defaultDomainState = Immutable({
  active: false,
  pending: false,
  visible: [],
  fetchedAt: 0,
  total: 0,
  query: {
    sort: '',
    filter: {},
    page: 1,
    limit: 10,
  },
});

export default function domainSlice(componentName, reducer = defaultDomainReducer, defaultState) {
  const initState = (defaultState) ? Immutable.merge(defaultDomainState, defaultState, { deep: true }) : defaultDomainState;

  return (state, action) => {
    if (!action.component || componentName !== action.component) {
      return reducer(state, action);
    }

    switch (action.type) {
      case CONTAINER_MOUNT: {
        const returnState = (state) || initState; // first-time mounting check
        return Immutable.merge(returnState, { active: true });
      }

      case CONTAINER_UNMOUNT: {
        return Immutable.merge(state, { active: false });
      }

      case CONTAINER_DESTROY: {
        return null;
      }

      case FETCH_BEGIN: {
        return Immutable.merge(state, { pending: true });
      }

      case ADD_VISIBLE:
        return Immutable.merge(state, { visible: action.visible, total: action.total, fetchedAt: new Date() });

      case FETCH_SUCCESS:
      case FETCH_FAIL:
        return Immutable.merge(state, { pending: false });

      case SET_SORT:
        return Immutable.merge(state, { query: { sort: action.field } }, { deep: true });

      case SET_FILTER:
        return Immutable.merge(state, { query: { filter: action.filter } }, { deep: true });

      case SET_PAGE:
        return Immutable.merge(state, { query: { page: action.page } }, { deep: true });

      case SET_LIMIT:
        return Immutable.merge(state, { query: { limit: action.limit } }, { deep: true });

      case SET_QUERY:
        return Immutable.merge(state, { query: action.query }, { deep: true });

      default:
        throw new Error(`${action.component} + ${componentName} match, but action not found`);
    }
  };
}
