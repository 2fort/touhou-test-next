import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Hammer from 'hammerjs';

delete Hammer.defaults.cssProps.userSelect;

class Core extends Component {
  componentDidMount() {
    const isDesktop = window.matchMedia('(hover: hover)') || window.matchMedia('(-moz-touch-enabled: 0)');

    if (isDesktop.matches) return;

    this.mc = new Hammer.Manager(findDOMNode(this));
    this.mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));
    this.mc.on('swipe', this.handlePan);
  }

  componentWillUnmount() {
    if (this.mc) {
      this.mc.off('swipe', this.handlePan);
    }
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
      <div className={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

Core.defaultProps = {
  reverse: false,
};

Core.propTypes = {
  style: PropTypes.string.isRequired,
  goNextStep: PropTypes.func.isRequired,
  goPrevStep: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Core;
