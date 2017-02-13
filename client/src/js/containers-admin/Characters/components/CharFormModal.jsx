import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Field, reduxForm, formValueSelector, propTypes } from 'redux-form';

import { textField, imageField } from '../../_sharedComponents/formFields';
import { required } from '../../_sharedComponents/validationFields';

class CharFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = { maxOrder: 0 };
  }

  componentWillMount() {
    this.updateMaxOrder(this.props._gameValue);
  }

  componentWillReceiveProps(newProps) {
    if (this.props._gameValue !== newProps._gameValue) {
      this.updateMaxOrder(newProps._gameValue);
    }
  }

  updateMaxOrder = (gameId) => {
    this.props.getMaxOrder(gameId)
      .then((char) => {
        if (char[0]) {
          const maxOrder = this.props.mode === 'new' ? char[0]._order + 1 : char[0]._order;
          this.setState({ maxOrder });
        } else {
          this.setState({ maxOrder: 1 });
        }
      });
  }

  render() {
    const { title, buttonName, mode, allGames, _gameValue, hide,
      handleSubmit, submitting, initialValues, error, reset } = this.props;

    const gameOptions = allGames.map(game => (
      <option key={game.title} value={game.id}>{game.title}</option>
    ));

    const orderSelect = [];

    if (mode === 'edit') {
      for (let i = 1; i <= this.state.maxOrder; i++) {
        orderSelect.push(<option key={i} value={i}>{i}</option>);
      }
      if (initialValues._game !== _gameValue) {
        orderSelect.push(
          <option key={this.state.maxOrder + 1} value={this.state.maxOrder + 1}>{this.state.maxOrder + 1}</option>
        );
      }
    } else {
      for (let i = this.state.maxOrder; i > 0; i--) {
        orderSelect.push(<option key={i} value={i}>{i}</option>);
      }
    }

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
                name="fileImage"
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

              {_gameValue && _gameValue !== '[!uncategorized]' &&
                <div className="form-group">
                  <label htmlFor="_order" className="col-sm-2 control-label">Order</label>
                  <div className="col-sm-10">
                    <Field name="_order" component="select" className="form-control">
                      {orderSelect}
                    </Field>
                  </div>
                </div>
              }

              <Field name="art.author" type="text" component={textField} label="Art author" />
              <Field name="art.url" type="text" component={textField} label="Art url" />
              <Field name="wiki" type="text" component={textField} label="Wiki" />

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
  _gameValue: '',
};

CharFormModal.propTypes = {
  title: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  allGames: PropTypes.arrayOf(PropTypes.object),
  _gameValue: PropTypes.string,
  hide: PropTypes.func.isRequired,
  getMaxOrder: PropTypes.func.isRequired,
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
  ...propTypes,
};

const selector = formValueSelector('CharFormModal');

function mapStateToProps(state) {
  const _gameValue = selector(state, '_game');
  return { _gameValue };
}

export default connect(mapStateToProps)(
  reduxForm({ form: 'CharFormModal' })(CharFormModal),
);
