import React, { PropTypes } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';

import { textField, imageField } from '../../_sharedComponents/formFields';
import { required, number } from '../../_sharedComponents/validationFields';

const GameFormModal = ({ title, buttonName, hide, handleSubmit, submitting, initialValues, error }) => (
  <div className="static-modal">
    <Modal show onHide={hide}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <form encType="multipart/form-data" className="form-horizontal" onSubmit={handleSubmit}>
        <Modal.Body>
          <Field name="id" type="hidden" component="input" />
          <Field name="prefix" type="text" component={textField} label="Prefix" />
          <Field name="title" type="text" component={textField} label="Title" validate={[required]} />
          <Field
            name="cover"
            currentImage={initialValues && initialValues.cover}
            type="file"
            component={imageField}
            label="Cover"
          />
          <Field name="year" type="text" component={textField} label="Year" validate={[number]} />

          {error &&
            <Alert bsStyle="danger"><strong>Error: </strong>{error}</Alert>
          }
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={hide}>Cancel</Button>
          <Button type="submit" disabled={submitting} bsStyle="primary">
            {submitting && <i className="fa fa-spinner fa-spin" />} {buttonName}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  </div>
);

GameFormModal.defaultProps = {
  initialValues: {},
  error: '',
};

GameFormModal.propTypes = {
  title: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  hide: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    prefix: PropTypes.string,
    title: PropTypes.string,
    cover: PropTypes.string,
    year: PropTypes.number,
  }),
  error: PropTypes.string,
};

export default reduxForm({
  form: 'GameFormModal',
})(GameFormModal);
