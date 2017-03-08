import Immutable from 'seamless-immutable';

const ADD_ENTITIES = 'ADD_ENTITIES';

function mergeStrategy(oldEntities, newEntites) {
  const oldKeys = Object.keys(oldEntities);
  const newKeys = Object.keys(newEntites);
  const go = {};

  oldKeys.forEach((entity) => {
    if (!newKeys.includes(entity)) {
      go[entity] = oldEntities[entity];
    }
  });

  newKeys.forEach((entity) => {
    if (oldKeys.includes(entity)) {
      go[entity] = { ...oldEntities[entity], ...newEntites[entity] };
    } else {
      go[entity] = newEntites[entity];
    }
  });

  return Immutable(go);
}

export function addEntities(entity) {
  return { type: ADD_ENTITIES, entities: entity };
}

export default function entities(state = Immutable({ games: {}, characters: {} }), action) {
  switch (action.type) {
    case ADD_ENTITIES:
      return mergeStrategy(state, action.entities);

    default: {
      return state;
    }
  }
}
