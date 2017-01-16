import { schema } from 'normalizr';

const gameEntity = new schema.Entity('games');

const charactersEntity = new schema.Entity('characters', {
  _game: gameEntity,
});

const characterEntityOnly = new schema.Entity('characters');

export { charactersEntity, characterEntityOnly, gameEntity };
