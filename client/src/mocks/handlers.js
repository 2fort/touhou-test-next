import { rest } from 'msw';
import characters from './characters';
import games from './games';

export default [
  rest.get('api/characters', (req, res, ctx) => res(
    ctx.status(200),
    ctx.json(characters),
  )),

  rest.get('api/games', (req, res, ctx) => res(
    ctx.status(200),
    ctx.json(games),
  )),
];

