import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';

import ListHoc from './ListHoc';
import { Grid, Table } from '../../components/Characters/CharactersList';

class CharactersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      title: '',
    };
  }

  componentWillMount() {
    let stateCharacters = [];
    fetch(`/api/characters/${this.props.params.game}`)
      .then(response => response.json())
      .then((characters) => {
        stateCharacters = characters;
        return fetch(`/api/game/${this.props.params.game}`);
      })
      .then(response => response.json())
      .then((game) => {
        this.setState({
          characters: stateCharacters,
          title: game[0].title,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { location: { pathname }, mode } = this.props;

    return (
      <div>
        <Helmet title={this.state.title} />

        {mode === 'grid'
          ? <Grid charsFlex={this.state.characters} pathname={pathname} />
          : <Table charsFlex={this.state.characters} pathname={pathname} />
        }
      </div>
    );
  }
}

CharactersList.propTypes = {
  params: PropTypes.shape({
    game: PropTypes.string,
    char: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  mode: PropTypes.string,
};

export default ListHoc(CharactersList);
