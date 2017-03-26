import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import { classes } from 'typestyle';
import * as style from './style';

const Grid = ({ entity, pathname }) => {
  const data = entity.map(game => (
    <div key={game.title} className={style.flexItem}>
      <p className={style.headline}>
        <Link className={style.imagelink} to={`${pathname}/${game.slug}`}>
          {game.cover
            ? <img className={style.thumbnail} alt="char" src={process.env.IMG_THUMBNAIL + game.cover} />
            : <i className={classes(style.bar, 'fa fa-file-image-o fa-5x')} aria-hidden="true" />
          }
        </Link>
      </p>
      <p className={style.headline}>
        <Link to={`${pathname}/${game.slug}`}>{game.title}</Link>
      </p>
      <p className={style.headline}>{game.year}</p>
    </div>
  ));

  return (
    <div className={style.flexContainer}>
      {data}
    </div>
  );
};

Grid.propTypes = {
  entity: PropTypes.arrayOf(PropTypes.object).isRequired,
  pathname: PropTypes.string.isRequired,
};

export default Grid;
