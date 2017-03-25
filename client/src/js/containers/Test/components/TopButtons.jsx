import React, { PropTypes } from 'react';
import { classes } from 'typestyle';
import * as style from './TopButtons.style';

const TopButtons = ({ steps, passedSteps, activeStep }) => {
  const topButtons = steps.map((step, i) => {
    let color = style.gray;
    const active = i + 1 === activeStep;

    if (step.passed && step.rightAnswer === step.givenAnswer) {
      color = style.green;
    } else if (step.passed && step.rightAnswer !== step.givenAnswer) {
      color = style.red;
    } else if (i === passedSteps) {
      color = style.blue;
    }

    return (
      <div
        key={step.step}
        className={active
          ? classes(style.elem, color, style.elemActive)
          : classes(style.elem, color)
        }
      >
        &nbsp;
      </div>
    );
  });

  return (
    <div className={style.topbuttons}>
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
