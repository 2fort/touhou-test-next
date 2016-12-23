import React, { Component, PropTypes } from 'react';

class GamesList extends Component {
  constructor(props) {
    super(props);
    this.state = { games: [] };
  }
  componentWillMount() {
    fetch('/api/admin/games')
      .then(response => response.json())
      .then((games) => {
        this.setState({ games });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
  render() {
    console.log(this.state.games);
    return (
      <div>
        Games list will be here.
      </div>
    );
  }
}

export default GamesList;
