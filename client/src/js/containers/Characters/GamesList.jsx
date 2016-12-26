import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';

import ListHoc from './ListHoc';
import Grid from '../../components/Characters/GamesList/Grid';
import Table from '../../components/Characters/GamesList/Table';

class GamesList extends Component {
  constructor(props) {
    super(props);
    this.state = { games: [] };
  }

  componentWillMount() {
    fetch('/api/characters')
      .then((response) => {
        if (response.status !== 200) {
          return Promise.reject(`resource unavailable: ${response.status}, ${response.statusText}`);
        }
        return response.json();
      })
      .then((games) => {
        this.setState({ games });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { location: { pathname }, mode } = this.props;

    return (
      <DocumentTitle title="Characters | Touhou">
        {mode === 'grid'
          ? <Grid gamesFlex={this.state.games} pathname={pathname} />
          : <Table gamesFlex={this.state.games} pathname={pathname} />
        }
      </DocumentTitle>
    );
  }
}

GamesList.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  mode: PropTypes.string,
};

export default ListHoc(GamesList);
