import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { resetTest } from '../../actions/asyncActions';
import { closeResultsWindow } from '../../actions/mainActions';

class MyModal extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.structure.isOpen !== this.props.structure.isOpen) {
      return true;
    }
    return false;
  }

  render() {
    const { onResetButtonClick, onCloseButtonClick } = this.props;
    const { isOpen, correctAnswers, incorrectAnswers } = this.props.structure;

    if (!isOpen) {
      return null;
    }

    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
    };

    return (
      <Modal isOpen={isOpen} style={customStyles} onRequestClose={onCloseButtonClick} contentLabel="Results" >
        <div className="my-modal">
          <h2>Results:</h2>
          <span className="correct">right answers: {correctAnswers}</span> <br />
          <span className="incorrect">wrong answers: {incorrectAnswers}</span> <br />
          <button className="blue btn-left" onClick={onResetButtonClick}>
            <i className="fa fa-fw fa-lg fa-refresh" aria-hidden="true" /> Reset
          </button>
          <button className="green btn-right" onClick={onCloseButtonClick}>Close</button>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps({ main: { steps, modalIsOpen } }) {
  const structure = {
    isOpen: modalIsOpen,
    correctAnswers: 0,
    incorrectAnswers: 0,
  };

  if (!modalIsOpen) {
    return { structure };
  }

  structure.correctAnswers = steps.filter(step => step.rightAnswer === step.givenAnswer).length;
  structure.incorrectAnswers = steps.filter(step => step.rightAnswer !== step.givenAnswer).length;

  return { structure };
}

function mapDispatchToProps(dispatch) {
  return {
    onResetButtonClick: () => {
      dispatch(resetTest());
    },
    onCloseButtonClick: () => {
      dispatch(closeResultsWindow());
    },
  };
}

MyModal.propTypes = {
  structure: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    correctAnswers: PropTypes.number.isRequired,
    incorrectAnswers: PropTypes.number.isRequired,
  }).isRequired,
  onResetButtonClick: PropTypes.func.isRequired,
  onCloseButtonClick: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyModal);
