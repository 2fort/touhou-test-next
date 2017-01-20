import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { textField, imageField } from '../_sharedComponents/formFields';
import { required, number } from '../_sharedComponents/validationFields';
import { newGame } from '../../actions/adminActions';

let NewGameForm = ({ handleSubmit, submitting, router }) => (
  <form encType="multipart/form-data" className="form-horizontal" onSubmit={handleSubmit}>
    <Field name="prefix" type="text" component={textField} label="Prefix" />
    <Field name="title" type="text" component={textField} label="Title" validate={[required]} />
    <Field
      name="cover"
      type="file"
      component={imageField}
      label="Cover"
    />
    <Field name="year" type="text" component={textField} label="Year" validate={[number]} />

    <div className="form-group">
      <div className="col-sm-offset-2 col-sm-10">
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting && <i className="fa fa-spinner fa-spin" />} Create
        </button>
      </div>
    </div>

    <button type="button" className="btn btn-default" onClick={router.goBack} >
      <span aria-hidden="true">&larr;</span> Back
    </button>
  </form>
);

NewGameForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

NewGameForm = reduxForm({
  form: 'NewGameForm',
})(NewGameForm);

export default connect(null, { onSubmit: newGame })(NewGameForm);
