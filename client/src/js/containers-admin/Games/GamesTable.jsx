import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { domainHoc } from '../../ducks/domain';
import QueryStringHOC from '../Base/hocs/QueryStringHOC';
import * as ownActions from './GamesTable.duck';
import { setMode, setGame, modalOpen } from './GameFormModal.duck';
import { IMG_THUMBNAIL } from '../../config';

import GameFormModal from './GameFormModal';
import SortButton from '../Base/components/SortButton';
import Pagination from '../Base/components/Pagination';
import LimitSelect from '../Base/components/LimitSelect';
import EntitiesCounter from '../Base/components/EntitiesCounter';
import FilterPanel from '../Base/components/FilterPanel';

class GamesTable extends Component {
  componentDidMount() {
    this.props.actions.fetchGames();
  }

  cb = queryFunc => (...args) => {
    queryFunc(...args);
    this.props.qs.setQueryString();
    this.props.actions.fetchGames();
  };

  newGameBtnHandler = () => {
    this.props.modalActions.setMode('new');
    this.props.modalActions.modalOpen();
  }

  editGameBtnHandler = id => () => {
    this.props.modalActions.setMode('edit');
    this.props.modalActions.setGame(id);
    this.props.modalActions.modalOpen();
  }

  deleteGameBtnHandler = id => () => {
    this.props.actions.deleteGame(id)
      .then(() => this.props.actions.fetchGames());
  }

  swapOrderBtnHandler = (id, num) => () => {
    this.props.actions.changeOrder(id, num)
      .then(() => this.props.actions.fetchGames());
  }

  render() {
    const { gamesArray, actions, component, qs, fetchedAt, total, query, filterFields } = this.props;

    const Sort = props => <SortButton reduxField={query.sort} setSort={this.cb(component.setSort)} {...props} />;

    return (
      <div>
        <FilterPanel
          initialValues={query.filter}
          filter={query.filter}
          setFilter={this.cb(component.setFilter)}
          qs={qs}
          filterFields={filterFields}
        />

        <div className="form-inline">
          <div className="form-group">
            <Pagination page={query.page} limit={query.limit} total={total} setPage={this.cb(component.setPage)} />
          </div>
          <div className="form-group">
            <label style={{ marginLeft: '15px' }} htmlFor="limit">Per page: </label> {' '}
            <LimitSelect setLimit={this.cb(component.setLimit)} limit={query.limit} />
          </div> {' '}
        </div>

        <div className="pull-left">
          <EntitiesCounter
            page={query.page}
            limit={query.limit}
            length={gamesArray.length}
            total={total}
            fetchedAt={fetchedAt}
          >
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
                  <Link to={`/admin/characters?filter[_game]=${game.id}`}>{game.title}</Link>
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
                  <button type="button" className="btn btn-default" onClick={this.editGameBtnHandler(game.id)}>
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

        <Pagination page={query.page} limit={query.limit} total={total} setPage={this.cb(component.setPage)} />

        {this.props.modalIsOpen &&
          <GameFormModal cb={actions.fetchGames} />
        }
      </div>
    );
  }
}

GamesTable.propTypes = {
  fetchedAt: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  query: PropTypes.shape({
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    sort: PropTypes.string.isRequired,
    filter: PropTypes.objectOf(PropTypes.any).isRequired,
  }).isRequired,
  gamesArray: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    prefix: PropTypes.string,
    year: PropTypes.number,
    cover: PropTypes.string,
    order: PropTypes.number.isRequired,
    chars: PropTypes.number,
  })).isRequired,
  actions: PropTypes.shape({
    fetchGames: PropTypes.func.isRequired,
    deleteGame: PropTypes.func.isRequired,
    changeOrder: PropTypes.func.isRequired,
  }).isRequired,
  modalActions: PropTypes.shape({
    setMode: PropTypes.func.isRequired,
    setGame: PropTypes.func.isRequired,
    modalOpen: PropTypes.func.isRequired,
  }).isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  component: PropTypes.shape({
    setSort: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
  }).isRequired,
  qs: PropTypes.shape({
    setQueryString: PropTypes.func.isRequired,
    flatten: PropTypes.func.isRequired,
    unflatten: PropTypes.func.isRequired,
    addFilter: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
  }).isRequired,
  filterFields: PropTypes.objectOf(PropTypes.object).isRequired,
};

function mapStateToProps({ domain: { gamesTable, gameFormModal }, entities: { games } }) {
  const gamesArray = gamesTable.visible.map(id => games[id]);

  const filterFields = {
    title: {
      type: 'text',
      label: 'Title',
      validation: ['minLength2'],
    },
    year: {
      type: 'text',
      label: 'Year',
      canBeBlank: true,
      validation: ['number'],
    },
  };

  return { ...gamesTable, modalIsOpen: gameFormModal.open, filterFields, gamesArray };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ownActions, dispatch),
    modalActions: bindActionCreators({ setMode, setGame, modalOpen }, dispatch),
  };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'GamesTable' })(
      QueryStringHOC(GamesTable),
    ),
  );
