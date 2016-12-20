import React, { PropTypes } from 'react';

const NextButton = ({ steps, activeStep, passedSteps, maxSteps, goNextStep, children }) => {
    let color = 'disabled';

    if (activeStep !== passedSteps + 1 && activeStep < maxSteps) {
        const step = steps[activeStep];

        if (step.givenAnswer) {
            color = (step.givenAnswer === step.rightAnswer) ? 'txt-green' : 'txt-red';
        } else {
            color = 'txt-blue';
        }
    }

    return (
        <div className="navigation">
            <button type="button" className={color} id="next" onClick={goNextStep}>
                {children}
            </button>
        </div>
    );
};

NextButton.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeStep: PropTypes.number.isRequired,
    passedSteps: PropTypes.number.isRequired,
    maxSteps: PropTypes.number.isRequired,
    goNextStep: PropTypes.func.isRequired,
    children: PropTypes.node,
};

const PrevButton = ({ steps, activeStep, goPrevStep, children }) => {
    let color = 'disabled';

    if (activeStep !== 1) {
        const step = steps[activeStep - 2];
        color = (step.givenAnswer === step.rightAnswer) ? 'txt-green' : 'txt-red';
    }

    return (
        <div className="navigation">
            <button type="button" className={color} id="prev" onClick={goPrevStep}>
                {children}
            </button>
        </div>
    );
};

PrevButton.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeStep: PropTypes.number.isRequired,
    goPrevStep: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export { NextButton, PrevButton };
