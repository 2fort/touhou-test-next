import React, { PropTypes } from 'react';

const TopButtons = ({ steps, passedSteps, activeStep }) => {
    const topButtons = steps.map((step, i) => {
        let color = 'gray';

        if (step.rightAnswer === step.givenAnswer) {
            color = 'green';
        } else if (step.rightAnswer !== step.givenAnswer && step.givenAnswer !== '') {
            color = 'red';
        } else if (i === passedSteps) {
            color = 'blue';
        }

        color += ((i + 1) === activeStep) ? ' active' : '';

        return (
            <div key={i} className={color}>
                &nbsp;
            </div>
        );
    });

    return (
        <div className="topbuttons" id="mytopbuttons">
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
