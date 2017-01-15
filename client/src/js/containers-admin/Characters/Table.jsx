import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchAllCharacters } from '../../actions/adminActions';

class CharactersTable extends Component {
  componentWillMount() {
    this.props.actions.didMount();
    this.props.actions.getData();
  }

  componentWillUnmount() {
    this.props.actions.willUnmount();
  }

  render() {
    const { ready, charsArray, gamesEntity } = this.props;

    if (!ready) return null;

    const charsTable = charsArray.map((char, i) => (
      <tr key={char.name}>
        <td>{char.name}<br /><h6>{char.slug}</h6></td>
        <td><img alt={char.name} src={`/images/s/${char.image}`} /></td>
        <td><Link to={`/admin/games/edit/${char._game}`}>{gamesEntity[char._game].title}</Link></td>
        <td className="toowide">{char.wiki}</td>
        <td>{char.art.author}</td>
        <td className="toowide">{char.art.url}</td>
        <td>
          <Link to={`/admin/characters/show/${char.id}`}>
            <i className="fa fa-eye fa-lg" aria-hidden="true" />
          </Link>{' '}
          <Link to={`/admin/characters/edit/${char.id}`}>
            <i className="fa fa-pencil fa-lg" aria-hidden="true" />
          </Link>{' '}
          <Link to={`/admin/characters/delete/${char.id}`}>
            <i className="fa fa-trash fa-lg" aria-hidden="true" />
          </Link>
        </td>
      </tr>
    ));

    const tableHead = (
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
          {charsTable}
        </thead>
      </table>
    );

    return (
      <div>
        {tableHead}
      </div>
    );
  }
}

CharactersTable.defaultProps = {
  charsArray: undefined,
  gamesEntity: undefined,
};

CharactersTable.propTypes = {
  ready: PropTypes.bool.isRequired,
  charsArray: PropTypes.arrayOf(PropTypes.object),
  gamesEntity: PropTypes.objectOf(PropTypes.object),
  actions: PropTypes.shape({
    didMount: PropTypes.func.isRequired,
    willUnmount: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ entities, domain: { charactersTable } }) {
  if (!charactersTable || charactersTable.pending) return { ready: false };

  const charsArray = charactersTable.visible.map(char => entities.characters[char]);
  // const charsArray = charactersArray.map(char => ({ ...char, gameTitle: entities.games[char._game].title }));

  return { ready: true, charsArray, gamesEntity: entities.games };
}

function mapDispatchToProps(dispatch) {
  const component = 'CharactersTable';
  return {
    actions: {
      didMount: () => {
        dispatch({
          type: 'CONTAINER_MOUNT',
          component,
        });
      },
      willUnmount: () => {
        dispatch({
          type: 'CONTAINER_DESTROY',
          component,
        });
      },
      getData: () => {
        dispatch(fetchAllCharacters(component));
      },
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CharactersTable);
