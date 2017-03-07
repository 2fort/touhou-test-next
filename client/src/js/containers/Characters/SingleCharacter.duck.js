import { charactersEntity } from '../../schemas/appSchemas';
import { generateComponent } from '../../ducks/domain';
import { getData } from '../../actions/fetchAndSave';

const component = generateComponent('SingleCharacter');

export default function fetchCharacter(char) {
  return dispatch =>
    dispatch(getData(`/api/character/${char}`))
      .normalize([charactersEntity])
      .save()
      .asJson()
      .exec(component);
}
