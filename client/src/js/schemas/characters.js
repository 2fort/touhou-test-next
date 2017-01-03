import { schema } from 'normalizr';

const gameEntity = new schema.Entity('games', {}, { idAttribute: '_id' });

const charactersEntity = new schema.Entity('characters', {
  _game: gameEntity,
}, { idAttribute: '_id' });

export { charactersEntity, gameEntity };
