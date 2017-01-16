import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

import { textField, imageField } from '../../_sharedComponents/formFields';
import { required } from '../../_sharedComponents/validationFields';

const CharacterEditForm = ({ gamesData, initialValues, handleSubmit, pristine, reset, submitting }) => {
  const gameOptions = gamesData.map(game => (
    <option key={game.title} value={game.id}>{game.title}</option>
  ));

  return (
    <form encType="multipart/form-data" className="form-horizontal" onSubmit={handleSubmit}>
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
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting && <i className="fa fa-spinner fa-spin" />} Edit
          </button>
          {' '}
          <button type="button" disabled={pristine || submitting} onClick={reset} className="btn btn-default">
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

CharacterEditForm.propTypes = {
  gamesData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    wiki: PropTypes.string,
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
    image: PropTypes.string,
  }).isRequired,

  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'CharacterEditForm',
})(CharacterEditForm);
