import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import { CharsGrid, CharsTable } from './components/gridsAndTables';
import { TopContainer, Breadcrumbs, ModeButtons } from './components';
import Fetch404 from '../Base/components/Fetch404';

import { domainHoc } from '../../ducks/domain';
import * as ownActions from './CharactersList.duck';

class CharactersList extends Component {
  componentDidMount() {
    const { params: { game }, actions } = this.props;
    actions.getGameInfo(game);
    actions.fetchCharacters(game);
  }

  render() {
    const { charaters, mode, gameInfo, router, location, pending } = this.props;

    if (!pending && !gameInfo.title) {
      return <Fetch404>Game not found!</Fetch404>;
    }

    return (
      <div>
        <Helmet title={`Characters from ${gameInfo.title}`} />

        <TopContainer>
          <Breadcrumbs>
            <Link to="/browse">Games</Link>
            <span>{gameInfo.title}</span>
          </Breadcrumbs>
          <ModeButtons router={router} location={location} />
        </TopContainer>

        {mode === 'grid' && <CharsGrid entity={charaters} pathname={location.pathname} />}
        {mode === 'table' && <CharsTable entity={charaters} pathname={location.pathname} />}

        {!pending && !charaters[0] &&
          <Fetch404>This category is empty!</Fetch404>
        }
      </div>
    );
  }
}

CharactersList.propTypes = {
  pending: PropTypes.bool.isRequired,
  charaters: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    wiki: PropTypes.string,
    slug: PropTypes.string.isRequired,
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
  })).isRequired,
  mode: PropTypes.string.isRequired,
  gameInfo: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  actions: PropTypes.shape({
    getGameInfo: PropTypes.func.isRequired,
    fetchCharacters: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  params: PropTypes.shape({
    game: PropTypes.string,
    char: PropTypes.string,
  }).isRequired,
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ entities, domain: { charactersList }, base: { mode } }) {
  const charaters = charactersList.visible.map(slug => entities.characters[slug]);

  return {
    pending: !charactersList.active || charactersList.activeRequests > 0,
    gameInfo: charactersList.gameInfo,
    charaters,
    mode,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ownActions, dispatch) };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'CharactersList' })(CharactersList),
  );
