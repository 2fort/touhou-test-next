import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { GamesGrid, GamesTable } from './components/gridsAndTables';
import { TopContainer, Breadcrumbs, ModeButtons } from './components';
import Fetch404 from '../Base/components/Fetch404';

import { domainHoc } from '../../ducks/domain';
import fetchGames from './GamesList.duck';

class GamesList extends Component {
  componentDidMount() {
    this.props.fetchGames();
  }

  render() {
    const { ready, data, router, params, location } = this.props;

    if (!ready) return null;
    if (!data) return <Fetch404>Page not found!</Fetch404>;

    return (
      <div>
        <Helmet title="Characters" />

        <TopContainer>
          <Breadcrumbs params={params} />
          <ModeButtons router={router} location={location} />
        </TopContainer>

        {(data.mode === 'grid')
            ? <GamesGrid entity={data.entity} pathname={location.pathname} />
            : <GamesTable entity={data.entity} pathname={location.pathname} />
        }
      </div>
    );
  }
}

GamesList.defaultProps = {
  data: undefined,
};

GamesList.propTypes = {
  ready: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    entity: PropTypes.arrayOf(PropTypes.object).isRequired,
    mode: PropTypes.string.isRequired,
  }),
  fetchGames: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  params: PropTypes.shape({
    game: PropTypes.string,
    char: PropTypes.string,
  }).isRequired,
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ entities, domain: { gamesList }, base: { mode } }) {
  if (!gamesList || gamesList.pending) {
    return { ready: false };
  }

  const data = {
    entity: gamesList.visible.map(id => entities.games[id]),
    mode,
  };

  return { ready: true, data };
}

export default
  connect(mapStateToProps, { fetchGames })(
    domainHoc({ name: 'GamesList' })(GamesList),
  );
