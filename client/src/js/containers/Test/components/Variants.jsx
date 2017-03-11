import React, { Component, PropTypes } from 'react';
import { IMG_THUMBNAIL } from '../../../config';

function answer(name, activeStep, maxSteps, actions) {
  return () => {
    actions.answerGiven(name);

    if (activeStep === maxSteps) {
      setTimeout(() => actions.openResultsWindow(), 850);
    } else {
      window.__stepTimer = setTimeout(() => actions.goNextStep(), 850);
    }
  };
}

const Variants = {
  Name: ({ steps, activeStep, maxSteps, actions }) => {
    const currentStep = steps[activeStep - 1];

    const charButtons = currentStep.buttons.map((bt) => {
      let color = 'blue';

      if (currentStep.passed) {
        if (bt.name === currentStep.rightAnswer) {
          color = 'green';
        } else if (bt.name === currentStep.givenAnswer && currentStep.givenAnswer !== currentStep.rightAnswer) {
          color = 'red';
        }
      }

      return (
        <button
          type="button"
          key={bt.name}
          disabled={currentStep.passed}
          className={bt.name === currentStep.givenAnswer ? `${color} active` : color}
          onClick={answer(bt.name, activeStep, maxSteps, actions)}
        >
          {bt.name}
        </button>
      );
    });

    return (
      <div className="buttons">
        {charButtons}
      </div>
    );
  },

  Image: class Image extends Component {
    constructor(props) {
      super(props);
      this.state = { active: '' };
    }

    render() {
      const { steps, activeStep, maxSteps, actions } = this.props;
      const currentStep = steps[activeStep - 1];

      const charButtons = currentStep.buttons.map((bt, i) => {
        let color = 'white';

        if (currentStep.passed) {
          if (bt.name === currentStep.rightAnswer) {
            color = 'green';
          } else if (bt.name === currentStep.givenAnswer && currentStep.givenAnswer !== currentStep.rightAnswer) {
            color = 'red';
          }
        }

        return (
          <div
            key={bt.name}
            className={this.state.active === bt.name && !currentStep.passed
              ? `variant-outer active ${color}`
              : `variant-outer ${color}`}
          >
            <button
              type="button"
              disabled={currentStep.passed}
              onClick={answer(bt.name, activeStep, maxSteps, actions)}
              onMouseEnter={() => { this.setState({ active: bt.name }); }}
              onMouseLeave={() => { this.setState({ active: '' }); }}
            >
              <img alt={`variant ${i}`} src={IMG_THUMBNAIL + bt.image} />
            </button>
            <button type="button" className="btn-expand white">
              <i className="fa fa-expand" aria-hidden="true" />
            </button>
          </div>
        );
      });

      return (
        <div className="buttons-img">
          {charButtons}
        </div>
      );
    }
  },
};

const propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeStep: PropTypes.number.isRequired,
  maxSteps: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    answerGiven: PropTypes.func.isRequired,
    openResultsWindow: PropTypes.func.isRequired,
    goNextStep: PropTypes.func.isRequired,
  }).isRequired,
};

Variants.Name.propTypes = propTypes;
Variants.Image.propTypes = propTypes;

export default Variants;
