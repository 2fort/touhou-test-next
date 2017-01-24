import Immutable from 'seamless-immutable';

const ADD_ENTITIES = 'ADD_ENTITIES';

export function addEntities(entity) {
  return { type: ADD_ENTITIES, entities: entity };
}

export default function entities(state = Immutable({ games: {}, characters: {} }), action) {
  switch (action.type) {
    case ADD_ENTITIES:
      return Immutable.merge(state, action.entities, { deep: true });

    default: {
      return state;
    }
  }
}
