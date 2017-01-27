import React, { Component, PropTypes } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';

import { textField, imageField } from '../../_sharedComponents/formFields';
import { required, number } from '../../_sharedComponents/validationFields';
import { IMG_THUMBNAIL } from '../../../config';

class GameFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = { imgPreview: '' };
  }

  componentWillMount() {
    this.addImgPreviewFromInitState();
  }

  addImgPreviewFromInitState = () => {
    if (this.props.initialValues.cover) {
      this.setState({ imgPreview: IMG_THUMBNAIL + this.props.initialValues.cover });
    }
  }

  fullReset = () => {
    this.revokeImgPreview();
    this.addImgPreviewFromInitState();
    this.props.reset();
  }

  removeImgPreview = () => {
    this.revokeImgPreview();
    this.setState({ imgPreview: '' });
  }

  addImgPreview = (file) => {
    this.revokeImgPreview();
    this.setState({ imgPreview: window.URL.createObjectURL(file) });
  }

  revokeImgPreview = () => {
    const { imgPreview } = this.state;
    if (imgPreview && imgPreview.substring(0, 4) === 'blob') {
      window.URL.revokeObjectURL(this.state.imgPreview);
    }
  }

  render() {
    const { title, buttonName, hide, initialValues, handleSubmit, submitting, error } = this.props;

    return (
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
                name="fileCover"
                currentImage={this.state.imgPreview}
                type="file"
                component={imageField}
                label="Cover"
                addImgPreview={this.addImgPreview}
                removeImgPreview={this.removeImgPreview}
              />
              <Field name="year" type="text" component={textField} label="Year" validate={[number]} />

              {error &&
                <Alert bsStyle="danger"><strong>Error: </strong>{error}</Alert>
              }
            </Modal.Body>

            <Modal.Footer>
              <Button type="submit" disabled={submitting} bsStyle="primary">
                {submitting && <i className="fa fa-spinner fa-spin" />} {buttonName}
              </Button>
              {initialValues.title && <Button onClick={this.fullReset}>Reset</Button>}
              <Button onClick={hide}>Cancel</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

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
  reset: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'GameFormModal',
})(GameFormModal);
