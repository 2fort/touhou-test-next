import React, { PropTypes } from 'react';

const NavButtons = {
  Prev: ({ steps, activeStep, goPrevStep }) => {
    const prevStep = steps[activeStep - 2];
    const disabled = activeStep === 1;

    const color = (function decideColor() {
      if (disabled) return '';
      if (prevStep.givenAnswer === prevStep.rightAnswer) return 'txt-green';
      return 'txt-red';
    }());

    return (
      <div className="navigation">
        <button type="button" disabled={disabled} className={color} onClick={goPrevStep}>
          &nbsp;&lt;&nbsp;
        </button>
      </div>
    );
  },

  Next: ({ steps, activeStep, passedSteps, maxSteps, goNextStep }) => {
    const nextStep = steps[activeStep];
    const disabled = activeStep === maxSteps || activeStep === passedSteps + 1;

    const color = (function decideColor() {
      if (disabled) return '';
      if (!nextStep.givenAnswer) return 'txt-blue';
      if (nextStep.givenAnswer === nextStep.rightAnswer) return 'txt-green';
      return 'txt-red';
    }());

    return (
      <div className="navigation">
        <button type="button" disabled={disabled} className={color} onClick={goNextStep}>
          &nbsp;&gt;&nbsp;
        </button>
      </div>
    );
  },
};

NavButtons.Prev.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeStep: PropTypes.number.isRequired,
  goPrevStep: PropTypes.func.isRequired,
};

NavButtons.Next.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeStep: PropTypes.number.isRequired,
  passedSteps: PropTypes.number.isRequired,
  maxSteps: PropTypes.number.isRequired,
  goNextStep: PropTypes.func.isRequired,
};

export default NavButtons;
