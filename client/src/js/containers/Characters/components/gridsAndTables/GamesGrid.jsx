import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import { classes } from 'typestyle';
import * as style from './style';

const Grid = ({ entity, pathname }) => {
  const data = entity.map(game => (
    <div key={game.title} className={style.flexItem}>
      <div>
        <Link className={style.imagelink} to={`${pathname}/${game.slug}`}>
          {game.cover
            ? <img className={style.thumbnail} alt={game.title} src={process.env.IMG_THUMBNAIL + game.cover} />
            : <i className={classes(style.bar, 'fa fa-file-image-o fa-5x')} aria-hidden="true" />
          }
        </Link>
      </div>
      <div>
        <Link to={`${pathname}/${game.slug}`}>{game.title}</Link>
      </div>
      <span>{game.year}</span>
    </div>
  ));

  const layoutFix = new Array(10).fill(0).map((elem, i) => (
    <div key={`additional ${i + 1}`} className={style.flexItem} />
  ));

  return (
    <div className={style.flexContainer}>
      {data}
      {layoutFix}
    </div>
  );
};

Grid.propTypes = {
  entity: PropTypes.arrayOf(PropTypes.object).isRequired,
  pathname: PropTypes.string.isRequired,
};

export default Grid;
