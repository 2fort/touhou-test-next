import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import { classes } from 'typestyle';
import { IMG_THUMBNAIL } from '../../../../config';
import * as style from './style';

const Table = ({ entity, pathname }) => {
  const tableData = entity.map(game => (
    <tr key={game.title}>
      <td className={style.tdCentered}>
        {game.cover &&
          <Link className={style.imagelink} to={`${pathname}/${game.slug}`}>
            <img className={style.tableImg} alt="char" src={IMG_THUMBNAIL + game.cover} />
          </Link>
        }
      </td>
      <td>
        {game.prefix && `${game.prefix}: `}
        <Link to={`${pathname}/${game.slug}`}>
          {game.title}
        </Link>
      </td>
      <td className={style.tdCentered}>{game.year}</td>
    </tr>
  ));

  const data = (() => (
    <table className={classes(style.fullTable, 'pure-table pure-table-striped')}>
      <thead>
        <tr>
          <th className={style.tdCentered}>Cover</th>
          <th>Title</th>
          <th className={style.tdCentered}>Year</th>
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
