import React, { PropTypes } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';

import { textField, imageField } from '../../_sharedComponents/formFields';
import { required, number } from '../../_sharedComponents/validationFields';

const CharFormModal = ({ title, buttonName, gamesData, hide, handleSubmit, submitting, initialValues, error }) => {
  const gameOptions = gamesData.map(game => (
    <option key={game.title} value={game.id}>{game.title}</option>
  ));
  return (
    <div className="static-modal">
      <Modal show onHide={hide}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <form encType="multipart/form-data" className="form-horizontal" onSubmit={handleSubmit}>
          <Modal.Body>
            <Field name="id" type="hidden" component="input" />
            <Field name="name" type="text" component={textField} label="Name" validate={[required]} />
            <Field
              name="image"
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
};

CharFormModal.defaultProps = {
  initialValues: {},
  error: '',
};

CharFormModal.propTypes = {
  title: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  hide: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    _game: PropTypes.string,
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
    wiki: PropTypes.number,
  }),
  error: PropTypes.string,
};

export default reduxForm({
  form: 'CharFormModal',
})(CharFormModal);
