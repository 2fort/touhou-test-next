import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import Hammer from 'hammerjs';

import CharacterImage from './CharacterImage';
import CharacterButtons from './CharacterButtons';
import { NextButton, PrevButton } from './NavButtons';
import { goNextStep, goPrevStep } from '../../../actions/testActions';

class TestCore extends Component {
  componentDidMount() {
    this.mc = new Hammer.Manager(findDOMNode(this));
    this.mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));
    this.mc.on('swipe', e => this.handlePan(e));
  }

  componentWillUnmount() {
    this.mc.off('swipe', e => this.handlePan(e));
  }

  handlePan(e) {
    e.preventDefault();

    if (e.direction === Hammer.DIRECTION_LEFT) {
      this.props.swipeLeft();
    } else if (e.direction === Hammer.DIRECTION_RIGHT) {
      this.props.swipeRight();
    }
  }

  render() {
    return (
      <div className="test">
        <PrevButton>&nbsp;&lt;&nbsp;</PrevButton>
        <CharacterImage />
        <CharacterButtons />
        <NextButton>&nbsp;&gt;&nbsp;</NextButton>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    swipeLeft: () => {
      dispatch(goNextStep());
    },
    swipeRight: () => {
      dispatch(goPrevStep());
    },
  };
}

TestCore.propTypes = {
  swipeLeft: PropTypes.func.isRequired,
  swipeRight: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(TestCore);
