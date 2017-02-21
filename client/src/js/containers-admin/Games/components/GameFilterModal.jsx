import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Field, reduxForm, propTypes } from 'redux-form';

import { TextField } from '../../_sharedComponents/fields';
import { number } from '../../_sharedComponents/validationFields';

const GameFilterModal = ({ handleSubmit, hide }) => (
  <div className="static-modal">
    <Modal show onHide={hide}>
      <Modal.Header>
        <Modal.Title>Filters</Modal.Title>
      </Modal.Header>

      <form className="form-horizontal" onSubmit={handleSubmit}>
        <Modal.Body>
          <Field name="title" type="text" component={TextField} label="Title" />
          <Field name="year" type="text" component={TextField} label="Year" validate={[number]} />
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" bsStyle="primary">OK</Button>
          <Button onClick={hide}>Cancel</Button>
        </Modal.Footer>
      </form>
    </Modal>
  </div>
);

GameFilterModal.propTypes = {
  hide: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  ...propTypes,
};

export default reduxForm({
  form: 'GameFilterModal',
})(GameFilterModal);
