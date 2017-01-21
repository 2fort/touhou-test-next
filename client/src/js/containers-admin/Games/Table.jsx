import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchAllGames, deleteGame } from '../../actions/adminActions';
import { IMG_THUMBNAIL } from '../../config';

class GamesTable extends Component {
  componentWillMount() {
    this.props.actions.didMount();
    this.props.actions.getData();
  }

  componentWillUnmount() {
    this.props.actions.willUnmount();
  }

  render() {
    const { ready, gamesArray, actions } = this.props;

    if (!ready) return null;

    const gamesTable = gamesArray.map(game => (
      <tr key={game.title}>
        <td>{game.prefix}</td>
        <td>{game.title}<br /><h6>{game.slug}</h6></td>
        <td className="table-image">
          {game.cover && <img alt={game.title} src={IMG_THUMBNAIL + game.cover} />}
        </td>
        <td>{game.year}</td>
        <td>
          <Link to={`/admin/games/edit/${game.id}`}>
            <i className="fa fa-pencil fa-lg" aria-hidden="true" />
          </Link>{' '}
          <button type="button" className="btn btn-link" onClick={actions.delBtnHandler(game)} >
            <i className="fa fa-trash fa-lg" aria-hidden="true" />
          </button>
        </td>
      </tr>
    ));

    const tableBody = (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>prefix</th>
            <th>title / slug</th>
            <th>cover</th>
            <th>year</th>
            <th>actions</th>
          </tr>
          {gamesTable}
        </thead>
      </table>
    );

    return (
      <div>
        <Link to="/admin/games/new" className="btn btn-primary">Add new game</Link>
        {tableBody}
      </div>
    );
  }
}

GamesTable.defaultProps = {
  gamesArray: undefined,
};

GamesTable.propTypes = {
  ready: PropTypes.bool.isRequired,
  gamesArray: PropTypes.arrayOf(PropTypes.object),
  actions: PropTypes.shape({
    didMount: PropTypes.func.isRequired,
    willUnmount: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
    delBtnHandler: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ domain: { gamesTable }, entities: { games } }) {
  if (!gamesTable || gamesTable.pending) return { ready: false };

  const gamesArray = gamesTable.visible.map(slug => games[slug]);

  return { ready: true, gamesArray };
}

function mapDispatchToProps(dispatch) {
  const component = 'GamesTable';
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
        dispatch(fetchAllGames(component));
      },
      delBtnHandler: game => () => {
        dispatch(deleteGame(game, component));
      },
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesTable);
