import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { TestCore, MyModal, Slider, TopButtons } from '../components/Test';
import { beginTest } from '../actions/testActions';

export default class Test extends Component {
  static onEnter(store, nextState, replace) {
    store.dispatch(beginTest());
  }

  render() {
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
