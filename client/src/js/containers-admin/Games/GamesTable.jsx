import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { domainHoc } from '../../ducks/domain';
import QueryStringHOC from '../Base/hocs/QueryStringHOC';
import * as ownActions from './GamesTable.duck';
import { setMode, setGameId, openModal } from './modals/GameFormModal.duck';

import GameFormModal from './modals/GameFormModal';
import { SortButton, Pagination, LimitSelect, EntitiesCounter, FilterPanel, SwapOrder, Ttools } from '../Base/components';

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
    this.props.modalActions.openModal();
  }

  editGameBtnHandler = id => () => {
    this.props.modalActions.setMode('edit');
    this.props.modalActions.setGameId(id);
    this.props.modalActions.openModal();
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
    const { gamesArray, actions, component, qs, fetchedAt, total, query, filterFields, modalIsOpen,
      activeRequests } = this.props;

    const Sort = props => <SortButton reduxField={query.sort} setSort={this.cb(component.setSort)} {...props} />;
    const pending = activeRequests > 0;

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
            <LimitSelect setLimit={this.cb(component.setLimit)} limit={query.limit} />
          </div>
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

        <Ttools.Table fixed className="table table-striped">
          <thead>
            <tr>
              <th>
                <Sort field="title">Title</Sort>
              </th>

              <Ttools.Th center>
                <Sort field="order">Order</Sort>
              </Ttools.Th>

              <Ttools.Th center>
                <Sort field="chars">Chars #</Sort>
              </Ttools.Th>

              <Ttools.Th center>
                Cover
              </Ttools.Th>

              <Ttools.Th center>
                <Sort field="prefix">Prefix</Sort>
              </Ttools.Th>

              <Ttools.Th center>
                <Sort field="year">Year</Sort>
              </Ttools.Th>

              <Ttools.Th center>
                <Sort field="_id">ID</Sort>
              </Ttools.Th>

              <th>
                Actions
              </th>
            </tr>
          </thead>

          <Ttools.Tbody pending={pending}>
            {gamesArray[0] && gamesArray.map((game, i) => (
              <tr key={game.id}>
                <Ttools.Td w={25}>
                  <Link to={`/admin/games/${game.id}/characters`}>{game.title}</Link>
                </Ttools.Td>

                <Ttools.Td w={10} center>
                  <SwapOrder id={game.id} order={game.order} total={total} orderFunc={this.swapOrderBtnHandler} />
                </Ttools.Td>

                <Ttools.Td w={10} center>
                  {game.chars}
                </Ttools.Td>

                <Ttools.Td w={10} center withImage>
                  {game.cover && <img alt={game.title} src={process.env.IMG_THUMBNAIL + game.cover} />}
                </Ttools.Td>

                <Ttools.Td w={10} center>
                  {game.prefix}
                </Ttools.Td>

                <Ttools.Td w={10} center>
                  {game.year}
                </Ttools.Td>

                <Ttools.Td w={10} center>
                  <span title={game.id}>{game.id.substr(-11, 11)}</span>
                </Ttools.Td>

                <Ttools.Td w={15}>
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
                </Ttools.Td>
              </tr>
            ))}
          </Ttools.Tbody>
        </Ttools.Table>

        <Pagination page={query.page} limit={query.limit} total={total} setPage={this.cb(component.setPage)} />

        {modalIsOpen &&
          <GameFormModal cb={actions.fetchGames} />
        }
      </div>
    );
  }
}

GamesTable.propTypes = {
  activeRequests: PropTypes.number.isRequired,
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
    setGameId: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
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
    modalActions: bindActionCreators({ setMode, setGameId, openModal }, dispatch),
  };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'GamesTable' })(
      QueryStringHOC(GamesTable),
    ),
  );
