import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

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
      return <ComposedComponent component={this.props.component} domainState={this.props.domainState} {...this.props} />;
    }
  }

  DomainHOC.defaultProps = {
    domainState: {
      active: false,
      pending: false,
      visible: [],
      fetchedAt: 0,
      total: 0,
      query: {
        sort: '',
        filter: {},
        page: 1,
        limit: 10,
      },
    },
  };

  DomainHOC.propTypes = {
    component: PropTypes.shape({
      containerMount: PropTypes.func.isRequired,
      containerUnmount: PropTypes.func.isRequired,
      containerDestroy: PropTypes.func.isRequired,
      fetchBegin: PropTypes.func.isRequired,
      fetchSuccess: PropTypes.func.isRequired,
      fetchFail: PropTypes.func.isRequired,
    }).isRequired,
    domainState: PropTypes.shape({
      active: PropTypes.bool,
      pending: PropTypes.bool,
      visible: PropTypes.arrayOf(PropTypes.string),
      fetchedAt: PropTypes.date,
      total: PropTypes.number,
      query: PropTypes.shape({
        page: PropTypes.number,
        limit: PropTypes.number,
        sort: PropTypes.string,
        filter: PropTypes.objectOf(PropTypes.any),
      }),
    }),
  };

  function mapStateToProps(state) {
    const stateSlice = state.domain[_.lowerFirst(options.name)];

    if (!stateSlice) return {};

    return { domainState: stateSlice };
  }

  function mapDispatchToProps(dispatch) {
    const domainActions = generateComponent(options.name);

    return {
      component: bindActionCreators(domainActions, dispatch),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(DomainHOC);
};

