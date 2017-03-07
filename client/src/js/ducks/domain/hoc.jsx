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
    constructor(props) {
      super(props);

      this.state = {
        mountedAt: Date.now(),
      };
    }

    componentWillMount() {
      this.props.component.containerMount();
    }

    componentWillUnmount() {
      if (options.persist) {
        this.props.component.containerUnmount();
        return;
      }
      this.props.component.containerDestroy();
    }

    res = () => ({
      fresh: this.state.mountedAt < this.props.fetchedAt,
      stale: this.state.mountedAt > this.props.fetchedAt,
    })

    render() {
      const hocProps = {
        component: this.props.component,
      };

      if (options.persist) {
        hocProps.res = this.res();
      }

      return <ComposedComponent {...hocProps} {...this.props} />;
    }
  }

  DomainHOC.defaultProps = {
    fetchedAt: 0,
  };

  DomainHOC.propTypes = {
    fetchedAt: PropTypes.number,
    component: PropTypes.shape({
      containerMount: PropTypes.func.isRequired,
      containerUnmount: PropTypes.func.isRequired,
      containerDestroy: PropTypes.func.isRequired,
    }).isRequired,
  };

  function mapDispatchToProps(dispatch) {
    if (!options.name) throw new Error('name property must be set');

    const domainActions = generateComponent(options.name);

    return {
      component: bindActionCreators(domainActions, dispatch),
    };
  }

  return connect(null, mapDispatchToProps)(DomainHOC);
};
