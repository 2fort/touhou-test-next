import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';
import { Field, reduxForm, propTypes } from 'redux-form';

import { TextField, ImageField } from '../../_sharedComponents/fields';
import { required, number, maxValue, moreThan0 } from '../../_sharedComponents/validationFields';
import FilePreviewHoc from '../../_sharedComponents/FilePreviewHoc';

const rangeOrder = num =>
  (value, previousValue) => (parseFloat(value) > 0 && parseFloat(value) <= num ? value : previousValue);

const GameForm = ({ maxOrder, filePreview, error, handleSubmit }) => (
  <form encType="multipart/form-data" className="form-horizontal" onSubmit={handleSubmit}>
    <Field name="id" type="hidden" component="input" />
    <Field name="prefix" type="text" component={TextField} label="Prefix" />
    <Field name="title" type="text" component={TextField} label="Title" validate={[required]} />
    <Field
      name="cover"
      type="file"
      component={ImageField}
      label="Cover"
      filePreview={filePreview}
    />
    <Field name="year" type="text" component={TextField} label="Year" validate={[number]} />

    <Field
      name="order"
      type="number"
      component={TextField}
      label="Order"
      normalize={rangeOrder(maxOrder)}
      validate={[required, number, maxValue(maxOrder), moreThan0]}
    />

    {error &&
      <Alert bsStyle="danger"><strong>Error: </strong>{error}</Alert>
    }
  </form>
);

GameForm.propTypes = {
  maxOrder: PropTypes.number.isRequired,
  filePreview: PropTypes.shape({
    add: PropTypes.func.isRequired,
    revoke: PropTypes.func.isRequired,
    blob: PropTypes.string.isRequired,
  }).isRequired,
  ...propTypes,
};

export default reduxForm({ form: 'GameForm' })(
  FilePreviewHoc(GameForm),
);
