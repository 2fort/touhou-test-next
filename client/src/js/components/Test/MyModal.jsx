import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';

export default class MyModal extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.open !== this.props.open) {
      return true;
    }
    return false;
  }
  render() {
    const { open, steps, actions } = this.props;

    if (open === false) {
      return false;
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

    let correctAnswers = steps.filter(step => step.rightAnswer === step.givenAnswer).length;
    let incorrectAnswers = steps.filter(step => step.rightAnswer !== step.givenAnswer).length;

    return (
      <Modal isOpen={open} style={customStyles} onRequestClose={actions.closeResultsWindow} >
        <div className="my-modal">
          <h2>Results:</h2>
          <span className="correct">right answers: {correctAnswers}</span> <br />
          <span className="incorrect">wrong answers: {incorrectAnswers}</span> <br />
          <button className="blue btn-left" onClick={actions.resetTest}>
            <i className="fa fa-fw fa-lg fa-refresh" aria-hidden="true" /> Reset
                    </button>
          <button className="green btn-right" onClick={actions.closeResultsWindow}>Close</button>
        </div>
      </Modal>
    );
  }
}

MyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.object.isRequired,
};
