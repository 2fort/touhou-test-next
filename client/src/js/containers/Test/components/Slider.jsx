import React, { PropTypes } from 'react';

const Slider = ({ activeStep, passedSteps, maxSteps, setStep }) => {
  const max = (passedSteps !== maxSteps) ? passedSteps + 1 : maxSteps;
  return (
    <div className="myslider">
      <div className="inside">
        <input
          onChange={(e) => {
            e.preventDefault();
            const step = parseInt(e.target.value, 10);
            setStep(step);
          }}
          type="range" min="1" max={max} step="1"
          value={activeStep} className={`width-${max}`}
        />
      </div>
    </div>
  );
};

Slider.propTypes = {
  activeStep: PropTypes.number.isRequired,
  passedSteps: PropTypes.number.isRequired,
  maxSteps: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
};

export default Slider;
