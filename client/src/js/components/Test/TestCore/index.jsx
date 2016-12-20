import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Hammer from 'hammerjs';

import CharacterImage from './CharacterImage';
import CharacterButtons from './CharacterButtons';
import { NextButton, PrevButton } from './PrevNextButtons';

export default class TestCore extends Component {
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
            this.props.actions.goNextStep();
        } else if (e.direction === Hammer.DIRECTION_RIGHT) {
            this.props.actions.goPrevStep();
        }
    }
    render() {
        const { steps, activeStep, actions, maxSteps, passedSteps } = this.props;
        return (
            <div className="test">
                <PrevButton
                  steps={steps}
                  activeStep={activeStep}
                  goPrevStep={actions.goPrevStep}
                >
                  &nbsp;&lt;&nbsp;
                </PrevButton>

                <CharacterImage
                  image={steps[activeStep - 1].image}
                />

                <CharacterButtons
                  currentStep={Object.assign({}, steps[activeStep - 1])}
                  actions={actions}
                  maxSteps={maxSteps}
                />

                <NextButton
                  steps={steps}
                  activeStep={activeStep}
                  passedSteps={passedSteps}
                  maxSteps={maxSteps}
                  goNextStep={actions.goNextStep}
                >
                    &nbsp;&gt;&nbsp;
                </NextButton>
            </div>
        );
    }
}

TestCore.propTypes = {
    steps: PropTypes.array,
    activeStep: PropTypes.number,
    actions: PropTypes.object,
    maxSteps: PropTypes.number,
    passedSteps: PropTypes.number,
};
