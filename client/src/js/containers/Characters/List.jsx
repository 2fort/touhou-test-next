import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';

import { GamesGrid, GamesTable, CharsGrid, CharsTable } from './components/gridsAndTables';
import { fetchCharacters, fetchGames } from '../../actions/charactersActions';

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
    const { ready, data, location } = this.props;

    if (!ready) return null;

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
    entities: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
    mode: PropTypes.string,
  }),
  actions: PropTypes.shape({
    didMount: PropTypes.func.isRequired,
    willUnmount: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

const GamesList = (() => {
  function mapStateToProps({ entities, domain: { gamesList }, main: { mode } }) {
    if (!gamesList || !gamesList.active || gamesList.pending) {
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
    if (!charactersList || !charactersList.active || charactersList.pending) {
      return { ready: false };
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
