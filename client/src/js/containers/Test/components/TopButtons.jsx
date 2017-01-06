import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const TopButtons = ({ structure }) => {
  const topButtons = structure.map((step, i) => (
    <div key={i} className={(step.active) ? `${step.color} active` : step.color}>
      &nbsp;
    </div>
  ));

  return (
    <div className="topbuttons">
      {topButtons}
    </div>
  );
};

function mapStateToProps({ domain: { test: { steps, passedSteps, activeStep } } }) {
  const structure = steps.map((step, i) => {
    const params = {
      color: 'gray',
      active: (i + 1 === activeStep),
    };

    if (step.passed && step.rightAnswer === step.givenAnswer) {
      params.color = 'green';
    } else if (step.passed && step.rightAnswer !== step.givenAnswer) {
      params.color = 'red';
    } else if (i === passedSteps) {
      params.color = 'blue';
    }

    return params;
  });

  return {
    structure,
  };
}

TopButtons.propTypes = {
  structure: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string,
    active: PropTypes.bool,
  })).isRequired,
};

export default connect(mapStateToProps)(TopButtons);
