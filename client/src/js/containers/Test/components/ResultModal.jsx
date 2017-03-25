import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { style } from 'typestyle';

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
        <h2 className={style({ marginTop: 0 })}>Results:</h2>
        <i className="fa fa-check" aria-hidden="true" /> right answers: {correctAnswers} <br />
        <i className="fa fa-times" aria-hidden="true" /> wrong answers: {incorrectAnswers} <br />
        <br />
        <button className="pure-button" onClick={this.onResetButtonClick}>
          <i className="fa fa-fw fa-lg fa-refresh" aria-hidden="true" /> Reset
        </button>{' '}
        <button className="pure-button" onClick={this.onCloseButtonClick}>Close</button>
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
