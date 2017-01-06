import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import Hammer from 'hammerjs';

import { goNextStep, goPrevStep } from '../../actions/testActions';

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
  children: PropTypes.node,
};

export default connect(null, mapDispatchToProps)(TestCore);
