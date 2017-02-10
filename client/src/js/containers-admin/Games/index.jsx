import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './duck';
import { prepareFormData } from '../_sharedComponents/utils';
import { IMG_THUMBNAIL } from '../../config';

import GameFormModal from './components/GameFormModal';
import SortButton from './components/SortButton';
import Pagination from '../Base/components/Pagination';
import LimitSelect from './components/LimitSelect';

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

  swapOrderBtnHandler = (id, num) => () => {
    if (num === 0) return;

    this.props.actions.changeOrder(id, num)
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
        <button title="Add filter" type="button" className="btn btn-primary">
          <i className="fa fa-filter" aria-hidden="true" /> Add filter
        </button>
        <div className="form-inline">
          <div className="form-group">
            <Pagination page={query.page} limit={query.limit} total={total} setPage={this.setQuery(component.setPage)} />
          </div>
          <div className="form-group">
            <label style={{ marginLeft: '15px' }} htmlFor="limit">Per page: </label> {' '}
            <LimitSelect setLimit={this.setQuery(component.setLimit)} limit={query.limit} />
          </div> {' '}
        </div>

        <div className="pull-left">
          <h4>{(query.page * query.limit <= total ? query.page * query.limit : total)} / <strong>{total}</strong> games</h4>
        </div>
        <div className="pull-right">
          <button title="New game" type="button" className="btn btn-primary" onClick={this.newGameBtnHandler}>
            <i className="fa fa-plus" aria-hidden="true" /> Add game
          </button>
        </div>

        <table className="table table-striped games-table">
          <thead>
            <tr>
              <th>
                <Sort field="title">Title</Sort>
              </th>
              <th className="text-center">
                <Sort field="order">Order</Sort>
              </th>
              <th className="text-center">
                <Sort field="chars">Chars #</Sort>
              </th>
              <th className="text-center">
                Cover
              </th>
              <th className="text-center">
                <Sort field="prefix">Prefix</Sort>
              </th>
              <th className="text-center">
                <Sort field="year">Year</Sort>
              </th>
              <th className="text-center">
                <Sort field="_id">ID</Sort>
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {gamesArray[0] && gamesArray.map((game, i) => (
              <tr key={game.id}>
                <td>
                  <Link to={`/admin/games/${game.id}`}>{game.title}</Link>
                </td>
                <td className="text-center">
                  <button type="button" className="btn btn-link" onClick={this.swapOrderBtnHandler(game.id, game.order - 1)}>
                    <i className="fa fa-sort-asc" aria-hidden="true" />
                  </button>
                  {game.order}
                  <button type="button" className="btn btn-link" onClick={this.swapOrderBtnHandler(game.id, game.order + 1)}>
                    <i className="fa fa-sort-desc" aria-hidden="true" />
                  </button>
                </td>
                <td className="text-center">
                  {game.chars}
                </td>
                <td className="text-center table-image">
                  {game.cover && <img alt={game.title} src={IMG_THUMBNAIL + game.cover} />}
                </td>
                <td className="text-center">
                  {game.prefix}
                </td>
                <td className="text-center">
                  {game.year}
                </td>
                <td className="text-center">
                  <span title={game.id}>{game.id.substr(-11, 11)}</span>
                </td>
                <td>
                  <Link target="_blank" className="btn btn-default" to={`/characters/${game.slug}`}>
                    <i className="fa fa-eye" aria-hidden="true" />
                  </Link>
                  {' '}
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
          </tbody>
        </table>

        <Pagination page={query.page} limit={query.limit} total={total} setPage={this.setQuery(component.setPage)} />

        {modals.newGameModalVisible &&
          <GameFormModal
            onSubmit={this.newGameModalSubmit}
            hide={actions.newGameModalClose}
            title="New Game"
            buttonName="Create"
            total={total + 1}
          />
        }

        {modals.editGameModalVisible &&
          <GameFormModal
            initialValues={modals.editFormInitValues}
            onSubmit={this.editGameModalSubmit}
            hide={actions.editGameModalClose}
            title="Edit Game"
            buttonName="Edit"
            total={total}
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
  gamesArray: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    prefix: PropTypes.string,
    year: PropTypes.number,
    cover: PropTypes.string,
    order: PropTypes.number.isRequired,
    chars: PropTypes.number,
  })),
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
    changeOrder: PropTypes.func.isRequired,
  }).isRequired,
  component: PropTypes.shape({
    setSort: PropTypes.func.isRequired,
    setQuery: PropTypes.func.isRequired,
  }).isRequired,
  query: PropTypes.shape({
    page: PropTypes.number,
    limit: PropTypes.number,
    sort: PropTypes.string,
    filter: PropTypes.objectOf(PropTypes.any),
  }),
  location: PropTypes.shape({
    query: PropTypes.shape({
      page: PropTypes.string,
      limit: PropTypes.string,
      sort: PropTypes.string,
      filter: PropTypes.objectOf(PropTypes.string),
    }),
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
