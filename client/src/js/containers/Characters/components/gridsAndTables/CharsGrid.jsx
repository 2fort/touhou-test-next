import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import { classes } from 'typestyle';
import { IMG_THUMBNAIL } from '../../../../config';
import * as style from './style';

const Grid = ({ entity, pathname }) => {
  const data = entity.map(char => (
    <div key={char.name} className={style.flexItem}>
      <p className={style.headline}>
        <Link className={style.imagelink} to={`${pathname}/${char.slug}`}>
          {char.image
            ? <img className={style.thumbnail} alt="char" src={IMG_THUMBNAIL + char.image} />
            : <i className={classes(style.bar, 'fa fa-file-image-o fa-5x')} aria-hidden="true" />
          }
        </Link>
      </p>
      <p className={style.headline}>
        <Link to={`${pathname}/${char.slug}`}>{char.name}</Link>
      </p>
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
