import { charactersEntity } from '../../schemas/appSchemas';
import { generateComponent } from '../../ducks/domain';
import fetchAndSave from '../../actions/fetchAndSave';

const component = generateComponent('SingleCharacter');

export default function fetchCharacter(char) {
  return dispatch =>
    dispatch(fetchAndSave(`/api/character/${char}`, [charactersEntity], component));
}
