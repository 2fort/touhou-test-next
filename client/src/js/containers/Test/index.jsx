import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Helmet from 'react-helmet';

import { Variants, Image, Core, NavButtons, ResultModal, Slider, TopButtons } from './components';
import Loading from '../Base/components/Loading';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './duck';
import style from './index.style';

class Test extends Component {
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
        <Helmet title="Test" />

        <Slider setStep={actions.setStep} activeStep={activeStep} passedSteps={passedSteps} maxSteps={maxSteps} />

        <TopButtons steps={steps} passedSteps={passedSteps} activeStep={activeStep} />

        <Core style={style} goPrevStep={actions.goPrevStep} goNextStep={actions.goNextStep} >

          <NavButtons.Prev steps={steps} activeStep={activeStep} goPrevStep={actions.goPrevStep} />

          <Image steps={steps} activeStep={activeStep} />

          <Variants.Name
            actions={{
              answerGiven: actions.answerGiven,
              openResultsWindow: actions.openResultsWindow,
              goNextStep: actions.goNextStep }}
            steps={steps}
            activeStep={activeStep}
            maxSteps={maxSteps}
          />

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

Test.propTypes = {
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

function mapStateToProps({ domain: { test } }) {
  const pending = !test.active || test.activeRequests > 0;
  const inProgress = test.steps.length > 0;
  return { pending, inProgress, ...test };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ownActions, dispatch) };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'Test', persist: true })(Test),
  );
