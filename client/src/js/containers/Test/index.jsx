import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { ResultModal, Slider, TopButtons, CharacterImage, CharacterButtons } from './components';
import { NextButton, PrevButton } from './components/NavButtons';
import { fetchCharsAndBeginTest } from '../../actions/testActions';
import TestCore from './TestCore';
import Loading from '../Base/components/Loading';

class Test extends Component {
  componentDidMount() {
    this.props.actions.didMount();

    if (!this.props.state.inProgress) {
      this.props.actions.fetchCharsAndBeginTest(20);
    }
  }

  componentWillUnmount() {
    this.props.actions.willUnmount();
  }

  render() {
    const { state } = this.props;

    if (!state.inProgress || state.pending) return <Loading />;

    return (
      <div>
        <Helmet title="Test" />

        <Slider />
        <TopButtons />
        <TestCore>
          <PrevButton>&nbsp;&lt;&nbsp;</PrevButton>
          <CharacterImage />
          <CharacterButtons />
          <NextButton>&nbsp;&gt;&nbsp;</NextButton>
        </TestCore>

        <ResultModal />
      </div>
    );
  }
}

function mapStateToProps({ domain: { test } }) {
  const state = { pending: false, inProgress: false };
  if (!test) return { state };

  state.pending = test.pending;
  state.inProgress = (test.steps.length > 0);
  return { state };
}

function mapDispatchToProps(dispatch) {
  const component = 'Test';
  return {
    actions: {
      didMount: () => {
        dispatch({
          type: 'COMPONENT_MOUNT',
          component,
        });
      },
      willUnmount: () => {
        dispatch({
          type: 'COMPONENT_UNMOUNT',
          component,
        });
      },
      fetchCharsAndBeginTest: (maxSteps) => {
        dispatch(fetchCharsAndBeginTest(component, maxSteps));
      },
    },
  };
}

Test.propTypes = {
  state: PropTypes.shape({
    active: PropTypes.bool,
    pending: PropTypes.bool,
    inProgress: PropTypes.bool,
  }),
  actions: PropTypes.shape({
    didMount: PropTypes.func,
    willUnmount: PropTypes.func,
    fetchCharsAndBeginTest: PropTypes.func,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Test);
