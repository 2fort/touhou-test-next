import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Hammer from 'hammerjs';

class Core extends Component {
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
      this.props.goNextStep();
    } else if (e.direction === Hammer.DIRECTION_RIGHT) {
      this.props.goPrevStep();
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

Core.propTypes = {
  goNextStep: PropTypes.func.isRequired,
  goPrevStep: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Core;
