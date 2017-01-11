import { connect } from 'react-redux';
import NavButton from '../../../shared/NavButton';
import { goPrevStep, goNextStep } from '../../../actions/testActions';

const PrevButton = (() => {
  function mapStateToProps({ domain: { test: { steps, activeStep } } }) {
    const structure = { color: '', disabled: false };

    if (activeStep === 1) {
      structure.disabled = true;
    } else {
      const prevStep = steps[activeStep - 2];
      structure.color = (prevStep.givenAnswer === prevStep.rightAnswer) ? 'txt-green' : 'txt-red';
    }

    return { structure };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onButtonClick: () => {
        dispatch(goPrevStep());
      },
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(NavButton);
})();

const NextButton = (() => {
  function mapStateToProps({ domain: { test: { steps, activeStep, passedSteps, maxSteps } } }) {
    const structure = { color: '', disabled: false };

    if (activeStep === maxSteps || activeStep === passedSteps + 1) {
      structure.disabled = true;
      return { structure };
    }

    const nextStep = steps[activeStep];

    if (nextStep.givenAnswer) {
      structure.color = (nextStep.givenAnswer === nextStep.rightAnswer) ? 'txt-green' : 'txt-red';
    } else {
      structure.color = 'txt-blue';
    }

    return { structure };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onButtonClick: () => {
        dispatch(goNextStep());
      },
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(NavButton);
})();

export { PrevButton, NextButton };