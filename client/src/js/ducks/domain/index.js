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
});

export default function domainSlice(componentName, reducer = defaultDomainReducer, defaultState) {
  const initState = (defaultState) ? Immutable.merge(defaultDomainState, defaultState) : defaultDomainState;

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

      default:
        throw new Error(`${action.component} + ${componentName} match, but action not found`);
    }
  };
}
