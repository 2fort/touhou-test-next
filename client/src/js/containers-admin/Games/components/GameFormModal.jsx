import React, { Component, PropTypes } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Field, reduxForm, propTypes } from 'redux-form';

import { TextField, ImageField } from '../../_sharedComponents/fields';
import { required, number, maxValue, moreThan0 } from '../../_sharedComponents/validationFields';
import FilePreviewHoc from '../../_sharedComponents/FilePreviewHoc';

class GameFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxOrder: 0,
      fetchedAt: 0,
    };
  }

  componentDidMount() {
    this.props.getMaxOrder()
      .then(({ maxOrder }) => {
        if (this.props.mode === 'new') {
          this.props.change('order', maxOrder + 1);
          this.setState({ maxOrder, fetchedAt: Date.now() });
        } else {
          this.setState({ maxOrder, fetchedAt: Date.now() });
        }
      });
  }

  render() {
    const { title, buttonName, hide, handleSubmit, submitting, error, reset, mode, filePreview } = this.props;

    return (
      <div className="static-modal">
        <Modal show onHide={hide}>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <form encType="multipart/form-data" className="form-horizontal" onSubmit={handleSubmit}>
            <Modal.Body>
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

              {this.state.fetchedAt &&
                <Field
                  name="order"
                  type="number"
                  component={TextField}
                  label="Order"
                  validate={[required, number, maxValue(this.state.maxOrder), moreThan0]}
                />
              }

              {error &&
                <Alert bsStyle="danger"><strong>Error: </strong>{error}</Alert>
              }
            </Modal.Body>

            <Modal.Footer>
              <Button type="submit" disabled={submitting} bsStyle="primary">
                {submitting && <i className="fa fa-spinner fa-spin" />} {buttonName}
              </Button>
              {mode === 'edit' && <Button onClick={reset}>Reset</Button>}
              <Button onClick={hide}>Cancel</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

GameFormModal.defaultProps = {
  error: '',
};

GameFormModal.propTypes = {
  title: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  hide: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  getMaxOrder: PropTypes.func.isRequired,
  filePreview: PropTypes.shape({
    add: PropTypes.func.isRequired,
    revoke: PropTypes.func.isRequired,
    blob: PropTypes.string.isRequired,
  }).isRequired,
  ...propTypes,
};

export default reduxForm({ form: 'GameFormModal' })(
  FilePreviewHoc(GameFormModal),
);
