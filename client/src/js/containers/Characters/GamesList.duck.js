import { gameEntity } from '../../schemas/appSchemas';
import { generateComponent } from '../../ducks/domain';
import fetchAndSave from '../../actions/fetchAndSave';

const component = generateComponent('GamesList');

export default function fetchGames() {
  return dispatch =>
    dispatch(fetchAndSave('/api/games', [gameEntity], component));
}
