import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { answerGiven } from '../../../actions/testActions';

const CharacterButtons = ({ structure, onButtonClick }) => {
  const charButtons = structure.map((button, i) => {
    let color = button.color;

    color += (button.disabled) ? ' disabled' : '';
    color += (button.active) ? ' active' : '';

    return (
      <button
        type="button"
        key={i}
        className={color}
        onClick={(e) => {
          if (!button.disabled) {
            onButtonClick(e.target.innerText);
          }
        }}
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

function mapStateToProps({ test }) {
  const currentStep = test.steps[test.activeStep - 1];
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

  return { structure };
}

function mapDispatchToProps(dispatch) {
  return {
    onButtonClick: (name) => {
      dispatch(answerGiven(name));
    },
  };
}

CharacterButtons.propTypes = {
  structure: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    color: PropTypes.string,
    passed: PropTypes.bool,
    active: PropTypes.bool,
  })).isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CharacterButtons);
