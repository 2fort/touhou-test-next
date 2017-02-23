import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { generateComponent } from '../domain';

export default childOptions => (ComposedComponent) => {
  const options = {
    persist: false,
    resetVisible: false,
    ...childOptions,
  };

  class DomainHOC extends Component {
    componentWillMount() {
      this.props.component.containerMount();
    }

    componentWillUnmount() {
      if (!options.persist) {
        this.props.component.containerDestroy();
        return;
      }

      if (options.resetVisible) {
        this.props.component.resetVisible();
      }

      this.props.component.containerUnmount();
    }

    render() {
      return <ComposedComponent component={this.props.component} {...this.props} />;
    }
  }

  DomainHOC.propTypes = {
    component: PropTypes.shape({
      containerMount: PropTypes.func.isRequired,
      containerUnmount: PropTypes.func.isRequired,
      containerDestroy: PropTypes.func.isRequired,
      resetVisible: PropTypes.func.isRequired,
    }).isRequired,
  };

  function mapDispatchToProps(dispatch) {
    const domainActions = generateComponent(options.name);

    return {
      component: bindActionCreators(domainActions, dispatch),
    };
  }

  return connect(null, mapDispatchToProps)(DomainHOC);
};
