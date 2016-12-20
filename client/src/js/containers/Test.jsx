import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import * as TestActions from '../actions/testActions';

import TopButtons from '../components/Test/TopButtons';
import Slider from '../components/Test/Slider';
import MyModal from '../components/Test/MyModal';
import TestCore from '../components/Test/TestCore';

class Test extends Component {
    componentWillMount() {
        this.props.actions.showResetButton();

        if (!this.props.inProgress) {
            this.props.actions.beginTest();
        }
    }
    componentWillUnmount() {
        this.props.actions.hideResetButton();
    }
    render() {
        const { steps, maxSteps, activeStep, passedSteps, modalIsOpen, inProgress, actions } = this.props;

        if (!inProgress) {
            return null;
        }

        return (
            <DocumentTitle title="Test | Touhou">
                <div>
                    <Slider
                      setStep={actions.setStep}
                      passedSteps={passedSteps}
                      maxSteps={maxSteps}
                      step={activeStep}
                    />
                    <TopButtons
                      steps={steps}
                      passedSteps={passedSteps}
                      activeStep={activeStep}
                    />

                    <TestCore
                      steps={steps}
                      activeStep={activeStep}
                      actions={actions}
                      maxSteps={maxSteps}
                      passedSteps={passedSteps}
                    />

                    <MyModal
                      open={modalIsOpen}
                      actions={actions}
                      steps={steps}
                    />
                </div>
            </DocumentTitle>
        );
    }
}

Test.propTypes = {
    steps: PropTypes.array,
    maxSteps: PropTypes.number,
    activeStep: PropTypes.number,
    passedSteps: PropTypes.number,
    modalIsOpen: PropTypes.bool,
    inProgress: PropTypes.bool.isRequired,
    actions: PropTypes.object,
};

function mapStateToProps({ test: { resetButtonVisible, ...data } }) {
    return { ...data };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TestActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
