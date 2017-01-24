import { charactersEntity } from '../../schemas/appSchemas';
import { generateComponent } from '../../ducks/domain';
import fetchAndSave from '../../actions/fetchAndSave';

const component = generateComponent('CharactersList');

export default function fetchCharacters(game) {
  return dispatch =>
    dispatch(fetchAndSave(`/api/characters/${game}`, [charactersEntity], component));
}
