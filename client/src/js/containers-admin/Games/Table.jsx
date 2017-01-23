import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchAllGames, deleteGame, newGame, editGame } from '../../actions/adminActions';
import { IMG_THUMBNAIL } from '../../config';
import * as types from '../../constants/ActionTypes';
import GameFormModal from './components/GameFormModal';

class GamesTable extends Component {
  componentWillMount() {
    this.props.actions.didMount();
    this.props.actions.getData();
  }

  componentWillUnmount() {
    this.props.actions.willUnmount();
  }

  render() {
    const { gamesArray, actions, modals } = this.props;

    return (
      <div>
        <button type="button" className="btn btn-primary" onClick={actions.openNewGameModal}>Add new game</button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Cover</th>
              <th>Prefix</th>
              <th>Title / Slug</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
            {gamesArray[0] && gamesArray.map((game, i) => (
              <tr key={game.title}>
                <td><strong>{i}</strong></td>
                <td className="table-image">
                  {game.cover && <img alt={game.title} className="img-thumbnail" src={IMG_THUMBNAIL + game.cover} />}
                </td>
                <td>{game.prefix}</td>
                <td>{game.title}<br /><h6>{game.slug}</h6></td>
                <td>{game.year}</td>
                <td>
                  <button type="button" className="btn btn-default" onClick={actions.openEditGameModal(game)} >
                    <i className="fa fa-pencil fa-lg" aria-hidden="true" />
                  </button>{' '}
                  <button type="button" className="btn btn-default" onClick={actions.deleteGameBtnHandler(game)} >
                    <i className="fa fa-trash fa-lg" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </thead>
        </table>

        {modals.newGameModalVisible &&
          <GameFormModal
            onSubmit={actions.newGameModalSubmit}
            hide={actions.closeNewGameModal}
            title="New Game"
            buttonName="Create"
          />
        }

        {modals.editGameModalVisible &&
          <GameFormModal
            initialValues={modals.editFormInitValues}
            onSubmit={actions.editGameModalSubmit}
            hide={actions.closeEditGameModal}
            title="Edit Game"
            buttonName="Edit"
          />
        }
      </div>
    );
  }
}

GamesTable.defaultProps = {
  gamesArray: [],
  modals: {},
};

GamesTable.propTypes = {
  gamesArray: PropTypes.arrayOf(PropTypes.object),
  actions: PropTypes.shape({
    didMount: PropTypes.func.isRequired,
    willUnmount: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
    deleteGameBtnHandler: PropTypes.func.isRequired,
    newGameModalSubmit: PropTypes.func.isRequired,
  }).isRequired,
  modals: PropTypes.shape({
    newGameModalVisible: PropTypes.bool,
    editGameModalVisible: PropTypes.bool,
    editFormInitValues: PropTypes.object,
  }),
};

function mapStateToProps({ domain: { gamesTable }, entities: { games } }) {
  if (!gamesTable) return {};

  const gamesArray = gamesTable.visible.map(slug => games[slug]);

  return {
    gamesArray,
    modals: {
      newGameModalVisible: gamesTable.newGameModalVisible,
      editGameModalVisible: gamesTable.editGameModalVisible,
      editFormInitValues: gamesTable.editFormInitValues,
    },
  };
}

function mapDispatchToProps(dispatch) {
  const component = 'GamesTable';
  return {
    actions: {
      didMount: () => {
        dispatch({ type: types.CONTAINER_MOUNT, component });
      },

      willUnmount: () => {
        dispatch({ type: types.CONTAINER_DESTROY, component });
      },

      getData: () => {
        dispatch(fetchAllGames(component));
      },

      openNewGameModal: () => {
        dispatch({ type: types.NEW_GAME_MODAL_OPEN });
      },

      closeNewGameModal: () => {
        dispatch({ type: types.NEW_GAME_MODAL_CLOSE });
      },

      openEditGameModal: initValues => () => {
        dispatch({ type: types.EDIT_GAME_MODAL_OPEN, initValues });
      },

      closeEditGameModal: () => {
        dispatch({ type: types.EDIT_GAME_MODAL_CLOSE });
      },

      deleteGameBtnHandler: game => () => {
        dispatch(deleteGame(game, component))
          .then(() => dispatch(fetchAllGames(component)));
      },

      newGameModalSubmit: (values) => {
        const newValues = new FormData();

        newValues.append('prefix', values.prefix || '');
        newValues.append('title', values.title);
        newValues.append('year', values.year || null);

        if (values.cover && values.cover[0]) {
          newValues.append('cover', values.cover[0], values.cover[0].name);
        }

        return dispatch(newGame(newValues))
          .then(() => dispatch(fetchAllGames(component)))
          .then(() => dispatch({ type: types.NEW_GAME_MODAL_CLOSE }));
      },

      editGameModalSubmit: (values) => {
        const newValues = new FormData();

        newValues.append('id', values.id);
        newValues.append('prefix', values.prefix || '');
        newValues.append('title', values.title);
        newValues.append('year', values.year || null);

        if (values.cover && typeof values.cover === 'object' && values.cover[0]) {
          newValues.append('cover', values.cover[0], values.cover[0].name);
        }

        return dispatch(editGame(newValues))
          .then(() => dispatch(fetchAllGames(component)))
          .then(() => dispatch({ type: types.EDIT_GAME_MODAL_CLOSE }));
      },
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesTable);
