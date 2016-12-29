import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Breadcrumbs from '../../components/Characters/Breadcrumbs';
import ModeButtons from '../../components/Characters/ModeButtons';

import * as CharactersActions from '../../actions/charactersActions';

class Characters extends Component {
  constructor(props) {
    super(props);
    this.state = { gameTitle: '' };
  }

  componentWillMount() {
    if (this.props.params.game) {
      this.setGameTitle(this.props.params.game);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.game !== nextProps.params.game) {
      if (nextProps.params.game) {
        this.setGameTitle(nextProps.params.game);
      } else {
        this.setState({ gameTitle: '' });
      }
    }
  }

  setGameTitle = (gameParam) => {
    fetch(`/api/game/${gameParam}`)
      .then(response => response.json())
      .then((game) => {
        this.setState({ gameTitle: game[0].title });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  btnChangeMode = (btnMode) => {
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
      <div className="simple-container">
        <div className="flex-top">
          <Breadcrumbs gameTitle={this.state.gameTitle} {...params} />
          {!params.char && <ModeButtons btnChangeMode={this.btnChangeMode} />}
        </div>
        {children}
      </div>
    );
  }
}

Characters.propTypes = {
  children: PropTypes.node,
  params: PropTypes.shape({
    game: PropTypes.string,
    char: PropTypes.string,
  }),
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
