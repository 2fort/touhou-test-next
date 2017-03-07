import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { ResultModal, Slider, TopButtons, CharacterImage, CharacterButtons } from './components';
import { NextButton, PrevButton } from './components/NavButtons';
import TestCore from './TestCore';
import Loading from '../Base/components/Loading';

import { domainHoc } from '../../ducks/domain';
import { fetchCharsAndBeginTest } from './duck';

class Test extends Component {
  componentDidMount() {
    if (!this.props.state.inProgress) {
      this.props.fetchCharsAndBeginTest(20);
    }
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

  state.pending = test.activeRequests > 0;
  state.inProgress = (test.steps.length > 0);
  return { state };
}

Test.propTypes = {
  state: PropTypes.shape({
    pending: PropTypes.bool.isRequired,
    inProgress: PropTypes.bool.isRequired,
  }).isRequired,
  fetchCharsAndBeginTest: PropTypes.func.isRequired,
};

export default
  connect(mapStateToProps, { fetchCharsAndBeginTest })(
    domainHoc({ name: 'Test', persist: true })(Test),
  );
