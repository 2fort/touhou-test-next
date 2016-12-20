import React, { Component, PropTypes } from 'react';

export default class CharacterButtons extends Component {
  handleAnswer(answerChar) {
    const { actions, currentStep, maxSteps } = this.props;

    currentStep.passed = true;
    currentStep.givenAnswer = answerChar;

    actions.answerGiven(currentStep);
    actions.setStep(currentStep.step);

    setTimeout(() => {
      if (currentStep.step === maxSteps) {
        actions.openResultsWindow();
      } else {
        actions.goNextStep();
      }
    }, 850);
  }

  render() {
    const { rightAnswer, givenAnswer, passed, buttons } = this.props.currentStep;

    let charButtons = buttons.map((name, i) => {
      let color = 'blue';

      if (name === rightAnswer && givenAnswer !== '') {
        color = 'green';
      } else if (name === givenAnswer && givenAnswer !== rightAnswer) {
        color = 'red';
      }

      color += (givenAnswer !== '') ? ' disabled' : '';
      color += (name === givenAnswer) ? ' active' : '';

      return (
        <button
          type="button"
          key={i}
          className={color}
          onClick={(e) => {
            if (!passed) {
              e.preventDefault();
              this.handleAnswer(e.target.innerText);
            }
          }}
        >
          {name}
        </button>
      );
    });

    return (<div className="buttons">{charButtons}</div>);
  }
}

CharacterButtons.propTypes = {
  currentStep: PropTypes.shape({
    step: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    passed: PropTypes.bool.isRequired,
    buttons: PropTypes.arrayOf(PropTypes.string).isRequired,
    rightAnswer: PropTypes.string.isRequired,
    givenAnswer: PropTypes.string.isRequired,
  }).isRequired,
  actions: PropTypes.object.isRequired,
  maxSteps: PropTypes.number.isRequired,
};
