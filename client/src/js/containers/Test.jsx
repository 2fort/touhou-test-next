import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { TestCore, MyModal, Slider, TopButtons } from '../components/Test';
import { fetchTestInfo, beginTest, purgeCache } from '../actions/asyncActions';

class Test extends Component {
  static onEnter(dispatch) {
    dispatch(fetchTestInfo());
  }

  static onLeave(dispatch) {
    dispatch(purgeCache());
  }

  componentWillMount() {
    this.props.generateTest();
  }

  render() {
    if (this.props.fetchInProgress) {
      return null;
    }

    return (
      <div>
        <Helmet title="Test" />

        <Slider />
        <TopButtons />
        <TestCore />

        <MyModal />
      </div>
    );
  }
}

function mapStateToProps({ store: { fetchInProgress } }) {
  return { fetchInProgress };
}

function mapDispatchToProps(dispatch) {
  return {
    generateTest: () => {
      dispatch(beginTest());
    },
  };
}

Test.propTypes = {
  fetchInProgress: PropTypes.bool,
  generateTest: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Test);
