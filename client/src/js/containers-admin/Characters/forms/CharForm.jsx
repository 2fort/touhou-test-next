import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { Field, reduxForm, formValueSelector, propTypes } from 'redux-form';

import { IMG_THUMBNAIL } from '../../../config';
import { CheckboxField, TextField, ImageField, OrderSelectField } from '../../_sharedComponents/fields';
import { required } from '../../_sharedComponents/validationFields';
import FilePreviewHoc from '../../_sharedComponents/FilePreviewHoc';
import Loading from '../../../containers/Base/components/Loading';
import Ttools from '../../Base/components/TableTools';

class CharForm extends Component {
  constructor(props) {
    super(props);
    this.state = { initialGamesList: props.charsList };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.pristine && nextProps.pristine) {
      this.props.filePreview.revoke();
    }
  }

  prepareCharListForOrderField = () => {
    const { initialValues, currentValues, filePreview, charsList } = this.props;

    const cleanList = initialValues.link && initialValues.link.rel === currentValues.game
      ? this.state.initialGamesList.filter(char => initialValues.id !== char.id)
      : charsList.filter(char => initialValues.id !== char.id);

    const defaultImage = currentValues.image && typeof currentValues.image === 'string'
      ? currentValues.image
      : null;

    const newObj = {
      id: initialValues.id,
      name: currentValues.name,
      image: filePreview.blob || defaultImage || '',
    };

    const newList = [...cleanList];

    newList.splice(currentValues.order - 1, 0, newObj);

    const tableBody = newList.map((char, i) => (
      <tr className={char.id === initialValues.id ? 'info' : ''} key={char.name || i}>
        <Ttools.Td w={15} center>
          {i + 1}
        </Ttools.Td>

        <Ttools.Td w={15} center>
          {char.image &&
            <img
              height={50}
              alt="char preview"
              src={filePreview.blobTest(char.image) ? char.image : IMG_THUMBNAIL + char.image}
            />
          }
        </Ttools.Td>

        <Ttools.Td w={70}>
          {char.name}
        </Ttools.Td>
      </tr>
    ));

    const fullTable = (
      <Ttools.Table fixed className="table table-striped">
        <thead>
          <tr>
            <Ttools.Th center>
              Position
            </Ttools.Th>

            <Ttools.Th center>
              Image
            </Ttools.Th>

            <th>
              Name
            </th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </Ttools.Table >
    );

    return { charList: fullTable, max: tableBody.length };
  }

  gameSelectHandler = (e) => {
    const { actions, change } = this.props;

    if (e.target.value === '') {
      e.preventDefault();
      actions.cleanCharsFromGame();
      change('link.rel', null);
      change('link.order', null);
      return;
    }

    actions.cleanCharsFromGame();
    actions.getCharsFromGame(e.target.value)
      .then((chars) => {
        change('link.order', this.chageOrder(e.target.value, chars.length));
      });
  }

  chageOrder = (currentGame, length) => {
    const { mode, initialValues } = this.props;
    const initialGame = initialValues.link && initialValues.link.rel;

    if (mode === 'new') {
      return length + 1;
    }
    if (mode === 'edit' && currentGame !== initialGame) {
      return length + 1;
    }
    if (mode === 'edit' && currentGame === initialGame) {
      return initialValues.link.order;
    }
    return null;
  }

  render() {
    const { pending, currentValues, handleSubmit, error, filePreview, allGames } = this.props;

    const { charList, max } = currentValues.game ? this.prepareCharListForOrderField() : { charList: null, max: null };

    const gameOptions = allGames.map(game => (
      <option key={game.title} value={game.id}>{game.title}</option>
    ));

    return (
      <div className="static-modal">
        <form encType="multipart/form-data" className="form-horizontal" onSubmit={handleSubmit}>
          <Field name="id" type="hidden" component="input" />
          <Field name="name" type="text" component={TextField} label="Name" validate={[required]} />
          <Field
            name="image"
            type="file"
            component={ImageField}
            label="Image"
            filePreview={filePreview}
          />

          <div className="form-group">
            <label htmlFor="link.rel" className="col-sm-2 control-label">Game</label>
            <div className="col-sm-10">
              <Field name="link.rel" component="select" className="form-control" onChange={this.gameSelectHandler}>
                <option />
                {gameOptions}
              </Field>
            </div>
          </div>

          {currentValues.game && !pending &&
            <Field
              name="link.order"
              component={OrderSelectField}
              list={charList}
              max={max}
            />
          }

          {currentValues.game && pending &&
            <Loading />
          }

          <Field name="art.author" type="text" component={TextField} label="Art author" />
          <Field name="art.url" type="text" component={TextField} label="Art url" />
          <Field name="wiki" type="text" component={TextField} label="Wiki" />
          <Field name="published" component={CheckboxField} label="Published" />

          {error &&
            <Alert bsStyle="danger"><strong>Error: </strong>{error}</Alert>
          }
        </form>
      </div>
    );
  }
}

CharForm.defaultProps = {
  error: '',
};

CharForm.propTypes = {
  pending: PropTypes.bool.isRequired,
  allGames: PropTypes.arrayOf(PropTypes.object).isRequired,
  mode: PropTypes.oneOf([
    'new',
    'edit',
  ]).isRequired,
  charsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.shape({
    getCharsFromGame: PropTypes.func.isRequired,
    cleanCharsFromGame: PropTypes.func.isRequired,
  }).isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    link: PropTypes.shape({
      rel: PropTypes.string,
      order: PropTypes.number,
    }),
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
    wiki: PropTypes.string,
  }).isRequired,
  currentValues: PropTypes.shape({
    name: PropTypes.string,
    game: PropTypes.string,
    order: PropTypes.any,
    image: PropTypes.any,
  }).isRequired,
  filePreview: PropTypes.shape({
    add: PropTypes.func.isRequired,
    revoke: PropTypes.func.isRequired,
    blob: PropTypes.string.isRequired,
    blobTest: PropTypes.func.isRequired,
  }).isRequired,
  ...propTypes,
};

const selector = formValueSelector('CharForm');

function mapStateToProps(state) {
  return {
    currentValues: {
      name: selector(state, 'name'),
      game: selector(state, 'link.rel'),
      order: selector(state, 'link.order'),
      image: selector(state, 'image'),
    },
  };
}

export default connect(mapStateToProps)(
  reduxForm({ form: 'CharForm' })(
    FilePreviewHoc(CharForm)),
);
