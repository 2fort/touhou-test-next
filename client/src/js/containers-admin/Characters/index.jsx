import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './duck';
import { IMG_THUMBNAIL } from '../../config';

import CharFormModal from './components/CharFormModal';

class CharactersTable extends Component {
  componentWillMount() {
    this.props.actions.fetchAllCharacters();
  }

  newCharBtnHandler = () => {
    this.props.actions.newCharModalOpen();
  }

  editCharBtnHandler = char => () => {
    this.props.actions.editCharModalOpen(char);
  }

  deleteCharBtnHandler = char => () => {
    this.props.actions.deleteCharacter(char)
      .then(() => this.props.actions.fetchAllCharacters());
  }

  newCharModalSubmit = (values) => {
    const { actions } = this.props;
    const newValues = new FormData();

    newValues.append('payload', JSON.stringify(values));

    if (values.image && values.image[0]) {
      newValues.append('image', values.image[0], values.image[0].name);
    }

    return actions.newGame(newValues)
      .then(() => actions.fetchAllGames())
      .then(() => actions.newGameModalClose());
  }

  editCharModalSubmit = (values) => {
    const { actions } = this.props;
    const newValues = new FormData();

    newValues.append('payload', JSON.stringify(values));

    if (values.cover && typeof values.cover === 'object' && values.cover[0]) {
      newValues.append('cover', values.cover[0], values.cover[0].name);
    }

    return actions.editGame(newValues)
      .then(() => actions.fetchAllGames())
      .then(() => actions.editGameModalClose());
  }

  render() {
    const { charsArray, gamesList, actions, modals } = this.props;

    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>name / slug</th>
              <th>image</th>
              <th>game</th>
              <th>wiki</th>
              <th>art author</th>
              <th>art url</th>
              <th>actions</th>
            </tr>
            {charsArray[0] && charsArray.map((char, i) => (
              <tr key={char.name}>
                <td>{char.name}<br /><h6>{char.slug}</h6></td>
                <td className="table-image">
                  {char.image && <img alt={char.name} src={IMG_THUMBNAIL + char.image} />}
                </td>
                <td>
                  {char._game && gamesList[char._game].title}
                </td>
                <td className="toowide">{char.wiki}</td>
                <td>{char.art.author}</td>
                <td className="toowide">{char.art.url}</td>
                <td>
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
          </thead>
        </table>

        {modals.newCharModalVisible &&
          <CharFormModal
            onSubmit={this.newGameModalSubmit}
            hide={actions.newCharModalClose}
            title="New Character"
            buttonName="Create"
          />
        }

        {modals.editCharModalVisible &&
          <CharFormModal
            initialValues={modals.editFormInitValues}
            onSubmit={this.editGameModalSubmit}
            hide={actions.editCharModalClose}
            title="Edit Character"
            buttonName="Edit"
          />
        }
      </div>
    );
  }
}

CharactersTable.defaultProps = {
  charsArray: [],
  gamesList: [],
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
    editCharacter: PropTypes.func.isRequired,
    newCharacter: PropTypes.func.isRequired,
    deleteCharacter: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ entities, domain: { charactersTable } }) {
  if (!charactersTable || charactersTable.pending) return { ready: false };

  const charsArray = charactersTable.visible.map(char => entities.characters[char]);
  // const charsArray = charactersArray.map(char => ({ ...char, gameTitle: entities.games[char._game].title }));

  return { ready: true, charsArray, gamesList: entities.games };
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
