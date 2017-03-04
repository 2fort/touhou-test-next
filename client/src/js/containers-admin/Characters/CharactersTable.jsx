import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { domainHoc } from '../../ducks/domain';
import QueryStringHOC from '../Base/hocs/QueryStringHOC';
import * as ownActions from './CharactersTable.duck';
import { setMode, setCharId, openModal } from './CharFormModal.duck';
import { prepareFormData } from '../_sharedComponents/utils';
import { IMG_THUMBNAIL } from '../../config';

import CharFormModal from './CharFormModal';
import SortButton from '../Base/components/SortButton';
import Pagination from '../Base/components/Pagination';
import LimitSelect from '../Base/components/LimitSelect';
import EntitiesCounter from '../Base/components/EntitiesCounter';
import FilterPanel from '../Base/components/FilterPanel';

class CharactersTable extends Component {
  componentDidMount() {
    this.props.actions.fetchAllGames();
    this.props.actions.fetchCharacters();
  }

  cb = queryFunc => (...args) => {
    queryFunc(...args);
    this.props.qs.setQueryString();
    this.props.actions.fetchCharacters();
  }

  newCharBtnHandler = () => {
    this.props.modalActions.setMode('new');
    this.props.modalActions.openModal();
  }

  editCharBtnHandler = id => () => {
    this.props.modalActions.setMode('edit');
    this.props.modalActions.setCharId(id);
    this.props.modalActions.openModal();
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

  editCharModalSubmit = (values) => {
    return this.props.actions.editCharacter(values.id, values)
      .then(() => this.props.actions.fetchCharacters())
      .then(() => this.props.actions.editCharModalClose());
  }

  swapOrderBtnHandler = (id, num) => () => {
    this.props.actions.changeOrder(id, num)
      .then(() => this.props.actions.fetchCharacters());
  }

  render() {
    const { charsArray, gamesList, actions, allGames, component, qs, fetchedAt, total, query, filterFields,
      modalIsOpen, modalActions } = this.props;

    const Sort = props => <SortButton reduxField={query.sort} setSort={this.cb(component.setSort)} {...props} />;
    const nonOrderMode = !query.filter.link || !query.filter.link.rel;

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
            length={charsArray.length}
            total={total}
            fetchedAt={fetchedAt}
          >
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
                  <Sort field="link.order">
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
                }
                <td className="table-image text-center">
                  {char.image && <img alt={char.name} src={IMG_THUMBNAIL + char.image} />}
                </td>
                <td>
                  {char.link && char.link.rel && gamesList[char.link.rel].title}
                </td>
                <td className="toowide">
                  {char.art && char.art.author}
                </td>
                <td className="text-center">
                  <span title={char.id}>{char.id.substr(-11, 11)}</span>
                </td>
                <td className="tooshort">
                  {char.link && char.link.rel &&
                    <Link
                      target="_blank"
                      className="btn btn-default"
                      to={`/characters/${gamesList[char.link.rel].slug}/${char.slug}`}
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

        {modalIsOpen &&
          <CharFormModal
            cb={actions.fetchCharacters}
            allGames={allGames}
            queryRel={query.filter.link ? query.filter.link.rel : ''}
          />
        }
      </div>
    );
  }
}

CharactersTable.propTypes = {
  fetchedAt: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  charsArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  gamesList: PropTypes.objectOf(PropTypes.object).isRequired,
  allGames: PropTypes.objectOf(PropTypes.object).isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  query: PropTypes.shape({
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    sort: PropTypes.string.isRequired,
    filter: PropTypes.objectOf(PropTypes.any).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    fetchCharacters: PropTypes.func.isRequired,
    fetchAllGames: PropTypes.func.isRequired,
    deleteCharacter: PropTypes.func.isRequired,
  }).isRequired,
  modalActions: PropTypes.shape({
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
};

function mapStateToProps({ entities, domain: { charactersTable, charFormModal } }) {
  const charsArray = charactersTable.visible.map(char => entities.characters[char]);

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
    'link.rel': {
      type: 'select',
      label: 'Game',
      canBeBlank: true,
      select: {
        source: charactersTable.allGames,
        value: 'id',
        text: 'title',
      },
    },
  };

  return {
    ...charactersTable,
    filterFields,
    charsArray,
    gamesList: entities.games,
    modalIsOpen: charFormModal.open,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ownActions, dispatch),
    modalActions: bindActionCreators({ setMode, setCharId, openModal }, dispatch),
  };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'CharactersTable' })(
      QueryStringHOC(CharactersTable),
    ),
  );
