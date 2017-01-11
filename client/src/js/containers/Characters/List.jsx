import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';

import { GamesGrid, GamesTable, CharsGrid, CharsTable } from './components/gridsAndTables';
import { TopContainer, Breadcrumbs, ModeButtons } from './components';
import { fetchCharacters, fetchGames } from '../../actions/charactersActions';
import Fetch404 from '../Base/Fetch404';

const Noop = () => (
  <div>{' '}</div>
);

class List extends Component {
  componentDidMount() {
    this.props.actions.didMount();
    this.props.actions.getData();
  }

  componentWillUnmount() {
    this.props.actions.willUnmount();
  }

  render() {
    const { ready, data, router, params, location } = this.props;

    if (!ready) return null;
    if (!data) return <Fetch404>Game not found!</Fetch404>;

    let Grid = Noop;
    let Table = Noop;

    if (data.component === 'games') {
      Grid = GamesGrid;
      Table = GamesTable;
    } else if (data.component === 'characters') {
      Grid = CharsGrid;
      Table = CharsTable;
    }

    return (
      <div>
        <Helmet title={data.title} />

        <TopContainer>
          <Breadcrumbs params={params} />
          <ModeButtons router={router} location={location} />
        </TopContainer>

        {(data.mode === 'grid')
            ? <Grid entity={data.entity} pathname={location.pathname} />
            : <Table entity={data.entity} pathname={location.pathname} />
        }
      </div>
    );
  }
}

List.defaultProps = {
  data: undefined,
};

List.propTypes = {
  ready: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    component: PropTypes.string.isRequired,
    entity: PropTypes.arrayOf(PropTypes.object).isRequired,
    title: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
  }),
  actions: PropTypes.shape({
    didMount: PropTypes.func.isRequired,
    willUnmount: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
  }).isRequired,
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

const GamesList = (() => {
  function mapStateToProps({ entities, domain: { gamesList }, main: { mode } }) {
    if (!gamesList || gamesList.pending) {
      return { ready: false };
    }

    const data = {
      component: 'games',
      mode,
      title: 'Characters',
      entity: gamesList.visible.map(id => entities.games[id]),
    };

    return { ready: true, data };
  }

  function mapDispatchToProps(dispatch) {
    const component = 'GamesList';
    return {
      actions: {
        didMount: () => {
          dispatch({
            type: 'CONTAINER_MOUNT',
            component,
          });
        },
        willUnmount: () => {
          dispatch({
            type: 'CONTAINER_DESTROY',
            component,
          });
        },
        getData: () => {
          dispatch(fetchGames(component));
        },
      },
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(List);
})();

const CharactersList = (() => {
  function mapStateToProps({ entities, domain: { charactersList }, main: { mode } }, { params }) {
    if (!charactersList || charactersList.pending) {
      return { ready: false };
    }

    if (!entities.games[params.game]) {
      return { ready: true, data: undefined };
    }

    const data = {
      component: 'characters',
      mode,
      title: entities.games[params.game].title,
      entity: charactersList.visible.map(slug => entities.characters[slug]),
    };

    return { ready: true, data };
  }

  function mapDispatchToProps(dispatch, { params: { game } }) {
    const component = 'CharactersList';
    return {
      actions: {
        didMount: () => {
          dispatch({
            type: 'CONTAINER_MOUNT',
            component,
          });
        },
        willUnmount: () => {
          dispatch({
            type: 'CONTAINER_DESTROY',
            component,
          });
        },
        getData: () => {
          dispatch(fetchCharacters(game, component));
        },
      },
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(List);
})();

export { List, GamesList, CharactersList };
