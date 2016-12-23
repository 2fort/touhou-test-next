import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import * as TestActions from '../actions/testActions';

import TopButtons from '../components/Test/TopButtons';
import Slider from '../components/Test/Slider';
import MyModal from '../components/Test/MyModal';
import TestCore from '../components/Test/TestCore';

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
      <DocumentTitle title="Test | Touhou">
        <div>
          <Slider
            setStep={actions.setStep}
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
      </DocumentTitle>
    );
  }
}

Test.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      step: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      passed: PropTypes.bool.isRequired,
      buttons: PropTypes.arrayOf(PropTypes.string).isRequired,
      rightAnswer: PropTypes.string.isRequired,
      givenAnswer: PropTypes.string,
    }),
  ),
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
