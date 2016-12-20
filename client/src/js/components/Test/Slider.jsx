import React, { Component, PropTypes } from 'react';

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.step };

    this.handleInput = this.handleInput.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.step });
  }
  handleInput(e) {
    e.preventDefault();
    this.setState({ value: e.target.value });
    this.props.setStep(parseInt(e.target.value, 10));
  }
  render() {
    const { passedSteps, maxSteps } = this.props;

    let max = (passedSteps !== maxSteps) ? passedSteps + 1 : maxSteps;

    return (
      <div className="myslider">
        <div className="inside">
          <input
            onInput={this.handleInput}
            type="range" min="1" max={max} step="1"
            value={this.state.value} className={`width-${max}`}
          />
        </div>
      </div>
    );
  }
}

Slider.propTypes = {
  step: PropTypes.number.isRequired,
  passedSteps: PropTypes.number.isRequired,
  maxSteps: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
};
