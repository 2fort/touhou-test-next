import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { GamesGrid, GamesTable } from './components/gridsAndTables';
import { TopContainer, Breadcrumbs, ModeButtons } from './components';
// import Fetch404 from '../Base/components/Fetch404';

import { domainHoc } from '../../ducks/domain';
import fetchGames from './GamesList.duck';

class GamesList extends Component {
  componentDidMount() {
    this.props.fetchGames();
  }

  render() {
    const { games, mode, router, location } = this.props;

    return (
      <div>
        <Helmet title="Games" />

        <TopContainer>
          <Breadcrumbs>
            <span>Games</span>
          </Breadcrumbs>
          <ModeButtons router={router} location={location} />
        </TopContainer>

        {mode === 'grid' && <GamesGrid entity={games} pathname={location.pathname} />}
        {mode === 'table' && <GamesTable entity={games} pathname={location.pathname} />}
      </div>
    );
  }
}

GamesList.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  mode: PropTypes.string.isRequired,
  fetchGames: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ entities, domain: { gamesList }, base: { mode } }) {
  const games = gamesList.visible.map(id => entities.games[id]);

  return { games, mode };
}

export default
  connect(mapStateToProps, { fetchGames })(
    domainHoc({ name: 'GamesList' })(GamesList),
  );
