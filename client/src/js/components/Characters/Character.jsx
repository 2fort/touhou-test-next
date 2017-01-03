import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { fetchCharacter, fetchCharacterBegin, purgeCache } from '../../actions/asyncActions';

class Character extends Component {
  static onEnter(dispatch) {
    dispatch(fetchCharacterBegin());
  }

  static onLeave(dispatch) {
    dispatch(purgeCache());
  }

  componentWillMount() {
    this.props.getCharacter(this.props.params.char);
  }

  render() {
    const { characters, fetchInProgress } = this.props;

    if (fetchInProgress) {
      return null;
    }

    const character = Object.values(characters)[0];

    return (
      <div itemScope itemType="http://schema.org/Person" className="singlechar">
        <Helmet title={character.name} />

        <h1 itemProp="name">{character.name}</h1>
        <div className="singlechar-flex">
          <div>
            <img itemProp="image" alt="char" src={`/images/m/${character.image}`} />
          </div>
          <div>
            <p>Character info: <a itemProp="sameAs" href={character.wiki}>{character.wiki.substring(7)}</a></p>
            <p>Illustration author: <a href={character.art.url}> {character.art.author}</a></p>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ store: { characters, fetchInProgress } }) {
  return { characters, fetchInProgress };
}

function mapDispatchToProps(dispatch) {
  return {
    getCharacter: (char) => {
      dispatch(fetchCharacter(char));
    },
  };
}

Character.propTypes = {
  params: PropTypes.shape({
    char: PropTypes.string,
  }),
  characters: PropTypes.objectOf(PropTypes.object),
  getCharacter: PropTypes.func,
  fetchInProgress: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Character);
