import React, { Component, PropTypes } from 'react';
import { classes } from 'typestyle';
import FullImg from './FullImg';
import * as style from './Variants.style';

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
      let color = style.blue;

      if (currentStep.passed) {
        if (bt.name === currentStep.rightAnswer) {
          color = style.green;
        } else if (bt.name === currentStep.givenAnswer && currentStep.givenAnswer !== currentStep.rightAnswer) {
          color = style.red;
        }
      }

      return (
        <button
          type="button"
          key={bt.name}
          disabled={currentStep.passed}
          className={bt.name === currentStep.givenAnswer
            ? classes(style.btn, style.btnActive, color)
            : classes(style.btn, color)
          }
          onClick={answer(bt.name, activeStep, maxSteps, actions)}
        >
          {bt.name}
        </button>
      );
    });

    return (
      <div className={style.buttons}>
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
        let color = style.whiteColor;

        if (currentStep.passed) {
          if (bt.name === currentStep.rightAnswer) {
            color = style.green;
          } else if (bt.name === currentStep.givenAnswer && currentStep.givenAnswer !== currentStep.rightAnswer) {
            color = style.red;
          }
        }

        return (
          <div
            key={bt.name}
            className={this.state.active === bt.name && !currentStep.passed
              ? classes(style.variantOuter, style.variantOuterActive, color)
              : classes(style.variantOuter, color)
            }
          >
            <button
              type="button"
              disabled={currentStep.passed}
              onClick={answer(bt.name, activeStep, maxSteps, actions)}
              onMouseEnter={() => { this.setState({ active: bt.name }); }}
              onMouseLeave={() => { this.setState({ active: '' }); }}
            >
              <img alt={`variant ${i}`} src={process.env.IMG_THUMBNAIL + bt.image} />
            </button>
            <FullImg image={bt.image} />
          </div>
        );
      });

      return (
        <div className={style.btnImg}>
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
