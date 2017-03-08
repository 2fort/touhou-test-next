import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { isSubmitting } from 'redux-form';
import { bindActionCreators } from 'redux';

import * as ownActions from './CharFormModal.duck';
import { domainHoc } from '../../../ducks/domain';
import CharForm from '../forms/CharForm';
import Loading from '../../../containers/Base/components/Loading';

class CharFormModal extends Component {
  componentDidMount() {
    if (this.props.mode === 'new') {
      this.newModeInit();
    } else {
      this.editModeInit();
    }
  }

  newModeInit = () => {
    const { queryRel, actions } = this.props;

    if (!queryRel) {
      actions.fetchAllGames()
        .then(() => {
          actions.markReady();
        });
      return;
    }

    Promise.all([
      actions.fetchAllGames(),
      actions.getCharsFromGame(queryRel),
    ])
      .then(([, chars]) => {
        actions.setInitialOrder(chars.length + 1);
        actions.markReady();
      });
  }

  editModeInit = () => {
    const { actions, editCharId } = this.props;

    Promise.all([
      actions.fetchAllGames(),
      actions.fetchSingleCharacter(editCharId),
    ])
      .then(([, char]) => {
        if (char.link && char.link.rel) {
          actions.getCharsFromGame(char.link.rel)
            .then(() => {
              actions.markReady();
            });
        } else {
          actions.markReady();
        }
      });
  }

  newCharModalSubmit = values =>
    this.props.actions.newCharacter(values)
      .then(() => {
        this.props.cb();
        this.props.actions.closeModal();
      });

  editCharModalSubmit = values =>
    this.props.actions.editCharacter(values)
      .then(() => {
        this.props.cb();
        this.props.actions.closeModal();
      });

  render() {
    const { activeRequests, mode, actions, ready, editCharData, submitting, charsFromSelectedGame, allGames,
      initialOrder, queryRel } = this.props;

    const title = mode === 'new' ? 'New Character' : 'Edit Character';
    const buttonName = mode === 'new' ? 'Create' : 'Edit';

    const formProps = mode === 'new'
      ? {
        onSubmit: this.newCharModalSubmit,
        initialValues: queryRel ? { link: { rel: queryRel, order: initialOrder } } : {},
      }
      : {
        onSubmit: this.editCharModalSubmit,
        initialValues: editCharData,
      };

    const pending = activeRequests > 0;

    return (
      <div className="static-modal">
        <Modal show onHide={actions.closeModal} bsSize="large">
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {ready
              ? <CharForm
                allGames={allGames}
                charsList={charsFromSelectedGame}
                actions={{ getCharsFromGame: actions.getCharsFromGame, cleanCharsFromGame: actions.cleanCharsFromGame }}
                mode={mode}
                pending={pending}
                {...formProps}
              />
              : <Loading />
            }
          </Modal.Body>

          <Modal.Footer>
            <Button disabled={submitting || pending} bsStyle="primary" onClick={actions.submitForm}>
              {(submitting || pending) && <i className="fa fa-spinner fa-spin" />} {buttonName}
            </Button>
            {mode === 'edit' && <Button onClick={actions.resetForm}>Reset</Button>}
            <Button onClick={actions.closeModal}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

CharFormModal.propTypes = {
  activeRequests: PropTypes.number.isRequired,
  allGames: PropTypes.arrayOf(PropTypes.object).isRequired,
  queryRel: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  editCharId: PropTypes.string.isRequired,
  editCharData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    link: PropTypes.shape({
      rel: PropTypes.string,
      order: PropTypes.number,
    }),
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
    wiki: PropTypes.string,
  }).isRequired,
  charsFromSelectedGame: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialOrder: PropTypes.number.isRequired,
  ready: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    setMode: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    setCharId: PropTypes.func.isRequired,
    setInitialOrder: PropTypes.func.isRequired,
    markReady: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    fetchSingleCharacter: PropTypes.func.isRequired,
    getCharsFromGame: PropTypes.func.isRequired,
    cleanCharsFromGame: PropTypes.func.isRequired,
    fetchAllGames: PropTypes.func.isRequired,
    newCharacter: PropTypes.func.isRequired,
    editCharacter: PropTypes.func.isRequired,
  }).isRequired,
  cb: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { domain: { charFormModal } } = state;
  return { ...charFormModal, submitting: isSubmitting('CharForm')(state) };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ownActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  domainHoc({ name: 'CharFormModal' })(CharFormModal),
);
