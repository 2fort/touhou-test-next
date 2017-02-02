import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './duck';
import { prepareFormData } from '../_sharedComponents/utils';
import { IMG_THUMBNAIL } from '../../config';

import GameFormModal from './components/GameFormModal';
import SortButton from './components/SortButton';
import Pagination from '../Base/components/Pagination';

class GamesTable extends Component {
  componentWillMount() {
    this.props.actions.fetchGames();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.props.actions.fetchGames(nextProps.location.search);
    }
  }

  newGameBtnHandler = () => {
    this.props.actions.newGameModalOpen();
  }

  editGameBtnHandler = game => () => {
    this.props.actions.editGameModalOpen(game);
  }

  deleteGameBtnHandler = id => () => {
    this.props.actions.deleteGame(id)
      .then(() => this.props.actions.fetchGames());
  }

  newGameModalSubmit = ({ fileCover, ...values }) => {
    const formDataValues = prepareFormData(values, fileCover, 'cover');

    return this.props.actions.newGame(formDataValues)
      .then(() => this.props.actions.fetchGames())
      .then(() => this.props.actions.newGameModalClose());
  }

  editGameModalSubmit = ({ fileCover, ...values }) => {
    const formDataValues = prepareFormData(values, fileCover, 'cover');

    return this.props.actions.editGame(values.id, formDataValues)
      .then(() => this.props.actions.fetchGames())
      .then(() => this.props.actions.editGameModalClose());
  }

  render() {
    const { gamesArray, actions, modals, total } = this.props;

    return (
      <div>
        <button type="button" className="btn btn-primary" onClick={this.newGameBtnHandler}>
          Add new game
        </button>
        <br />

        <Pagination total={total} />

        <table className="table table-striped games-table">
          <thead>
            <tr>
              <th><SortButton field="_id" def>ID</SortButton></th>
              <th>Order</th>
              <th>Cover</th>
              <th><SortButton field="title">Title</SortButton></th>
              <th><SortButton field="prefix">Prefix</SortButton></th>
              <th><SortButton field="year">Year</SortButton></th>
              <th>Actions</th>
            </tr>
            {gamesArray[0] && gamesArray.map((game, i) => (
              <tr key={game.id}>
                <td><span title={game.id}>{`...${game.id.substr(-7, 7)}`}</span></td>
                <td>
                  <button type="button" className="btn btn-link">
                    <i className="fa fa-sort-asc" aria-hidden="true" />
                  </button>
                  1
                  <button type="button" className="btn btn-link">
                    <i className="fa fa-sort-desc" aria-hidden="true" />
                  </button>
                </td>
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

        <Pagination total={total} />

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
  total: 0,
};

GamesTable.propTypes = {
  gamesArray: PropTypes.arrayOf(PropTypes.object),
  modals: PropTypes.shape({
    newGameModalVisible: PropTypes.bool,
    editGameModalVisible: PropTypes.bool,
    editFormInitValues: PropTypes.object,
  }),
  total: PropTypes.number,
  actions: PropTypes.shape({
    newGameModalOpen: PropTypes.func.isRequired,
    newGameModalClose: PropTypes.func.isRequired,
    editGameModalOpen: PropTypes.func.isRequired,
    editGameModalClose: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
    editGame: PropTypes.func.isRequired,
    newGame: PropTypes.func.isRequired,
    deleteGame: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      page: PropTypes.string,
      limit: PropTypes.string,
      sort: PropTypes.string,
      filter: PropTypes.any,
    }),
    search: PropTypes.string,
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
    total: gamesTable.total,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { fetchGames, ...duckActions } = ownActions;
  const actions = bindActionCreators(duckActions, dispatch);

  const add = {
    fetchGames: (search = ownProps.location.search) => {
      dispatch(fetchGames(search));
    },
  };

  Object.assign(actions, add);

  return { actions };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'GamesTable' })(GamesTable),
  );
