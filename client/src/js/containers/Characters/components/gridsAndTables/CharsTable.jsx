import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import { classes } from 'typestyle';
import * as style from './style';

const Table = ({ entity, pathname }) => {
  const tableData = entity.map(char => (
    <tr key={char.name}>
      <td className={style.tdCentered}>
        {char.image &&
          <Link className={style.imagelink} to={`${pathname}/${char.slug}`}>
            <img className={style.tableImg} alt="char" src={process.env.IMG_THUMBNAIL + char.image} />
          </Link>
        }
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
    <table className={classes(style.fullTable, 'pure-table pure-table-striped')}>
      <thead>
        <tr>
          <th className={style.tdCentered}>Art</th>
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
    <div className={style.flexContainer}>
      {data}
    </div>
  );
};

Table.propTypes = {
  entity: PropTypes.arrayOf(PropTypes.object).isRequired,
  pathname: PropTypes.string.isRequired,
};

export default Table;
