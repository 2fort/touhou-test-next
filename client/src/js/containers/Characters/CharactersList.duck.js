import { charactersEntity } from '../../schemas/appSchemas';
import { generateComponent } from '../../ducks/domain';
import { getData } from '../../actions/fetchAndSave';

const component = generateComponent('CharactersList');

export default function fetchCharacters(game) {
  return dispatch =>
    dispatch(getData(`/api/characters/${game}`))
      .normalize([charactersEntity])
      .save()
      .asJson()
      .exec(component);
}
