import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { Grid, Table } from '../../components/Characters/CharactersList';
import { fetchCharacters, fetchCharactersBegin, purgeCache } from '../../actions/asyncActions';

class CharactersList extends Component {
  static onEnter(dispatch) {
    dispatch(fetchCharactersBegin());
  }

  static onLeave(dispatch) {
    dispatch(purgeCache());
  }

  componentWillMount() {
    this.props.getCharacters(this.props.params.game);
  }

  render() {
    const { characters, title, location: { pathname }, mode } = this.props;

    return (
      <div>
        <Helmet title={title} />

        {mode === 'grid'
          ? <Grid charsFlex={characters} pathname={pathname} />
          : <Table charsFlex={characters} pathname={pathname} />
        }
      </div>
    );
  }
}

function mapStateToProps({ store: { characters, games, fetchInProgress }, main: { mode } }) {
  let title = '';

  if (!fetchInProgress) {
    const gameId = Object.values(characters)[0]._game;
    title = games[gameId].title;
  }

  return { characters, title, mode };
}

function mapDispatchToProps(dispatch) {
  return {
    getCharacters: (game) => {
      dispatch(fetchCharacters(game));
    },
  };
}

CharactersList.propTypes = {
  params: PropTypes.shape({
    game: PropTypes.string,
    char: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  mode: PropTypes.string.isRequired,
  characters: PropTypes.objectOf(PropTypes.object),
  title: PropTypes.string,
  getCharacters: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(CharactersList);
