import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const Table = ({ entity, pathname }) => {
  const tableData = entity.map(game => (
    <tr key={game.title}>
      <td className="td-centered">
        <Link className="imagelink" to={`${pathname}/${game.slug}`}>
          <img alt="char" src={`/images/games/${game.cover}`} />
        </Link>
      </td>
      <td>
        {game.prefix && `${game.prefix}: `}
        <Link to={`${pathname}/${game.slug}`}>
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

Table.propTypes = {
  entity: PropTypes.arrayOf(PropTypes.object).isRequired,
  pathname: PropTypes.string.isRequired,
};

export default Table;
