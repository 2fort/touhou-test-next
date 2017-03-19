import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Breadcrumb } from 'react-bootstrap';

import { domainHoc } from '../../../ducks/domain';
import QueryStringHOC from '../../Base/hocs/QueryStringHOC';
import * as ownActions from './duck';
import * as GameFormModalActions from '../modals/GameFormModal.duck';
import * as CharFormModalActions from '../../Characters/modals/CharFormModal.duck';
import { IMG_THUMBNAIL } from '../../../config';

import GameFormModal from '../modals/GameFormModal';
import CharFormModal from '../../Characters/modals/CharFormModal';
import SortButton from '../../Base/components/SortButton';
import Pagination from '../../Base/components/Pagination';
import LimitSelect from '../../Base/components/LimitSelect';
import EntitiesCounter from '../../Base/components/EntitiesCounter';
import FilterPanel from '../../Base/components/FilterPanel';

class GameCharactersTable extends Component {
  componentDidMount() {
    this.props.actions.setGameId(this.props.params.id);
    this.props.actions.fetchGameInfo();
    this.props.actions.fetchCharacters();
  }

  settingsBtnHandler = id => () => {
    this.props.gameModalActions.setMode('edit');
    this.props.gameModalActions.setGameId(id);
    this.props.gameModalActions.openModal();
  }

  cb = queryFunc => (...args) => {
    queryFunc(...args);
    this.props.qs.setQueryString();
    this.props.actions.fetchCharacters();
  }

  newCharBtnHandler = () => {
    this.props.charModalActions.setMode('new');
    this.props.charModalActions.openModal();
  }

  editCharBtnHandler = id => () => {
    this.props.charModalActions.setMode('edit');
    this.props.charModalActions.setCharId(id);
    this.props.charModalActions.openModal();
  }

  deleteCharBtnHandler = id => () => {
    this.props.actions.deleteCharacter(id)
      .then(() => this.props.actions.fetchCharacters());
  }

  swapOrderBtnHandler = (id, num) => () => {
    this.props.actions.changeOrder(id, num)
      .then(() => this.props.actions.fetchCharacters());
  }

  render() {
    const { charsArray, actions, gameInfo, component, qs, fetchedAt, total, query, filterFields,
      gameModalIsOpen, charModalIsOpen, params, router, activeRequests } = this.props;

    const Sort = props => <SortButton reduxField={query.sort} setSort={this.cb(component.setSort)} {...props} />;
    const pending = activeRequests > 0;

    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item href="#" onClick={() => router.push('/admin/games')}>
            Games
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            {gameInfo.title}
          </Breadcrumb.Item>
        </Breadcrumb>

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
            length={charsArray.length}
            total={total}
            fetchedAt={fetchedAt}
          >
            characters
          </EntitiesCounter>
        </div>
        <div className="pull-right">
          <button type="button" className="btn btn-primary" onClick={this.settingsBtnHandler(gameInfo.id)}>
            <i className="fa fa-cog" aria-hidden="true" /> Settings
          </button>
          {' '}
          <button type="button" className="btn btn-primary" onClick={this.newCharBtnHandler}>
            <i className="fa fa-plus" aria-hidden="true" /> Add character
          </button>
        </div>

        <table className="table table-striped table-game-chars">
          <thead>
            <tr>
              <th>
                <Sort field="name">Name</Sort>
              </th>
              <th className="text-center">
                <Sort field="link.order">
                  Order
                </Sort>
              </th>
              <th className="text-center">
                Image
              </th>
              <th>
                <Sort field="art.author">Art author</Sort>
              </th>
              <th className="text-center">
                <Sort field="published">Published</Sort>
              </th>
              <th className="text-center">
                <Sort field="_id">Id</Sort>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className={pending ? 'loading' : ''}>
            {charsArray[0] && charsArray.map((char, i) => (
              <tr key={char.name}>
                <td>
                  {char.name}
                </td>
                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.swapOrderBtnHandler(char.id, char.link.order - 1)}
                    disabled={char.link.order === 1}
                  >
                    <i className="fa fa-sort-asc" aria-hidden="true" />
                  </button>
                  {char.link.order}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.swapOrderBtnHandler(char.id, char.link.order + 1)}
                    disabled={char.link.order === total}
                  >
                    <i className="fa fa-sort-desc" aria-hidden="true" />
                  </button>
                </td>
                <td className="table-image text-center">
                  {char.image && <img alt={char.name} src={IMG_THUMBNAIL + char.image} />}
                </td>
                <td className="toowide">
                  {char.art && char.art.author}
                </td>
                <td className="text-center">
                  {char.published ? 'Yes' : 'No' }
                </td>
                <td className="text-center">
                  <span title={char.id}>{char.id.substr(-11, 11)}</span>
                </td>
                <td className="tooshort">
                  {char.link && char.link.rel &&
                    <Link
                      target="_blank"
                      className="btn btn-default"
                      to={`/browse/${gameInfo.slug}/${char.slug}`}
                    >
                      <i className="fa fa-eye" aria-hidden="true" />
                    </Link>
                  }
                  {' '}
                  <button type="button" className="btn btn-default" onClick={this.editCharBtnHandler(char.id)}>
                    <i className="fa fa-pencil fa-lg" aria-hidden="true" />
                  </button>
                  {' '}
                  <button type="button" className="btn btn-default" onClick={this.deleteCharBtnHandler(char.id)}>
                    <i className="fa fa-trash fa-lg" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination page={query.page} limit={query.limit} total={total} setPage={this.cb(component.setPage)} />

        {gameModalIsOpen &&
          <GameFormModal cb={actions.fetchGameInfo} />
        }

        {charModalIsOpen &&
          <CharFormModal cb={actions.fetchCharacters} queryRel={params.id} />
        }
      </div>
    );
  }
}

GameCharactersTable.propTypes = {
  activeRequests: PropTypes.number.isRequired,
  fetchedAt: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  charsArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  gameInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  gameModalIsOpen: PropTypes.bool.isRequired,
  charModalIsOpen: PropTypes.bool.isRequired,
  query: PropTypes.shape({
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    sort: PropTypes.string.isRequired,
    filter: PropTypes.objectOf(PropTypes.any).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    setGameId: PropTypes.func.isRequired,
    fetchCharacters: PropTypes.func.isRequired,
    fetchGameInfo: PropTypes.func.isRequired,
    deleteCharacter: PropTypes.func.isRequired,
    changeOrder: PropTypes.func.isRequired,
  }).isRequired,
  gameModalActions: PropTypes.shape({
    setMode: PropTypes.func.isRequired,
    setGameId: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  }).isRequired,
  charModalActions: PropTypes.shape({
    setMode: PropTypes.func.isRequired,
    setCharId: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  }).isRequired,
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
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ entities, domain: { gameCharactersTable, gameFormModal, charFormModal } }) {
  const charsArray = gameCharactersTable.visible.map(char => entities.characters[char]);

  const filterFields = {
    name: {
      type: 'text',
      label: 'Name',
      validation: ['minLength2'],
    },
    'art.author': {
      type: 'text',
      label: 'Art Author',
      canBeBlank: true,
    },
  };

  return {
    ...gameCharactersTable,
    filterFields,
    charsArray,
    gameModalIsOpen: gameFormModal.open,
    charModalIsOpen: charFormModal.open,
  };
}

function mapDispatchToProps(dispatch) {
  const GameModalActions = (function getGameModalActions() {
    const { setMode, setGameId, openModal } = GameFormModalActions;
    return { setMode, setGameId, openModal };
  }());

  const CharModalActions = (function getCharModalActions() {
    const { setMode, setCharId, openModal } = CharFormModalActions;
    return { setMode, setCharId, openModal };
  }());

  return {
    actions: bindActionCreators(ownActions, dispatch),
    gameModalActions: bindActionCreators(GameModalActions, dispatch),
    charModalActions: bindActionCreators(CharModalActions, dispatch),
  };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'GameCharactersTable' })(
      QueryStringHOC(GameCharactersTable),
    ),
  );
