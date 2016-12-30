import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class List extends Component {
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
    // console.log(this.state.games);
    const games = this.state.games.map((game, i) => (
      <tr key={i}>
        <td>{game.prefix}</td>
        <td>{game.title}<br /><h6>{game.slug}</h6></td>
        <td><img role="presentation" height={75} src={`/images/games/${game.cover}`} /></td>
        <td>{game.year}</td>
        <td>
          <Link to={`/admin/games/show/${game._id}`}>
            <i className="fa fa-eye fa-lg" aria-hidden="true" />
          </Link>{' '}
          <Link to={`/admin/games/edit/${game._id}`}>
            <i className="fa fa-pencil fa-lg" aria-hidden="true" />
          </Link>{' '}
          <Link to={`/admin/games/delete/${game._id}`}>
            <i className="fa fa-trash fa-lg" aria-hidden="true" />
          </Link>
        </td>
      </tr>
    ));
    const table = (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>prefix</th>
            <th>title / slug</th>
            <th>cover</th>
            <th>year</th>
            <th>actions</th>
          </tr>
          {games}
        </thead>
      </table>
    );

    return (
      <div>
        <Link to="/admin/games/new" className="btn btn-primary">Add new game</Link>
        {table}
      </div>
    );
  }
}
