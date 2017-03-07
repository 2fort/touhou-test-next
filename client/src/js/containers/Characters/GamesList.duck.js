import { gameEntity } from '../../schemas/appSchemas';
import { generateComponent } from '../../ducks/domain';
import { getData } from '../../actions/fetchAndSave';

const component = generateComponent('GamesList');

export default function fetchGames() {
  return dispatch =>
    dispatch(getData('/api/games'))
      .normalize([gameEntity])
      .save()
      .asJson()
      .exec(component);
}
