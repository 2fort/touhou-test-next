import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { fetchOneCharacter } from '../../actions/adminActions';
import { textField, imageField } from '../_sharedComponents/formFields';
import { required, number } from '../_sharedComponents/validationFields';

let CharacterEdit = class CharacterEdit extends Component {
  componentWillMount() {
    this.props.actions.didMount();
    this.props.actions.getData(this.props.params.id);
  }

  componentWillUnmount() {
    this.props.actions.willUnmount();
  }

  render() {
    const { initialValues, params, router, ready, gamesData } = this.props;
    const { handleSubmit, pristine, reset, submitting } = this.props;

    if (!ready) return null;

    const gameOptions = gamesData.map(game => (
      <option key={game.title} value={game.id}>{game.title}</option>
    ));

    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit}>
          <Field name="id" type="text" disabled component={textField} label="id" />
          <Field name="name" type="text" component={textField} label="Name" validate={[required]} />
          <Field
            name="image"
            imgRoot="/images/s/"
            currentImage={initialValues.image}
            type="file"
            component={imageField}
            label="Image"
          />

          <div className="form-group">
            <label htmlFor="_game" className="col-sm-2 control-label">Game</label>
            <div className="col-sm-10">
              <Field name="_game" component="select" className="form-control">
                <option />
                {gameOptions}
              </Field>
            </div>
          </div>

          <Field name="art.author" type="text" component={textField} label="Art author" />
          <Field name="art.url" type="text" component={textField} label="Art url" />
          <Field name="wiki" type="text" component={textField} label="Wiki" />

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-primary">Edit</button> {' '}
              <button type="button" disabled={pristine || submitting} onClick={reset} className="btn btn-default">
                Reset
              </button>
            </div>
          </div>
        </form>

        <button type="button" className="btn btn-default" onClick={router.goBack}>
          <span aria-hidden="true">&larr;</span> Back
        </button>
      </div>
    );
  }
};

CharacterEdit.defaultProps = {
  initialValues: undefined,
};

CharacterEdit.propTypes = {
  ready: PropTypes.bool.isRequired,

  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    wiki: PropTypes.string,
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
    image: PropTypes.string,
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,

  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,

  actions: PropTypes.shape({
    didMount: PropTypes.func.isRequired,
    willUnmount: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
  }).isRequired,
};

CharacterEdit = reduxForm({
  form: 'CharacterEditForm',
})(CharacterEdit);

function mapStateToProps({ domain: { characterEdit }, entities }) {
  if (!characterEdit || characterEdit.pending) return { ready: false };

  const initialValues = entities.characters[characterEdit.visible];
  const gamesData = Object.values(entities.games).map(game => ({ id: game.id, title: game.title }));

  return { ready: true, initialValues, gamesData };
}

function mapDispatchToProps(dispatch) {
  const component = 'CharacterEdit';
  return {
    actions: {
      didMount: () => {
        dispatch({
          type: 'CONTAINER_MOUNT',
          component,
        });
      },
      willUnmount: () => {
        dispatch({
          type: 'CONTAINER_DESTROY',
          component,
        });
      },
      getData: (gameId) => {
        dispatch(fetchOneCharacter(gameId, component));
      },
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterEdit);
