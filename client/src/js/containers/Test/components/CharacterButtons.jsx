import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { answerGiven, openResultsWindow, goNextStep } from '../../../actions/testActions';

const CharacterButtons = ({ structure, step, maxSteps, onButtonClick }) => {
  const charButtons = structure.map((button) => {
    const color = (button.active) ? `${button.color} active` : button.color;
    return (
      <button
        type="button"
        key={button.name}
        disabled={button.disabled}
        className={color}
        onClick={e => onButtonClick(e.target.innerText, step, maxSteps)}
      >
        {button.name}
      </button>
    );
  });

  return (
    <div className="buttons">
      {charButtons}
    </div>
  );
};

function mapStateToProps({ domain: { test: { steps, activeStep, maxSteps } } }) {
  const currentStep = steps[activeStep - 1];
  const { rightAnswer, givenAnswer, passed, buttons } = currentStep;

  const structure = buttons.map((name) => {
    const params = {
      name,
      color: 'blue',
      disabled: passed,
      active: (name === givenAnswer),
    };

    if (passed && name === rightAnswer) {
      params.color = 'green';
    } else if (passed && name === givenAnswer && givenAnswer !== rightAnswer) {
      params.color = 'red';
    }

    return params;
  });

  return { structure, step: currentStep.step, maxSteps };
}

function mapDispatchToProps(dispatch) {
  return {
    onButtonClick: (name, step, maxSteps) => {
      dispatch(answerGiven(name));

      if (step === maxSteps) {
        setTimeout(() => dispatch(openResultsWindow()), 850);
      } else {
        window.__stepTimer = setTimeout(() => dispatch(goNextStep()), 850);
      }
    },
  };
}

CharacterButtons.propTypes = {
  structure: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
  })).isRequired,
  step: PropTypes.number.isRequired,
  maxSteps: PropTypes.number.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CharacterButtons);
