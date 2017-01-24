import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { generateComponent } from '../domain';

export default childOptions => (ComposedComponent) => {
  const options = {
    persist: false,
    ...childOptions,
  };

  class DomainHOC extends Component {
    componentWillMount() {
      this.props.component.containerMount();
    }

    componentWillUnmount() {
      if (options.persist) {
        this.props.component.containerUnmount();
      } else {
        this.props.component.containerDestroy();
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  DomainHOC.propTypes = {
    component: PropTypes.shape({
      containerMount: PropTypes.func.isRequired,
      containerUnmount: PropTypes.func.isRequired,
      containerDestroy: PropTypes.func.isRequired,
      fetchBegin: PropTypes.func.isRequired,
      fetchSuccess: PropTypes.func.isRequired,
      fetchFail: PropTypes.func.isRequired,
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

