import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

import { textField, imageField } from '../../_sharedComponents/formFields';
import { required, number } from '../../_sharedComponents/validationFields';

const GameEditForm = ({ initialValues, timestamp, handleSubmit, pristine, reset, submitting }) => (
  <form encType="multipart/form-data" className="form-horizontal" onSubmit={handleSubmit}>
    <Field name="id" type="text" disabled component={textField} label="id" />
    <Field name="prefix" type="text" component={textField} label="Prefix" />
    <Field name="title" type="text" component={textField} label="Title" validate={[required]} />
    <Field name="cover" type="hidden" component="input" />
    <Field
      name="newcover"
      currentImage={initialValues.cover}
      type="file"
      component={imageField}
      label="Cover"
      key={timestamp}
    />
    <Field name="year" type="text" component={textField} label="Year" validate={[number]} />

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

GameEditForm.defaultProps = {
  error: '',
};

GameEditForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  // error: PropTypes.string,

  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    prefix: PropTypes.string,
    title: PropTypes.string.isRequired,
    year: PropTypes.number,
    cover: PropTypes.string,
  }).isRequired,
  timestamp: PropTypes.number.isRequired,
};

export default reduxForm({
  form: 'GameEditForm',
  enableReinitialize: true,
})(GameEditForm);
