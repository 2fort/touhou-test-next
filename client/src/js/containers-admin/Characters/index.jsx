import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './duck';
import { prepareFormData } from '../_sharedComponents/utils';
import { IMG_THUMBNAIL } from '../../config';

import CharFormModal from './components/CharFormModal';

class CharactersTable extends Component {
  componentWillMount() {
    this.props.actions.fetchAllCharacters();
  }

  newCharBtnHandler = () => {
    this.props.actions.fetchAllGames()
      .then(() => { this.props.actions.newCharModalOpen(); });
  }

  editCharBtnHandler = char => () => {
    this.props.actions.fetchAllGames()
      .then(() => { this.props.actions.editCharModalOpen(char); });
  }

  deleteCharBtnHandler = id => () => {
    this.props.actions.deleteCharacter(id)
      .then(() => this.props.actions.fetchAllCharacters());
  }

  newCharModalSubmit = ({ fileImage, ...values }) => {
    const formDataValues = prepareFormData(values, fileImage, 'image');

    return this.props.actions.newCharacter(formDataValues)
      .then(() => this.props.actions.fetchAllCharacters())
      .then(() => this.props.actions.newCharModalClose());
  }

  editCharModalSubmit = ({ fileImage, ...values }) => {
    const formDataValues = prepareFormData(values, fileImage, 'image');

    return this.props.actions.editCharacter(values.id, formDataValues)
      .then(() => this.props.actions.fetchAllCharacters())
      .then(() => this.props.actions.editCharModalClose());
  }

  render() {
    const { charsArray, gamesList, actions, modals } = this.props;

    return (
      <div>
        <button type="button" className="btn btn-primary" onClick={this.newCharBtnHandler}>
          Add new character
        </button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Game</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {charsArray[0] && charsArray.map((char, i) => (
              <tr key={char.name}>
                <td><strong>{i + 1}</strong></td>
                <td className="table-image">
                  {char.image && <img alt={char.name} src={IMG_THUMBNAIL + char.image} />}
                </td>
                <td>{char.name}</td>
                <td>
                  {char._game && gamesList[char._game].title}
                </td>
                <td className="tooshort">
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

        {modals.newCharModalVisible &&
          <CharFormModal
            onSubmit={this.newCharModalSubmit}
            hide={actions.newCharModalClose}
            title="New Character"
            buttonName="Create"
            gamesList={gamesList}
          />
        }

        {modals.editCharModalVisible &&
          <CharFormModal
            initialValues={modals.editFormInitValues}
            onSubmit={this.editCharModalSubmit}
            hide={actions.editCharModalClose}
            title="Edit Character"
            buttonName="Edit"
            gamesList={gamesList}
          />
        }
      </div>
    );
  }
}

CharactersTable.defaultProps = {
  charsArray: [],
  gamesList: {},
  modals: {},
};

CharactersTable.propTypes = {
  charsArray: PropTypes.arrayOf(PropTypes.object),
  gamesList: PropTypes.objectOf(PropTypes.object),
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
    fetchAllCharacters: PropTypes.func.isRequired,
    fetchAllGames: PropTypes.func.isRequired,
    editCharacter: PropTypes.func.isRequired,
    newCharacter: PropTypes.func.isRequired,
    deleteCharacter: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ entities, domain: { charactersTable } }) {
  if (!charactersTable) return { };

  const charsArray = charactersTable.visible.map(char => entities.characters[char]);

  return {
    charsArray,
    gamesList: entities.games,
    modals: {
      newCharModalVisible: charactersTable.newCharModalVisible,
      editCharModalVisible: charactersTable.editCharModalVisible,
      editFormInitValues: charactersTable.editFormInitValues,
    },
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
