import React, { Component, PropTypes} from 'react';
import { Link } from 'react-router';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { characters: [] };
  }

  componentWillMount() {
    fetch('/api/admin/characters')
      .then((response) => {
        return response.json();
      })
      .then((characters) => {
        this.setState({ characters });
        console.log(this.state);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <Table characters={this.state.characters} />
      </div>
    );
  }
}

const Table = ({ characters }) => {
  const tableBody = characters.map((char, i) => (
    <tr key={i}>
      <td>{char.name}<br /><h6>{char.slug}</h6></td>
      <td><img role="presentation" src={`/images/s/${char.image}`} /></td>
      <td>{char._game.title}</td>
      <td className="toowide">{char.wiki}</td>
      <td>{char.art.author}</td>
      <td className="toowide">{char.art.url}</td>
      <td>
        <Link to={`/admin/characters/edit/${char._id}`}>
          <i className="fa fa-pencil fa-lg" aria-hidden="true" />
        </Link>&nbsp;
        <Link to={`/admin/characters/delete/${char._id}`}>
          <i className="fa fa-trash fa-lg" aria-hidden="true" />
        </Link>
      </td>
    </tr>
  ));

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>name / slug</th>
          <th>image</th>
          <th>game</th>
          <th>wiki</th>
          <th>art author</th>
          <th>art url</th>
          <th>actions</th>
        </tr>
        {tableBody}
      </thead>
    </table>
  );
};
