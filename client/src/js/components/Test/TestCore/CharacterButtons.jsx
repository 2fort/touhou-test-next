import React, { PropTypes } from 'react';
import { IStep } from '../../../propTypes';

const CharacterButtons = ({ currentStep, actions }) => {
  const { rightAnswer, givenAnswer, passed, buttons } = currentStep;

  const charButtons = buttons.map((name, i) => {
    let color = 'blue';

    if (passed && name === rightAnswer) {
      color = 'green';
    } else if (passed && name === givenAnswer && givenAnswer !== rightAnswer) {
      color = 'red';
    }

    color += (passed) ? ' disabled' : '';
    color += (name === givenAnswer) ? ' active' : '';

    return (
      <button
        type="button"
        key={i}
        className={color}
        onClick={(e) => {
          if (!passed) {
            actions.answerGiven(e.target.innerText);
          }
        }}
      >
        {name}
      </button>
    );
  });

  return (<div className="buttons">{charButtons}</div>);
};

CharacterButtons.propTypes = {
  currentStep: PropTypes.shape(IStep).isRequired,
  actions: PropTypes.shape({
    answerGiven: PropTypes.func.isRequired,
  }).isRequired,
};

export default CharacterButtons;
