import { connect } from 'react-redux';
import Button from './Button';
import { goNextStep } from '../../../../actions/testActions';

function mapStateToProps({ test: { steps, activeStep, passedSteps, maxSteps } }) {
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

export default connect(mapStateToProps, mapDispatchToProps)(Button);
