import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import { TopContainer, Breadcrumbs, NavButtons } from './components';
import { IMG_COMPRESSED } from '../../config';
// import Fetch404 from '../Base/components/Fetch404';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './SingleCharacter.duck';

class SingleCharacter extends Component {
  componentDidMount() {
    const { params: { game }, actions } = this.props;
    actions.getGameInfo(game);
    actions.fetchCharacters(game);
  }

  // possible upgrading: if params: { game } was changed, dispatch getGameInfo(game) and fetchCharacters(game)

  render() {
    const { pending, gameInfo, characters, params } = this.props;

    const currentCharacter = characters[params.char] || {};

    const prevCharacter = (function getPrevCharacter() {
      const pos = Object.keys(characters).indexOf(params.char) - 1;
      const slug = Object.keys(characters)[pos];
      return characters[slug];
    }()) || {};

    const nextCharacter = (function getNextCharacter() {
      const pos = Object.keys(characters).indexOf(params.char) + 1;
      const slug = Object.keys(characters)[pos];
      return characters[slug];
    }()) || {};

    // if (!character) return <Fetch404 title={'Character not found!'}>Character not found!</Fetch404>;

    return (
      <div>
        <Helmet title={currentCharacter.name} />

        <TopContainer>
          <Breadcrumbs>
            <Link to="/browse">Games</Link>
            <Link to={`/browse/${gameInfo.slug}`}>{gameInfo.title}</Link>
            <span>{currentCharacter.name}</span>
          </Breadcrumbs>
        </TopContainer>

        {pending ||
          <div itemScope itemType="http://schema.org/Person" className="singlechar">
            <h1 itemProp="name">{currentCharacter.name}</h1>

            <div className="singlechar-container">
              <NavButtons.Left disabled={!prevCharacter.name} to={`/browse/${params.game}/${prevCharacter.slug}`} />

              <div className="singlechar-flex">
                <div className="singlechar-img">
                  {currentCharacter.image
                    ? <img itemProp="image" alt="char" src={IMG_COMPRESSED + currentCharacter.image} />
                    : <i className="fa fa-file-image-o fa-5x" aria-hidden="true" />
                  }
                </div>
                <div className="singlechar-desc">
                  <p>Character info:&nbsp;
                    <a itemProp="sameAs" href={currentCharacter.wiki}>
                      {currentCharacter.wiki && currentCharacter.wiki.substring(7)}
                    </a>
                  </p>
                  <p>Illustration author:
                    {currentCharacter.art &&
                      <a href={currentCharacter.art.url}> {currentCharacter.art.author}</a>
                    }
                  </p>
                </div>
              </div>

              <NavButtons.Right disabled={!nextCharacter.name} to={`/browse/${params.game}/${nextCharacter.slug}`} />
            </div>
          </div>
        }
      </div>
    );
  }
}

SingleCharacter.propTypes = {
  pending: PropTypes.bool.isRequired,
  gameInfo: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  params: PropTypes.shape({
    game: PropTypes.string.isRequired,
    char: PropTypes.string.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    getGameInfo: PropTypes.func.isRequired,
    fetchCharacters: PropTypes.func.isRequired,
  }).isRequired,
  characters: PropTypes.objectOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    wiki: PropTypes.string,
    slug: PropTypes.string.isRequired,
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
  })).isRequired,
};

function mapStateToProps({ domain: { singleCharacter }, entities }) {
  const characters = {};

  singleCharacter.visible.forEach((slug) => {
    characters[slug] = entities.characters[slug];
  });

  return {
    pending: !singleCharacter.active || singleCharacter.activeRequests > 0,
    gameInfo: singleCharacter.gameInfo,
    characters,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ownActions, dispatch) };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'SingleCharacter' })(SingleCharacter),
  );
