import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const GamesTable = ({ gamesFlex, pathname, snakeCase }) => {
  const tableData = gamesFlex.map(game => (
    <tr key={game.title}>
      <td className="td-centered">
        <Link className="imagelink" to={`${pathname}/${snakeCase(game.title)}`}>
          <img alt="char" src={require(`../../../../images/games/${game.cover}`)} />
        </Link>
      </td>
      <td>
        {game.prefix && `${game.prefix}: `}
        <Link to={`${pathname}/${snakeCase(game.title)}`}>
          {game.title}
        </Link>
      </td>
      <td className="td-centered">{game.year}</td>
    </tr>
  ));

  const data = (() => (
    <table className="pure-table pure-table-striped">
      <thead>
        <tr>
          <th className="td-centered">Cover</th>
          <th>Title</th>
          <th className="td-centered">Year</th>
        </tr>
      </thead>
      <tbody>
        {tableData}
      </tbody>
    </table>
  ))();
  return (
    <div className="flex-container">
      {data}
    </div>
  );
};

GamesTable.propTypes = {
  gamesFlex: PropTypes.array,
  pathname: PropTypes.string,
  snakeCase: PropTypes.func,
};

export default GamesTable;
