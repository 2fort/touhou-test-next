import Immutable from 'seamless-immutable';
import { componentName } from '../Base';

// App Base actions
export const CHANGE_MODE = `${componentName}/CHANGE_MODE`;

export function changeMode(mode) {
  return { type: CHANGE_MODE, mode };
}

export default function base(state = Immutable({ mode: 'grid' }), action) {
  switch (action.type) {
    case CHANGE_MODE:
      return Immutable.merge(state, { mode: action.mode });

    default: {
      return state;
    }
  }
}
