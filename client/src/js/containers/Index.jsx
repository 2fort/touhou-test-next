import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Navbar from '../components/Index/Navbar';
import * as TestActions from '../actions/testActions';

const Index = ({ resetButtonVisible, children, actions }) => (
    <div>
        <Navbar resetButtonVisible={resetButtonVisible} resetTest={actions.resetTest} />
        <DocumentTitle title="Touhou | Comiket">
            {children}
        </DocumentTitle>
    </div>
);

Index.propTypes = {
    children: PropTypes.node,
    resetButtonVisible: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
};

function mapStateToProps({ test: { resetButtonVisible } }) {
    return { resetButtonVisible };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TestActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
