import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './duck';
import { prepareFormData } from '../_sharedComponents/utils';
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

  newGameModalSubmit = ({ fileCover, ...values }) => {
    const formDataValues = prepareFormData(values, fileCover, 'cover');

    return this.props.actions.newGame(formDataValues)
      .then(() => this.props.actions.fetchAllGames())
      .then(() => this.props.actions.newGameModalClose());
  }

  editGameModalSubmit = ({ fileCover, ...values }) => {
    const formDataValues = prepareFormData(values, fileCover, 'cover');

    return this.props.actions.editGame(values.id, formDataValues)
      .then(() => this.props.actions.fetchAllGames())
      .then(() => this.props.actions.editGameModalClose());
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
              <th>Title</th>
              <th>Prefix</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
            {gamesArray[0] && gamesArray.map((game, i) => (
              <tr key={game.title}>
                <td><strong>{i + 1}</strong></td>
                <td className="table-image">
                  {game.cover && <img alt={game.title} className="img-thumbnail" src={IMG_THUMBNAIL + game.cover} />}
                </td>
                <td>{game.title}</td>
                <td>{game.prefix}</td>
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
