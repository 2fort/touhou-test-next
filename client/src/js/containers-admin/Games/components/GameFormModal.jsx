import React, { Component, PropTypes } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Field, reduxForm, propTypes } from 'redux-form';

import { TextField, ImageField } from '../../_sharedComponents/fields';
import { required, number, maxValue, moreThan0 } from '../../_sharedComponents/validationFields';

class GameFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = { maxOrder: 0 };
  }

  componentWillMount() {
    this.props.getMaxOrder()
      .then((game) => {
        if (game[0]) {
          const maxOrder = this.props.mode === 'new' ? game[0].order + 1 : game[0].order;
          this.setState({ maxOrder });
        } else {
          this.setState({ maxOrder: 1 });
        }
      });
  }

  render() {
    const { title, buttonName, hide, initialValues, handleSubmit, submitting, error, reset, mode } = this.props;

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
                name="fileCover"
                currentImage={initialValues.cover}
                type="file"
                component={ImageField}
                label="Cover"
              />
              <Field name="year" type="text" component={TextField} label="Year" validate={[number]} />
              <Field
                name="order"
                type="number"
                component={TextField}
                label="Order"
                validate={
                  mode === 'new'
                    ? [number, maxValue(this.state.maxOrder), moreThan0]
                    : [required, number, maxValue(this.state.maxOrder), moreThan0]
                }
              />

              {error &&
                <Alert bsStyle="danger"><strong>Error: </strong>{error}</Alert>
              }
            </Modal.Body>

            <Modal.Footer>
              <Button type="submit" disabled={submitting} bsStyle="primary">
                {submitting && <i className="fa fa-spinner fa-spin" />} {buttonName}
              </Button>
              {initialValues.title && <Button onClick={reset}>Reset</Button>}
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
  mode: PropTypes.string.isRequired,
  getMaxOrder: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    prefix: PropTypes.string,
    title: PropTypes.string,
    cover: PropTypes.string,
    year: PropTypes.number,
  }),
  ...propTypes,
};

export default reduxForm({
  form: 'GameFormModal',
})(GameFormModal);
