import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setStep } from '../duck';

const Slider = ({ structure: { value, max }, onSliderMove }) => (
  <div className="myslider">
    <div className="inside">
      <input
        onChange={onSliderMove}
        type="range" min="1" max={max} step="1"
        value={value} className={`width-${max}`}
      />
    </div>
  </div>
);

function mapStateToProps({ domain: { test: { activeStep, passedSteps, maxSteps } } }) {
  const structure = {
    value: activeStep,
    max: (passedSteps !== maxSteps) ? passedSteps + 1 : maxSteps,
  };

  return { structure };
}

function mapDispatchToProps(dispatch) {
  return {
    onSliderMove: (e) => {
      e.preventDefault();
      const step = parseInt(e.target.value, 10);
      dispatch(setStep(step));
    },
  };
}

Slider.propTypes = {
  structure: PropTypes.shape({
    value: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }).isRequired,
  onSliderMove: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Slider);
