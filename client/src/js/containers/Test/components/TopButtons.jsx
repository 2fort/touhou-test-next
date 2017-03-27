import React, { PropTypes } from 'react';
import { classes } from 'typestyle';
import * as style from './TopButtons.style';

const TopButtons = ({ steps, passedSteps, activeStep }) => {
  const topButtons = steps.map((step, i) => {
    const active = i + 1 === activeStep;

    function pickColor() {
      if (step.passed && step.rightAnswer === step.givenAnswer) {
        return style.green;
      } else if (step.passed && step.rightAnswer !== step.givenAnswer) {
        return style.red;
      } else if (i === passedSteps) {
        return style.blue;
      }
      return style.gray;
    }

    return (
      <div
        key={step.step}
        className={classes(style.elem, pickColor(), active && style.elemActive)}
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
