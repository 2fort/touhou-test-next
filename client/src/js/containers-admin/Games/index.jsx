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
    const { sort, filter, page, limit } = this.props.location.query;

    const query = Object.assign(
      {}, sort && { sort }, filter && { filter }, page && { page: Number(page) }, limit && { limit: Number(limit) },
    );

    if (Object.keys(query).length > 0) {
      this.props.component.setQuery(query);
      this.props.actions.updateQueryString();
    } else {
      this.props.actions.updateQueryString();
    }

    this.props.actions.fetchGames();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location.search === '') {
      // this.props.component.setQuery({ sort: '_id', filter: {}, page: 1, limit: 10 });
      this.props.actions.updateQueryString();
    }
  }

  setQuery = queryFunc => (...args) => {
    queryFunc(...args);
    this.props.actions.updateQueryString();
    this.props.actions.fetchGames();
  };

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
    const { gamesArray, actions, modals, total, query, component } = this.props;

    const Sort = props => <SortButton reduxField={query.sort} setSort={this.setQuery(component.setSort)} {...props} />;

    return (
      <div>
        <button type="button" className="btn btn-primary" onClick={this.newGameBtnHandler}>
          Add new game
        </button>
        <br />

        <Pagination page={query.page} limit={query.limit} total={total} setPage={this.setQuery(component.setPage)} />

        <table className="table table-striped games-table">
          <thead>
            <tr>
              <th><Sort field="_id" def>ID</Sort></th>
              <th>Order</th>
              <th>Cover</th>
              <th><Sort field="title">Title</Sort></th>
              <th><Sort field="prefix">Prefix</Sort></th>
              <th><Sort field="year">Year</Sort></th>
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

        <Pagination page={query.page} limit={query.limit} total={total} setPage={this.setQuery(component.setPage)} />

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
  query: {},
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
    updateQueryString: PropTypes.func.isRequired,
  }).isRequired,
  component: PropTypes.shape({
    setSort: PropTypes.func.isRequired,
    setQuery: PropTypes.func.isRequired,
  }).isRequired,
  query: PropTypes.shape({
    page: PropTypes.number,
    limit: PropTypes.number,
    sort: PropTypes.string,
    filter: PropTypes.any,
  }),
  location: PropTypes.shape({
    query: PropTypes.object,
  }).isRequired,
};

function mapStateToProps({ domain: { gamesTable }, entities: { games } }) {
  if (!gamesTable) return { };

  const gamesArray = gamesTable.visible.map(id => games[id]);

  return {
    gamesArray,
    modals: {
      newGameModalVisible: gamesTable.newGameModalVisible,
      editGameModalVisible: gamesTable.editGameModalVisible,
      editFormInitValues: gamesTable.editFormInitValues,
    },
    total: gamesTable.total,
    query: gamesTable.query,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ownActions, dispatch) };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'GamesTable' })(GamesTable),
  );
