import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import * as TestActions from '../actions/testActions';
import { IStep } from '../propTypes';

import { TestCore, MyModal, Slider, TopButtons } from '../components/Test';

class Test extends Component {
  static onEnter(store, nextState, replace) {
    store.dispatch(TestActions.beginTest());
  }

  componentWillMount() {
    this.props.actions.showResetButton();
  }

  componentWillUnmount() {
    this.props.actions.hideResetButton();
  }

  render() {
    const { steps, maxSteps, activeStep, passedSteps, modalIsOpen, actions } = this.props;

    return (
      <div>
        <Helmet title="Test" />

        <Slider
          actions={{ setStep: actions.setStep }}
          passedSteps={passedSteps}
          maxSteps={maxSteps}
          step={activeStep}
        />

        <TopButtons
          steps={steps}
          passedSteps={passedSteps}
          activeStep={activeStep}
        />

        <TestCore
          steps={steps}
          activeStep={activeStep}
          actions={actions}
          maxSteps={maxSteps}
          passedSteps={passedSteps}
        />

        <MyModal
          open={modalIsOpen}
          actions={actions}
          steps={steps}
        />
      </div>
    );
  }
}

Test.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape(IStep)).isRequired,
  maxSteps: PropTypes.number.isRequired,
  activeStep: PropTypes.number.isRequired,
  passedSteps: PropTypes.number.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps({ test: { steps, maxSteps, activeStep, passedSteps, modalIsOpen } }) {
  return { steps, maxSteps, activeStep, passedSteps, modalIsOpen };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TestActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
