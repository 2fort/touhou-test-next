import { connect } from 'react-redux';
import Button from './Button';
import { goPrevStep } from '../../../../actions/mainActions';

function mapStateToProps({ main: { steps, activeStep } }) {
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

export default connect(mapStateToProps, mapDispatchToProps)(Button);
