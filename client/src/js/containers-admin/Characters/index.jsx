import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './duck';
import { prepareFormData, parseQuery } from '../_sharedComponents/utils';
import { IMG_THUMBNAIL } from '../../config';

import CharFormModal from './components/CharFormModal';
import SortButton from '../Base/components/SortButton';
import Pagination from '../Base/components/Pagination';
import LimitSelect from '../Base/components/LimitSelect';
import EntitiesCounter from '../Base/components/EntitiesCounter';
import FilterPanel from './components/FilterPanel';

class CharactersTable extends Component {
  componentWillMount() {
    const { location, component, actions } = this.props;

    const query = parseQuery(location.query);

    if (Object.keys(query).length > 0) {
      component.setQuery(query);
    }

    actions.updateQueryString();
    actions.fetchAllGames();
    actions.fetchCharacters();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location.search === '') {
      this.props.actions.updateQueryString();
    }
  }

  setQuery = queryFunc => (...args) => {
    queryFunc(...args);
    this.props.actions.updateQueryString();
    this.props.actions.fetchCharacters();
  };

  newCharBtnHandler = () => {
    this.props.actions.newCharModalOpen();
  }

  editCharBtnHandler = char => () => {
    this.props.actions.editCharModalOpen(char);
  }

  deleteCharBtnHandler = id => () => {
    this.props.actions.deleteCharacter(id)
      .then(() => this.props.actions.fetchCharacters());
  }

  newCharModalSubmit = ({ fileImage, ...values }) => {
    const formDataValues = prepareFormData(values, fileImage, 'image');

    return this.props.actions.newCharacter(formDataValues)
      .then(() => this.props.actions.fetchCharacters())
      .then(() => this.props.actions.newCharModalClose());
  }

  editCharModalSubmit = ({ fileImage, ...values }) => {
    const formDataValues = prepareFormData(values, fileImage, 'image');

    return this.props.actions.editCharacter(values.id, formDataValues)
      .then(() => this.props.actions.fetchCharacters())
      .then(() => this.props.actions.editCharModalClose());
  }

  swapOrderBtnHandler = (id, num) => () => {
    this.props.actions.changeOrder(id, num)
      .then(() => this.props.actions.fetchCharacters());
  }

  render() {
    const { charsArray, gamesList, actions, modals, filterPanelOpen, allGames,
      component, domainState: { pending, total, query } } = this.props;

    const Sort = props => <SortButton reduxField={query.sort} setSort={this.setQuery(component.setSort)} {...props} />;
    const nonOrderMode = !query.filter._game;

    return (
      <div>
        <FilterPanel
          filterPanelOpen={filterPanelOpen}
          openTrigger={actions.charFilterPanelTrigger}
          nameSearchExp={actions.nameSearchExp}
          initialValues={query.filter}
          setFilter={this.setQuery(component.setFilter)}
          allGames={allGames}
        />

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
          <EntitiesCounter page={query.page} limit={query.limit} length={charsArray.length} total={total} pending={pending}>
            characters
          </EntitiesCounter>
        </div>
        <div className="pull-right">
          <button type="button" className="btn btn-primary" onClick={this.newCharBtnHandler}>
            <i className="fa fa-plus" aria-hidden="true" /> Add character
          </button>
        </div>

        <table className={nonOrderMode ? 'table table-striped table-chars' : 'table table-striped table-order-chars'}>
          <thead>
            <tr>
              <th>
                <Sort field="name">Name</Sort>
              </th>
              {nonOrderMode ||
                <th className="text-center">
                  <Sort field="_order">
                    Order
                  </Sort>
                </th>
              }
              <th className="text-center">
                Image
              </th>
              <th>
                <Sort field="game">Game</Sort>
              </th>
              <th>
                <Sort field="art.author">Art author</Sort>
              </th>
              <th className="text-center">
                <Sort field="_id">Id</Sort>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {charsArray[0] && charsArray.map((char, i) => (
              <tr key={char.name}>
                <td>
                  {char.name}
                </td>
                {nonOrderMode ||
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={this.swapOrderBtnHandler(char.id, char._order - 1)}
                      disabled={char._order === 1}
                    >
                      <i className="fa fa-sort-asc" aria-hidden="true" />
                    </button>
                    {char._order}
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={this.swapOrderBtnHandler(char.id, char._order + 1)}
                      disabled={char._order === total}
                    >
                      <i className="fa fa-sort-desc" aria-hidden="true" />
                    </button>
                  </td>
                }
                <td className="table-image text-center">
                  {char.image && <img alt={char.name} src={IMG_THUMBNAIL + char.image} />}
                </td>
                <td>
                  {char._game && gamesList[char._game].title}
                </td>
                <td className="toowide">
                  {char.art.author}
                </td>
                <td className="text-center">
                  <span title={char.id}>{char.id.substr(-11, 11)}</span>
                </td>
                <td className="tooshort">
                  {char._game &&
                    <Link
                      target="_blank"
                      className="btn btn-default"
                      to={`/characters/${gamesList[char._game].slug}/${char.slug}`}
                    >
                      <i className="fa fa-eye" aria-hidden="true" />
                    </Link>
                  }
                  {' '}
                  <button type="button" className="btn btn-default" onClick={this.editCharBtnHandler(char)}>
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

        <Pagination page={query.page} limit={query.limit} total={total} setPage={this.setQuery(component.setPage)} />

        {modals.newCharModalVisible &&
          <CharFormModal
            initialValues={{ _game: query.filter._game }}
            onSubmit={this.newCharModalSubmit}
            hide={actions.newCharModalClose}
            title="New Character"
            buttonName="Create"
            allGames={allGames}
            charsArray={charsArray}
            getMaxOrder={actions.getCharWithMaxOrder}
            getCharsFromGame={actions.getCharsFromGame}
            mode="new"
          />
        }

        {modals.editCharModalVisible &&
          <CharFormModal
            initialValues={modals.editFormInitValues}
            onSubmit={this.editCharModalSubmit}
            hide={actions.editCharModalClose}
            title="Edit Character"
            buttonName="Edit"
            allGames={allGames}
            charsArray={charsArray}
            getMaxOrder={actions.getCharWithMaxOrder}
            getCharsFromGame={actions.getCharsFromGame}
            mode="edit"
          />
        }
      </div>
    );
  }
}

CharactersTable.defaultProps = {
  charsArray: [],
  gamesList: {},
  allGames: {},
  filterPanelOpen: false,
  total: 0,
  modals: {},
  query: {
    filter: {},
  },
};

CharactersTable.propTypes = {
  charsArray: PropTypes.arrayOf(PropTypes.object),
  gamesList: PropTypes.objectOf(PropTypes.object),
  allGames: PropTypes.objectOf(PropTypes.object),
  filterPanelOpen: PropTypes.bool,
  modals: PropTypes.shape({
    newCharModalVisible: PropTypes.bool,
    editCharModalVisible: PropTypes.bool,
    editFormInitValues: PropTypes.object,
  }),
  actions: PropTypes.shape({
    newCharModalOpen: PropTypes.func.isRequired,
    newCharModalClose: PropTypes.func.isRequired,
    editCharModalOpen: PropTypes.func.isRequired,
    editCharModalClose: PropTypes.func.isRequired,
    fetchCharacters: PropTypes.func.isRequired,
    fetchAllGames: PropTypes.func.isRequired,
    changeOrder: PropTypes.func.isRequired,
    editCharacter: PropTypes.func.isRequired,
    newCharacter: PropTypes.func.isRequired,
    deleteCharacter: PropTypes.func.isRequired,
    updateQueryString: PropTypes.func.isRequired,
    charFilterPanelTrigger: PropTypes.func.isRequired,
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
      filter: PropTypes.objectOf(PropTypes.any),
    }),
  }).isRequired,
};

function mapStateToProps({ entities, domain: { charactersTable } }) {
  if (!charactersTable) return { };

  const charsArray = charactersTable.visible.map(char => entities.characters[char]);

  return {
    charsArray,
    gamesList: entities.games,
    allGames: charactersTable.allGames,
    modals: {
      newCharModalVisible: charactersTable.newCharModalVisible,
      editCharModalVisible: charactersTable.editCharModalVisible,
      editFormInitValues: charactersTable.editFormInitValues,
    },
    filterPanelOpen: charactersTable.filterPanelOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ownActions, dispatch),
  };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'CharactersTable' })(CharactersTable),
  );
