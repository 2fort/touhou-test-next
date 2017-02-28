import { schema } from 'normalizr';

const gameEntity = new schema.Entity('games', {}, { idAttribute: 'slug' });

const charactersEntity = new schema.Entity('characters', {
  link: {
    rel: gameEntity,
  },
}, { idAttribute: 'slug' });

export { charactersEntity, gameEntity };
