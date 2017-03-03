import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button } from 'react-bootstrap';
import { isSubmitting } from 'redux-form';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './GameFormModal.duck';
import GameForm from './forms/GameForm';
import Loading from '../../containers/Base/components/Loading';

class GameFormModal extends Component {
  componentDidMount() {
    const { actions, mode, gameId } = this.props;

    if (mode === 'new') {
      actions.getMaxOrder()
        .then(() => { actions.markReady(); });
    } else {
      Promise.all([
        actions.getMaxOrder(),
        actions.fetchSingleGame(gameId),
      ])
      .then(() => { actions.markReady(); });
    }
  }

  newGameModalSubmit = (values) => {
    this.props.actions.newGame(values)
      .then(() => {
        this.props.cb();
        this.props.actions.modalClose();
      });
  }

  editGameModalSubmit = (values) => {
    this.props.actions.editGame(values)
      .then(() => {
        this.props.cb();
        this.props.actions.modalClose();
      });
  }

  render() {
    const { actions, mode, maxOrder, game, ready, submitting } = this.props;

    const title = mode === 'new' ? 'New Game' : 'Edit Game';
    const buttonName = mode === 'new' ? 'Create' : 'Edit';

    const formProps = mode === 'new'
      ? { onSubmit: this.newGameModalSubmit, maxOrder: maxOrder + 1, initialValues: { order: maxOrder + 1 } }
      : { onSubmit: this.editGameModalSubmit, maxOrder, initialValues: game };

    return (
      <div className="static-modal">
        <Modal show onHide={actions.modalClose}>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {ready
              ?
                <GameForm
                  onSubmit={formProps.onSubmit}
                  maxOrder={formProps.maxOrder}
                  initialValues={formProps.initialValues}
                />
              : <Loading />
            }
          </Modal.Body>

          <Modal.Footer>
            <Button disabled={submitting} bsStyle="primary" onClick={actions.submitForm}>
              {submitting && <i className="fa fa-spinner fa-spin" />} {buttonName}
            </Button>
            {mode === 'edit' && <Button onClick={actions.resetForm}>Reset</Button>}
            <Button onClick={actions.modalClose}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { domain: { gameFormModal } } = state;
  return { ...gameFormModal, submitting: isSubmitting('GameForm')(state) };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ownActions, dispatch) };
}

GameFormModal.propTypes = {
  ready: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  gameId: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
  maxOrder: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    setMode: PropTypes.func.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    setGame: PropTypes.func.isRequired,
    fetchSingleGame: PropTypes.func.isRequired,
    getMaxOrder: PropTypes.func.isRequired,
    markReady: PropTypes.func.isRequired,
    newGame: PropTypes.func.isRequired,
    editGame: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
  }).isRequired,
  cb: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  domainHoc({ name: 'GameFormModal' })(GameFormModal),
);
