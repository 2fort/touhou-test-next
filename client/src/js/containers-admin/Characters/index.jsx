import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './duck';
import { prepareFormData, parseQuery } from '../_sharedComponents/utils';
import { IMG_THUMBNAIL } from '../../config';

import CharFormModal from './components/CharFormModal';
import CharFilterModal from './components/CharFilterModal';
import SortButton from '../Base/components/SortButton';
import Pagination from '../Base/components/Pagination';
import LimitSelect from '../Base/components/LimitSelect';
import ActiveFilters from '../Base/components/ActiveFilters';

class CharactersTable extends Component {
  componentWillMount() {
    const { location, component, actions } = this.props;
    const query = parseQuery(location.query);

    if (Object.keys(query).length > 0) {
      component.setQuery(query);
    }

    if (location.query._game) {
      actions.changeCurrentGame(location.query._game);
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

  filterSubmit = (values) => {
    const cleanVal = {};

    Object.keys(values).forEach((key) => {
      if (values[key]) {
        cleanVal[key] = values[key];
      }
    });

    this.props.component.setFilter(cleanVal);
    this.props.actions.updateQueryString();
    this.props.actions.charFilterModalClose();
    this.props.actions.fetchCharacters();
  }

  render() {
    const { charsArray, gamesList, currentGame, actions, modals, query, total, allGames, component } = this.props;

    const Sort = props => <SortButton reduxField={query.sort} setSort={this.setQuery(component.setSort)} {...props} />;
    const nonOrderMode = !currentGame || currentGame === '[!uncategorized]';

    const gameOptions = allGames.map(game => (
      <option key={game.title} value={game.id}>{game.title}</option>
    ));

    return (
      <div>
        <div className="form-inline" style={{ marginBottom: '15px' }}>
          <div className="form-group">
            <label htmlFor="game">Game</label>{' '}
            <select className="form-control" value={currentGame} onChange={this.setQuery(actions.changeCurrentGame)}>
              <option value="">All</option>
              <option value="[!uncategorized]">Uncategorized</option>
              <option disabled>──────────</option>
              {gameOptions}
            </select>
          </div>
        </div>

        <button title="Add filter" type="button" className="btn btn-primary" onClick={actions.charFilterModalOpen}>
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
          <h4>{charsArray.length} / <strong>{total}</strong> characters</h4>
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
                  <td className="text-center">{char._order}</td>
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
                  <button type="button" className="btn btn-default" onClick={this.deleteCharBtnHandler(char)}>
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
            initialValues={{ _game: currentGame }}
            onSubmit={this.newCharModalSubmit}
            hide={actions.newCharModalClose}
            title="New Character"
            buttonName="Create"
            allGames={allGames}
            charsArray={charsArray}
            getMaxOrder={actions.getCharWithMaxOrder}
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
            mode="edit"
          />
        }

        {modals.filterModalVisible &&
          <CharFilterModal
            initialValues={query.filter}
            onSubmit={this.filterSubmit}
            hide={actions.charFilterModalClose}
          />
        }
      </div>
    );
  }
}

CharactersTable.defaultProps = {
  charsArray: [],
  gamesList: {},
  allGames: [],
  currentGame: '',
  total: 0,
  modals: {},
  query: {
    filter: {},
  },
};

CharactersTable.propTypes = {
  charsArray: PropTypes.arrayOf(PropTypes.object),
  gamesList: PropTypes.objectOf(PropTypes.object),
  allGames: PropTypes.arrayOf(PropTypes.object),
  currentGame: PropTypes.string,
  total: PropTypes.number,
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
    changeCurrentGame: PropTypes.func.isRequired,
    editCharacter: PropTypes.func.isRequired,
    newCharacter: PropTypes.func.isRequired,
    deleteCharacter: PropTypes.func.isRequired,
    updateQueryString: PropTypes.func.isRequired,
    charFilterModalOpen: PropTypes.func.isRequired,
    charFilterModalClose: PropTypes.func.isRequired,
  }).isRequired,
  component: PropTypes.shape({
    setSort: PropTypes.func.isRequired,
    setQuery: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
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
    currentGame: charactersTable.currentGame,
    modals: {
      newCharModalVisible: charactersTable.newCharModalVisible,
      editCharModalVisible: charactersTable.editCharModalVisible,
      editFormInitValues: charactersTable.editFormInitValues,
      filterModalVisible: charactersTable.filterModalVisible,
    },
    total: charactersTable.total,
    query: charactersTable.query,
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
