import React, { PropTypes } from 'react';

const CharacterButtons = ({ steps, activeStep, maxSteps, actions }) => {
  const currentStep = steps[activeStep - 1];

  const charButtons = currentStep.buttons.map((name) => {
    let color = 'blue';

    if (currentStep.passed) {
      if (name === currentStep.rightAnswer) {
        color = 'green';
      } else if (name === currentStep.givenAnswer && currentStep.givenAnswer !== currentStep.rightAnswer) {
        color = 'red';
      }
    }

    return (
      <button
        type="button"
        key={name}
        disabled={currentStep.passed}
        className={name === currentStep.givenAnswer ? `${color} active` : color}
        onClick={(e) => {
          actions.answerGiven(e.target.innerText);

          if (activeStep === maxSteps) {
            setTimeout(() => actions.openResultsWindow(), 850);
          } else {
            window.__stepTimer = setTimeout(() => actions.goNextStep(), 850);
          }
        }}
      >
        {name}
      </button>
    );
  });

  return (
    <div className="buttons">
      {charButtons}
    </div>
  );
};

CharacterButtons.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeStep: PropTypes.number.isRequired,
  maxSteps: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    answerGiven: PropTypes.func.isRequired,
    openResultsWindow: PropTypes.func.isRequired,
    goNextStep: PropTypes.func.isRequired,
  }).isRequired,
};

export default CharacterButtons;
