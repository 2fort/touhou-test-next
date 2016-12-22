import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CharactersActions from '../../actions/charactersActions';

export default function (ComposedComponent) {
  class List extends Component {

    componentWillMount() {
      const { location: { pathname, query }, mode, router: { replace }, actions } = this.props;

      if (mode === 'table' && !query.mode) {
        replace({ pathname, query: { mode: 'table' }, state: {} });
      } else if (mode === 'grid' && query.mode === 'table') {
        actions.changeMode('table');
      }
    }

    // then we on /characters?mode=table and menu button "Charaters" was pressed, we need to add ?mode=table to pathname
    componentWillReceiveProps(nextProps) {
      const { location: { pathname }, mode, router: { replace } } = this.props;
      const { location: { query } } = nextProps;

      if (mode === 'table' && !query.mode && nextProps.mode !== 'grid') {
        replace({ pathname, query: { mode: 'table' }, state: {} });
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps({ characters: { mode } }) {
    return { mode };
  }

  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(CharactersActions, dispatch),
    };
  }

  List.propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.shape({
        mode: PropTypes.string,
      }),
    }).isRequired,
    mode: PropTypes.string.isRequired,
    actions: PropTypes.shape({
      changeMode: PropTypes.func,
    }).isRequired,
    router: PropTypes.shape({
      replace: PropTypes.func,
    }).isRequired,
  };

  return connect(mapStateToProps, mapDispatchToProps)(List);
}

