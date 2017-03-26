import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import { TopContainer, Breadcrumbs, NavButtons } from './components';
import Fetch404 from '../Base/components/Fetch404';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './SingleCharacter.duck';
import * as style from './SingleCharacter.style';

class SingleCharacter extends Component {
  componentDidMount() {
    const { params: { game }, actions } = this.props;
    actions.getGameInfo(game);
    actions.fetchCharacters(game);
  }

  // possible upgrading: if params: { game } was changed, dispatch getGameInfo(game) and fetchCharacters(game)

  render() {
    const { pending, gameInfo, characters, params } = this.props;

    if (!pending && !gameInfo.title) {
      return <Fetch404>Game not found!</Fetch404>;
    }

    const currentCharacter = characters[params.char] || {};

    if (!pending && !currentCharacter.name) {
      return <Fetch404>Character not found!</Fetch404>;
    }

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
          <div itemScope itemType="http://schema.org/Person">
            <h1 className={style.header} itemProp="name">{currentCharacter.name}</h1>

            <div className={style.container}>
              <NavButtons.Left disabled={!prevCharacter.name} to={`/browse/${params.game}/${prevCharacter.slug}`} />

              <div className={style.body}>
                <div className={style.imgContainer}>
                  {currentCharacter.image
                    ? <img
                      key={currentCharacter.image}
                      className={style.img}
                      itemProp="image"
                      alt="char"
                      src={process.env.IMG_COMPRESSED + currentCharacter.image}
                    />
                    : <i className="fa fa-file-image-o fa-5x" aria-hidden="true" />
                  }
                </div>
                <div className={style.desc}>
                  <p className={style.pDesc}>Character info:&nbsp;
                    <a target="_blank" rel="noopener noreferrer" itemProp="sameAs" href={currentCharacter.wiki}>
                      {currentCharacter.wiki && currentCharacter.wiki.substring(7)}
                    </a>
                  </p>
                  <p className={style.pDesc}>Illustration author:{' '}
                    {currentCharacter.art &&
                      <a target="_blank" rel="noopener noreferrer" href={currentCharacter.art.url}>
                        {currentCharacter.art.author}
                      </a>
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
