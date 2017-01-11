import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { TopContainer, Breadcrumbs, CharNavButton } from './components';
import { fetchCharacter } from '../../actions/charactersActions';
import Fetch404 from '../Base/Fetch404';

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
    const { character, ready, params } = this.props;

    if (!ready) return null;
    if (!character) return <Fetch404 title={'Character not found!'}>Character not found!</Fetch404>;

    return (
      <div>
        <TopContainer>
          <Breadcrumbs params={params} />
        </TopContainer>

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
      </div>
    );
  }
}

SingleCharacter.defaultProps = {
  character: undefined,
};

SingleCharacter.propTypes = {
  params: PropTypes.shape({
    char: PropTypes.string.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    didMount: PropTypes.func.isRequired,
    willUnmount: PropTypes.func.isRequired,
    getCharacter: PropTypes.func.isRequired,
  }).isRequired,
  ready: PropTypes.bool.isRequired,
  character: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    wiki: PropTypes.string.isRequired,
    art: PropTypes.shape({
      author: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

function mapStateToProps({ domain: { singleCharacter }, entities: { characters } }) {
  if (!singleCharacter || singleCharacter.pending) return { ready: false };

  const character = singleCharacter.visible.map(slug => characters[slug])[0];
  return { ready: true, character };
}

function mapDispatchToProps(dispatch) {
  const component = 'SingleCharacter';
  return {
    actions: {
      didMount: () => {
        dispatch({
          type: 'CONTAINER_MOUNT',
          component,
        });
      },
      willUnmount: () => {
        dispatch({
          type: 'CONTAINER_DESTROY',
          component,
        });
      },
      getCharacter: (char) => {
        dispatch(fetchCharacter(char, component));
      },
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleCharacter);
