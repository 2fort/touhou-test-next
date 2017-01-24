import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { CharsGrid, CharsTable } from './components/gridsAndTables';
import { TopContainer, Breadcrumbs, ModeButtons } from './components';
import Fetch404 from '../Base/components/Fetch404';

import { domainHoc } from '../../ducks/domain';
import fetchCharacters from './CharactersList.duck';

class CharactersList extends Component {
  componentDidMount() {
    this.props.fetchCharacters(this.props.params.game);
  }

  render() {
    const { ready, data, router, params, location } = this.props;

    if (!ready) return null;
    if (!data) return <Fetch404>Game not found!</Fetch404>;

    return (
      <div>
        <Helmet title="Characters" />

        <TopContainer>
          <Breadcrumbs params={params} />
          <ModeButtons router={router} location={location} />
        </TopContainer>

        {(data.mode === 'grid')
            ? <CharsGrid entity={data.entity} pathname={location.pathname} />
            : <CharsTable entity={data.entity} pathname={location.pathname} />
        }
      </div>
    );
  }
}

CharactersList.defaultProps = {
  data: undefined,
};

CharactersList.propTypes = {
  ready: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    entity: PropTypes.arrayOf(PropTypes.object).isRequired,
    title: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
  }),
  fetchCharacters: PropTypes.func.isRequired,
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

function mapStateToProps({ entities, domain: { charactersList }, base: { mode } }, { params }) {
  if (!charactersList || charactersList.pending) {
    return { ready: false };
  }

  if (!entities.games[params.game]) {
    return { ready: true, data: undefined };
  }

  const data = {
    mode,
    title: entities.games[params.game].title,
    entity: charactersList.visible.map(slug => entities.characters[slug]),
  };

  return { ready: true, data };
}

export default
  connect(mapStateToProps, { fetchCharacters })(
    domainHoc({ name: 'CharactersList' })(CharactersList),
  );
