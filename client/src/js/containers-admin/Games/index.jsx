import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './duck';
import { IMG_THUMBNAIL } from '../../config';

import GameFormModal from './components/GameFormModal';

class GamesTable extends Component {
  componentWillMount() {
    this.props.actions.fetchAllGames();
  }

  newGameBtnHandler = () => {
    this.props.actions.newGameModalOpen();
  }

  editGameBtnHandler = game => () => {
    this.props.actions.editGameModalOpen(game);
  }

  deleteGameBtnHandler = id => () => {
    this.props.actions.deleteGame(id)
      .then(() => this.props.actions.fetchAllGames());
  }

  prepareFormData = (values) => {
    const newValues = Object.assign({}, values);
    const formData = new FormData();

    if (newValues.fileCover) {
      newValues.cover = '';
    }

    // we have a file!
    if (newValues.fileCover && newValues.fileCover[0]) {
      formData.append('cover', newValues.fileCover[0], newValues.fileCover[0].name);
    }

    // delete all unnecessary fields
    delete newValues.id;
    delete newValues.slug;
    delete newValues.fileCover;

    formData.append('payload', JSON.stringify(newValues));

    return formData;
  }

  newGameModalSubmit = (values) => {
    const { actions } = this.props;
    const newValues = this.prepareFormData(values);

    return actions.newGame(newValues)
      .then(() => actions.fetchAllGames())
      .then(() => actions.newGameModalClose());
  }

  editGameModalSubmit = (values) => {
    const { actions } = this.props;
    const newValues = this.prepareFormData(values);

    return actions.editGame(values.id, newValues)
      .then(() => actions.fetchAllGames())
      .then(() => actions.editGameModalClose());
  }

  render() {
    const { gamesArray, actions, modals } = this.props;

    return (
      <div>
        <button type="button" className="btn btn-primary" onClick={this.newGameBtnHandler}>
          Add new game
        </button>

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
                  <button type="button" className="btn btn-default" onClick={this.editGameBtnHandler(game)}>
                    <i className="fa fa-pencil fa-lg" aria-hidden="true" />
                  </button>
                  {' '}
                  <button type="button" className="btn btn-default" onClick={this.deleteGameBtnHandler(game.id)}>
                    <i className="fa fa-trash fa-lg" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </thead>
        </table>

        {modals.newGameModalVisible &&
          <GameFormModal
            onSubmit={this.newGameModalSubmit}
            hide={actions.newGameModalClose}
            title="New Game"
            buttonName="Create"
          />
        }

        {modals.editGameModalVisible &&
          <GameFormModal
            initialValues={modals.editFormInitValues}
            onSubmit={this.editGameModalSubmit}
            hide={actions.editGameModalClose}
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
  modals: PropTypes.shape({
    newGameModalVisible: PropTypes.bool,
    editGameModalVisible: PropTypes.bool,
    editFormInitValues: PropTypes.object,
  }),
  actions: PropTypes.shape({
    newGameModalOpen: PropTypes.func.isRequired,
    newGameModalClose: PropTypes.func.isRequired,
    editGameModalOpen: PropTypes.func.isRequired,
    editGameModalClose: PropTypes.func.isRequired,
    fetchAllGames: PropTypes.func.isRequired,
    editGame: PropTypes.func.isRequired,
    newGame: PropTypes.func.isRequired,
    deleteGame: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ domain: { gamesTable }, entities: { games } }) {
  if (!gamesTable) return {};

  const gamesArray = gamesTable.visible.map(id => games[id]);

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
  return { actions: bindActionCreators(ownActions, dispatch) };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'GamesTable' })(GamesTable),
  );
