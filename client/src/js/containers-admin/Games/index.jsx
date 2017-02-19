import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './duck';
import { prepareFormData, parseQuery } from '../_sharedComponents/utils';
import { IMG_THUMBNAIL } from '../../config';

import GameFormModal from './components/GameFormModal';
import GameFilterModal from './components/GameFilterModal';
import SortButton from '../Base/components/SortButton';
import Pagination from '../Base/components/Pagination';
import LimitSelect from '../Base/components/LimitSelect';
import ActiveFilters from '../Base/components/ActiveFilters';
import EntitiesCounter from '../Base/components/EntitiesCounter';

class GamesTable extends Component {
  componentWillMount() {
    const { location, component, actions } = this.props;

    const query = parseQuery(location.query);

    if (Object.keys(query).length > 0) {
      component.setQuery(query);
    }

    actions.updateQueryString();
    actions.fetchGames();
  }

  // then Games button pressed on NavPanel, add qs
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

  filterSubmit = (values) => {
    const cleanVal = {};

    Object.keys(values).forEach((key) => {
      if (values[key]) {
        cleanVal[key] = values[key];
      }
    });

    this.props.component.setFilter(cleanVal);
    this.props.actions.updateQueryString();
    this.props.actions.gameFilterModalClose();
    this.props.actions.fetchGames();
  }

  render() {
    const { gamesArray, actions, modals, component, domainState: { pending, total, query } } = this.props;
    const Sort = props => <SortButton reduxField={query.sort} setSort={this.setQuery(component.setSort)} {...props} />;

    return (
      <div>
        <button title="Add filter" type="button" className="btn btn-primary" onClick={actions.gameFilterModalOpen}>
          <i className="fa fa-filter" aria-hidden="true" /> Add filter
        </button>

        <ActiveFilters setFilter={this.setQuery(component.setFilter)} filters={query.filter} />

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
          <EntitiesCounter page={query.page} limit={query.limit} length={gamesArray.length} total={total} pending={pending}>
            games
          </EntitiesCounter>
        </div>
        <div className="pull-right">
          <button type="button" className="btn btn-primary" onClick={this.newGameBtnHandler}>
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
                  <Link to={`/admin/characters?_game=${game.id}`}>{game.title}</Link>
                </td>
                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.swapOrderBtnHandler(game.id, game.order - 1)}
                    disabled={game.order === 1}
                  >
                    <i className="fa fa-sort-asc" aria-hidden="true" />
                  </button>
                  {game.order}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.swapOrderBtnHandler(game.id, game.order + 1)}
                    disabled={game.order === total}
                  >
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
            getMaxOrder={actions.getGameWithMaxOrder}
            mode="new"
          />
        }

        {modals.editGameModalVisible &&
          <GameFormModal
            initialValues={modals.editFormInitValues}
            onSubmit={this.editGameModalSubmit}
            hide={actions.editGameModalClose}
            title="Edit Game"
            buttonName="Edit"
            getMaxOrder={actions.getGameWithMaxOrder}
            mode="edit"
          />
        }

        {modals.filterModalVisible &&
          <GameFilterModal
            initialValues={query.filter}
            onSubmit={this.filterSubmit}
            hide={actions.gameFilterModalClose}
          />
        }
      </div>
    );
  }
}

GamesTable.defaultProps = {
  gamesArray: [],
  modals: {},
  domainState: {

  },
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
  actions: PropTypes.shape({
    newGameModalOpen: PropTypes.func.isRequired,
    newGameModalClose: PropTypes.func.isRequired,
    editGameModalOpen: PropTypes.func.isRequired,
    editGameModalClose: PropTypes.func.isRequired,
    gameFilterModalOpen: PropTypes.func.isRequired,
    gameFilterModalClose: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
    editGame: PropTypes.func.isRequired,
    newGame: PropTypes.func.isRequired,
    deleteGame: PropTypes.func.isRequired,
    updateQueryString: PropTypes.func.isRequired,
    changeOrder: PropTypes.func.isRequired,
    getGameWithMaxOrder: PropTypes.func.isRequired,
  }).isRequired,
  component: PropTypes.shape({
    setSort: PropTypes.func.isRequired,
    setQuery: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
  }).isRequired,
  domainState: PropTypes.shape({
    pending: PropTypes.bool,
    visible: PropTypes.arrayOf(PropTypes.string),
    total: PropTypes.number,
    query: PropTypes.shape({
      page: PropTypes.number,
      limit: PropTypes.number,
      sort: PropTypes.string,
      filter: PropTypes.objectOf(PropTypes.any),
    }),
  }).isRequired,
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
      filterModalVisible: gamesTable.filterModalVisible,
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
