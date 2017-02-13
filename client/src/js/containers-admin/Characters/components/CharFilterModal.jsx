import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Field, reduxForm, propTypes } from 'redux-form';

import { textField } from '../../_sharedComponents/formFields';

const CharFilterModal = ({ handleSubmit, hide }) => (
  <div className="static-modal">
    <Modal show onHide={hide}>
      <Modal.Header>
        <Modal.Title>Filters</Modal.Title>
      </Modal.Header>

      <form className="form-horizontal" onSubmit={handleSubmit}>
        <Modal.Body>
          <Field name="name" type="text" component={textField} label="Name" />
          <Field name="art.author" type="text" component={textField} label="Art Author" />
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" bsStyle="primary">OK</Button>
          <Button onClick={hide}>Cancel</Button>
        </Modal.Footer>
      </form>
    </Modal>
  </div>
);

CharFilterModal.propTypes = {
  hide: PropTypes.func.isRequired,
  ...propTypes,
};

export default reduxForm({
  form: 'CharFilterModal',
})(CharFilterModal);
