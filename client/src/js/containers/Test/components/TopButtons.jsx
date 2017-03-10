import React, { PropTypes } from 'react';

const TopButtons = ({ steps, passedSteps, activeStep }) => {
  const topButtons = steps.map((step, i) => {
    let color = 'gray';
    const active = i + 1 === activeStep;

    if (step.passed && step.rightAnswer === step.givenAnswer) {
      color = 'green';
    } else if (step.passed && step.rightAnswer !== step.givenAnswer) {
      color = 'red';
    } else if (i === passedSteps) {
      color = 'blue';
    }

    return (
      <div key={i} className={active ? `${color} active` : color}>
        &nbsp;
      </div>
    );
  });

  return (
    <div className="topbuttons">
      {topButtons}
    </div>
  );
};

TopButtons.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  passedSteps: PropTypes.number.isRequired,
  activeStep: PropTypes.number.isRequired,
};

export default TopButtons;
