import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CharactersActions from '../../actions/charactersActions';

export default function(ComposedComponent) {
  class List extends Component {

    componentWillMount() {
      const { location: { pathname, query }, mode, actions: { changeMode } } = this.props;
      const { router: { replace } } = this.context;

      if (mode === 'table' && !query.mode) {
          replace({ pathname, query: { mode: 'table' }, state: {} });
      } else if (mode === 'grid' && query.mode === 'table') {
          changeMode('table');
      }
    }

    // then we on /characters?mode=table and menu button "Charaters" was pressed, we need add ?mode=table to pathname
    componentWillReceiveProps(nextProps) {
      const { location: { pathname }, mode } = this.props;
      const { location: { query } } = nextProps;
      const { router: { replace } } = this.context;

      if (mode === 'table' && !query.mode && nextProps.mode !== 'grid') {
        replace({ pathname, query: { mode: 'table' }, state: {} });
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
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
    location: PropTypes.object,
    mode: PropTypes.string,
    actions: PropTypes.object,
  };

  List.contextTypes = {
      router: PropTypes.object.isRequired,
  };

  return connect(mapStateToProps, mapDispatchToProps)(List);
}

