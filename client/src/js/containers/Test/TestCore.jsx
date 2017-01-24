import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import Hammer from 'hammerjs';

import { goNextStep, goPrevStep } from './duck';

class TestCore extends Component {
  componentDidMount() {
    this.mc = new Hammer.Manager(findDOMNode(this));
    this.mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));
    this.mc.on('swipe', this.handlePan);
  }

  componentWillUnmount() {
    this.mc.off('swipe', this.handlePan);
  }

  handlePan = (e) => {
    e.preventDefault();

    if (e.direction === Hammer.DIRECTION_LEFT) {
      this.props.swipeLeft();
    } else if (e.direction === Hammer.DIRECTION_RIGHT) {
      this.props.swipeRight();
    }
  };

  render() {
    return (
      <div className="test">
        {this.props.children}
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
  children: PropTypes.node.isRequired,
};

export default connect(null, mapDispatchToProps)(TestCore);
