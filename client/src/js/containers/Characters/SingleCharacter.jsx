import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import CharNavButton from './components/CharNavButton';
import { fetchCharacter } from '../../actions/charactersActions';

class SingleCharacter extends Component {
  componentDidMount() {
    this.props.actions.didMount();
    this.props.actions.getCharacter(this.props.params.char);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.char !== nextProps.params.char) {
      this.props.actions.getCharacter(nextProps.params.char);
    }
  }

  componentWillUnmount() {
    this.props.actions.willUnmount();
  }

  render() {
    const { character, state } = this.props;

    if (!state.active || state.pending) return null;

    return (
      <div itemScope itemType="http://schema.org/Person" className="singlechar">
        <Helmet title={character.name} />

        <h1 itemProp="name">{character.name}</h1>

        <div className="singlechar-container">
          <CharNavButton game={character._game} char={character.prevCharacter}>&nbsp;&lt;&nbsp;</CharNavButton>

          <div className="singlechar-flex">
            <div className="singlechar-img">
              <img itemProp="image" alt="char" src={`/images/m/${character.image}`} />
            </div>
            <div className="singlechar-desc">
              <p>Character info: <a itemProp="sameAs" href={character.wiki}>{character.wiki.substring(7)}</a></p>
              <p>Illustration author: <a href={character.art.url}> {character.art.author}</a></p>
            </div>
          </div>

          <CharNavButton game={character._game} char={character.nextCharacter}>&nbsp;&gt;&nbsp;</CharNavButton>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ domain: { singleCharacter }, entities: { characters } }) {
  const state = { active: false, pending: false };

  if (!singleCharacter) return { state };

  state.active = singleCharacter.active;
  state.pending = singleCharacter.pending;

  if (!state.active || state.pending) return { state };

  const character = singleCharacter.visible.map(slug => characters[slug])[0];
  return { character, state };
}

function mapDispatchToProps(dispatch) {
  const component = 'SingleCharacter';
  return {
    actions: {
      didMount: () => {
        dispatch({
          type: 'COMPONENT_MOUNT',
          component,
        });
      },
      willUnmount: () => {
        dispatch({
          type: 'COMPONENT_DESTROY',
          component,
        });
      },
      getCharacter: (char) => {
        dispatch(fetchCharacter(char, component));
      },
    },
  };
}

SingleCharacter.propTypes = {
  params: PropTypes.shape({
    char: PropTypes.string,
  }),
  actions: PropTypes.shape({
    didMount: PropTypes.func,
    willUnmount: PropTypes.func,
    getCharacter: PropTypes.func,
  }),
  state: PropTypes.shape({
    active: PropTypes.bool,
    pending: PropTypes.bool,
  }),
  character: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    wiki: PropTypes.string,
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleCharacter);
