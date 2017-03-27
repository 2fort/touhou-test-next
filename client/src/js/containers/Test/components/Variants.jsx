import React, { Component, PropTypes } from 'react';
import { classes, style } from 'typestyle';
import FullImg from './FullImg';
import * as css from './Variants.style';

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

function decideColor(currentStep, bt) {
  if (currentStep.passed) {
    if (bt.name === currentStep.rightAnswer) {
      return process.colors.green;
    } else if (bt.name === currentStep.givenAnswer && currentStep.givenAnswer !== currentStep.rightAnswer) {
      return process.colors.red;
    }
  }
  return undefined;
}

const Variants = {
  Name: ({ steps, activeStep, maxSteps, actions }) => {
    const currentStep = steps[activeStep - 1];

    const charButtons = currentStep.buttons.map((bt) => {
      const bgColor = decideColor(currentStep, bt);
      return (
        <button
          type="button"
          key={bt.name}
          disabled={currentStep.passed}
          className={css.btn(bgColor, bt.name === currentStep.givenAnswer)}
          onClick={answer(bt.name, activeStep, maxSteps, actions)}
        >
          {bt.name}
        </button>
      );
    });

    return (
      <div className={css.buttons}>
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
        const bgColor = decideColor(currentStep, bt);
        const active = this.state.active === bt.name && !currentStep.passed;
        return (
          <div
            key={bt.name}
            className={classes(css.variantOuter,
              bgColor && style({ backgroundColor: bgColor }),
              active && css.variantOuterActive)
            }
          >
            <button
              type="button"
              className={css.imgButton}
              disabled={currentStep.passed}
              onClick={answer(bt.name, activeStep, maxSteps, actions)}
              onMouseEnter={() => { this.setState({ active: bt.name }); }}
              onMouseLeave={() => { this.setState({ active: '' }); }}
            >
              <img className={css.transparentImg} alt={`variant ${i + 1}`} src={process.env.IMG_THUMBNAIL + bt.image} />
            </button>
            <FullImg image={bt.image} />
          </div>
        );
      });

      return (
        <div className={css.btnImg}>
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
