import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { fetchGames, fetchGamesBegin, purgeCache } from '../../actions/asyncActions';
import { Grid, Table } from '../../components/Characters/GamesList';

class GamesList extends Component {
  static onEnter(dispatch) {
    dispatch(fetchGamesBegin());
  }

  static onLeave(dispatch) {
    dispatch(purgeCache());
  }

  componentWillMount() {
    this.props.fetchGames();
  }

  render() {
    const { games, location: { pathname }, mode } = this.props;

    return (
      <div>
        <Helmet title="Characters" />

        {mode === 'grid'
          ? <Grid gamesFlex={games} pathname={pathname} />
          : <Table gamesFlex={games} pathname={pathname} />
        }
      </div>
    );
  }
}

function mapStateToProps({ store: { games }, main: { mode } }) {
  return { games, mode };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchGames: () => {
      dispatch(fetchGames());
    },
  };
}

GamesList.propTypes = {
  games: PropTypes.objectOf(PropTypes.object),
  fetchGames: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  mode: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GamesList);
