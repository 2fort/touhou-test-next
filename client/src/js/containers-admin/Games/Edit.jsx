import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { fetchOneGame } from '../../actions/adminActions';
import { textField, imageField } from '../_sharedComponents/formFields';
import { required, number } from '../_sharedComponents/validationFields';

let GameEdit = class GameEdit extends Component {
  componentWillMount() {
    this.props.actions.didMount();
    this.props.actions.getData(this.props.params.id);
  }

  componentWillUnmount() {
    this.props.actions.willUnmount();
  }

  render() {
    const { initialValues, params, router, ready } = this.props;
    const { handleSubmit, pristine, reset, submitting } = this.props;

    if (!ready) return null;

    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit}>
          <Field name="id" type="text" disabled component={textField} label="id" />
          <Field name="prefix" type="text" component={textField} label="Prefix" />
          <Field name="title" type="text" component={textField} label="Title" validate={[required]} />
          <Field
            name="image"
            imgRoot="/images/games/"
            currentImage={initialValues.cover}
            type="file"
            component={imageField}
            label="Image"
          />
          <Field name="year" type="text" component={textField} label="Year" validate={[number]} />

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-primary">Edit</button>
            </div>
          </div>
        </form>

        <button type="button" className="btn btn-default" onClick={router.goBack} >
          <span aria-hidden="true">&larr;</span> Back
        </button>
      </div>
    );
  }
};

GameEdit.defaultProps = {
  initialValues: undefined,
};

GameEdit.propTypes = {
  ready: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    prefix: PropTypes.string,
    title: PropTypes.string.isRequired,
    year: PropTypes.number,
    cover: PropTypes.string,
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

GameEdit = reduxForm({
  form: 'GameEditForm',
})(GameEdit);

function mapStateToProps({ domain: { gameEdit }, entities }) {
  if (!gameEdit || gameEdit.pending) return { ready: false };

  const initialValues = entities.games[gameEdit.visible];
  return { ready: true, initialValues };
}

function mapDispatchToProps(dispatch) {
  const component = 'GameEdit';
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
        dispatch(fetchOneGame(gameId, component));
      },
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameEdit);
