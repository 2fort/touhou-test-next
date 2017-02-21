import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Field, reduxForm, formValueSelector, propTypes } from 'redux-form';

import { TextField, ImageField } from '../../_sharedComponents/fields';
import { required } from '../../_sharedComponents/validationFields';
import OrderSelectField from './OrderSelectField';

class CharFormModal extends Component {
  render() {
    const { mode, title, buttonName, allGames, reduxValues, getCharsFromGame, hide,
      handleSubmit, submitting, initialValues, error, reset } = this.props;

    const gameOptions = Object.values(allGames).map(game => (
      <option key={game.title} value={game.id}>{game.title}</option>
    ));

    return (
      <div className="static-modal">
        <Modal show onHide={hide} bsSize="large">
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <form encType="multipart/form-data" className="form-horizontal" onSubmit={handleSubmit}>
            <Modal.Body>
              <Field name="id" type="hidden" component="input" />
              <Field name="name" type="text" component={TextField} label="Name" validate={[required]} />
              <Field
                name="fileImage"
                currentImage={initialValues.image}
                type="file"
                component={ImageField}
                label="Image"
                withRef
                ref={(com) => { this.fileImageField = com; }}
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

              {reduxValues._game &&
                <Field
                  name="_order"
                  component={OrderSelectField}
                  getCharsFromGame={getCharsFromGame}
                  initialValues={initialValues}
                  reduxValues={reduxValues}
                  initial={reduxValues._game === initialValues._game}
                  fileImageField={this.fileImageField}
                  mode={mode}
                />
              }

              <Field name="art.author" type="text" component={TextField} label="Art author" />
              <Field name="art.url" type="text" component={TextField} label="Art url" />
              <Field name="wiki" type="text" component={TextField} label="Wiki" />

              {error &&
                <Alert bsStyle="danger"><strong>Error: </strong>{error}</Alert>
              }
            </Modal.Body>

            <Modal.Footer>
              <Button type="submit" disabled={submitting} bsStyle="primary">
                {submitting && <i className="fa fa-spinner fa-spin" />} {buttonName}
              </Button>
              {initialValues.name && <Button onClick={reset}>Reset</Button>}
              <Button onClick={hide}>Cancel</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

CharFormModal.defaultProps = {
  initialValues: {},
  error: '',
  allGames: {},
};

CharFormModal.propTypes = {
  title: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  allGames: PropTypes.objectOf(PropTypes.object),
  hide: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    _game: PropTypes.string,
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
    wiki: PropTypes.string,
  }),
  reduxValues: PropTypes.shape({
    name: PropTypes.string,
    _game: PropTypes.string,
    fileImage: PropTypes.object,
  }).isRequired,
  ...propTypes,
};

const selector = formValueSelector('CharFormModal');

function mapStateToProps(state) {
  const name = selector(state, 'name');
  const _game = selector(state, '_game');
  const fileImage = selector(state, 'fileImage');
  return {
    reduxValues: {
      name, _game, fileImage,
    },
  };
}

export default connect(mapStateToProps)(
  reduxForm({ form: 'CharFormModal' })(CharFormModal),
);
