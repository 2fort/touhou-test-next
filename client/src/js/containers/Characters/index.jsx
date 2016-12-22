import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Breadcrumbs from '../../components/Characters/Breadcrumbs';
import ModeButtons from '../../components/Characters/ModeButtons';

import * as CharactersActions from '../../actions/charactersActions';

class Characters extends Component {
  constructor(props) {
    super(props);
    this.btnChangeMode = this.btnChangeMode.bind(this);
  }
  btnChangeMode(btnMode) {
    const { location: { pathname }, actions: { changeMode }, router: { replace } } = this.props;

    if (btnMode === 'grid') {
      changeMode('grid');
      replace({ pathname, query: {}, state: {} });
    } else {
      changeMode('table');
      replace({ pathname, query: { mode: 'table' }, state: {} });
    }
  }
  render() {
    const { children, params } = this.props;

    return (
      <DocumentTitle title="Characters | Touhou">
        <div className="simple-container">
          <div className="flex-top">
            <Breadcrumbs {...params} />
            {!params.char && <ModeButtons btnChangeMode={this.btnChangeMode} />}
          </div>
          {children}
        </div>
      </DocumentTitle>
    );
  }
}

Characters.propTypes = {
  children: PropTypes.node,
  params: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  actions: PropTypes.shape({
    changeMode: PropTypes.func,
  }),
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }),
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(CharactersActions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(Characters);
