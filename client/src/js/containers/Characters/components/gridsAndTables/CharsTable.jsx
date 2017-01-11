import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const Table = ({ entity, pathname }) => {
  const tableData = entity.map(char => (
    <tr key={char.name}>
      <td className="td-centered">
        <Link className="imagelink" to={`${pathname}/${char.slug}`}>
          <img alt="char" src={`/images/s/${char.image}`} />
        </Link>
      </td>
      <td>
        <Link to={`${pathname}/${char.slug}`}>
          {char.name}
        </Link>
      </td>
      <td>
        <a href={char.wiki}>{char.wiki.substr(7)}</a>
      </td>
    </tr>
  ));

  const data = (() => (
    <table className="pure-table pure-table-striped">
      <thead>
        <tr>
          <th className="td-centered">Art</th>
          <th>Name</th>
          <th>Wiki</th>
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
  entity: PropTypes.arrayOf(PropTypes.object),
  pathname: PropTypes.string,
};

export default Table;