import Immutable from 'seamless-immutable';
import * as types from '../../constants/ActionTypes';

export function defaultDomainReducer(state = null, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export const defaultDomainState = Immutable({
  active: false,
  pending: false,
  visible: [],
  fetchedAt: 0,
});

export default function domainSlice(componentName, reducer = defaultDomainReducer, defaultState) {
  const finalState = (defaultState) ? Immutable.merge(defaultDomainState, defaultState) : defaultDomainState;

  return (state, action) => {
    if (!action.component || componentName !== action.component) {
      return reducer(state, action);
    }

    switch (action.type) {
      case types.CONTAINER_MOUNT: {
        const returnState = (state) || finalState; // first-time mounting check
        return Immutable.merge(returnState, { active: true });
      }

      case types.CONTAINER_UNMOUNT: {
        return Immutable.merge(state, { active: false });
      }

      case types.CONTAINER_DESTROY: {
        return null;
      }

      case types.FETCH_BEGIN: {
        return Immutable.merge(state, { pending: true });
      }

      case types.FETCH_SUCCESS:
        return Immutable.merge(state, {
          pending: false,
          visible: action.visible,
          fetchedAt: action.fetchedAt,
        });

      case types.FETCH_MODIFY: {
        const modVisible = Immutable.flatMap(state.visible, (value) => {
          if (value === action.id) {
            return [];
          }
          return value;
        });

        return Immutable.merge(state, {
          visible: modVisible,
        });
      }

      case types.FETCH_FAIL:
        return Immutable.merge(state, {
          pending: false,
        });

      default:
        return null;
        // console.log(`Reducer ${component} + can't find his component-specific action!`);
    }
  };
}
