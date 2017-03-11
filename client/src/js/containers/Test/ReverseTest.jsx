import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Helmet from 'react-helmet';

import { Variants, Core, NavButtons, ResultModal, Slider, TopButtons } from './components';
import Loading from '../Base/components/Loading';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './ReverseTest.duck';

class ReverseTest extends Component {
  componentDidMount() {
    if (!this.props.inProgress) {
      this.props.actions.fetchCharsAndBeginTest();
    }
  }

  render() {
    const { pending, inProgress, steps, activeStep, modalIsOpen, maxSteps, passedSteps, actions } = this.props;

    if (!inProgress || pending) return <Loading />;

    return (
      <div>
        <Helmet title="Reverse-Test" />

        <Slider setStep={actions.setStep} activeStep={activeStep} passedSteps={passedSteps} maxSteps={maxSteps} />

        <TopButtons steps={steps} passedSteps={passedSteps} activeStep={activeStep} />

        <Core reverse goPrevStep={actions.goPrevStep} goNextStep={actions.goNextStep} >

          <NavButtons.Prev steps={steps} activeStep={activeStep} goPrevStep={actions.goPrevStep} />

          <div className="test-center">
            <div className="character-name"><h1>{steps[activeStep - 1].rightAnswer}</h1></div>

            <Variants.Image
              actions={{
                answerGiven: actions.answerGiven,
                openResultsWindow: actions.openResultsWindow,
                goNextStep: actions.goNextStep }}
              steps={steps}
              activeStep={activeStep}
              maxSteps={maxSteps}
            />
          </div>

          <NavButtons.Next
            steps={steps}
            activeStep={activeStep}
            passedSteps={passedSteps}
            maxSteps={maxSteps}
            goNextStep={actions.goNextStep}
          />

        </Core>

        <ResultModal
          isOpen={modalIsOpen}
          steps={steps}
          actions={{ closeResultsWindow: actions.closeResultsWindow, resetTest: actions.resetTest }}
        />
      </div>
    );
  }
}

ReverseTest.propTypes = {
  pending: PropTypes.bool.isRequired,
  inProgress: PropTypes.bool.isRequired,
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeStep: PropTypes.number.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  maxSteps: PropTypes.number.isRequired,
  passedSteps: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    fetchCharsAndBeginTest: PropTypes.func.isRequired,
    setStep: PropTypes.func.isRequired,
    goPrevStep: PropTypes.func.isRequired,
    goNextStep: PropTypes.func.isRequired,
    openResultsWindow: PropTypes.func.isRequired,
    closeResultsWindow: PropTypes.func.isRequired,
    answerGiven: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ domain: { reverseTest } }) {
  const pending = !reverseTest.active || reverseTest.activeRequests > 0;
  const inProgress = reverseTest.steps.length > 0;
  return { pending, inProgress, ...reverseTest };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ownActions, dispatch) };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'ReverseTest', persist: true })(ReverseTest),
  );
