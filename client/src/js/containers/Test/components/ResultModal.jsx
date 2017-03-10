import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';

class TestResultModal extends Component {
  onResetButtonClick = () => {
    this.props.actions.resetTest();
    this.props.actions.closeResultsWindow();
  }

  onCloseButtonClick = () => {
    this.props.actions.closeResultsWindow();
  }

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    const { isOpen, steps } = this.props;
    const correctAnswers = steps.filter(step => step.rightAnswer === step.givenAnswer).length;
    const incorrectAnswers = steps.filter(step => step.rightAnswer !== step.givenAnswer).length;

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
      <Modal isOpen={isOpen} style={customStyles} onRequestClose={this.onCloseButtonClick} contentLabel="Results" >
        <div className="my-modal">
          <h2>Results:</h2>
          <span className="correct">right answers: {correctAnswers}</span> <br />
          <span className="incorrect">wrong answers: {incorrectAnswers}</span> <br />
          <button className="blue btn-left" onClick={this.onResetButtonClick}>
            <i className="fa fa-fw fa-lg fa-refresh" aria-hidden="true" /> Reset
          </button>
          <button className="green btn-right" onClick={this.onCloseButtonClick}>Close</button>
        </div>
      </Modal>
    );
  }
}

TestResultModal.propTypes = {
  actions: PropTypes.shape({
    resetTest: PropTypes.func.isRequired,
    closeResultsWindow: PropTypes.func.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TestResultModal;
