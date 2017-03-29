import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import { classes } from 'typestyle';
import * as style from './style';

const Grid = ({ entity, pathname }) => {
  const data = entity.map(char => (
    <div key={char.name} className={style.flexItem}>
      <div>
        <Link className={style.imagelink} to={`${pathname}/${char.slug}`}>
          {char.image
            ? <img className={style.thumbnail} alt={char.name} src={process.env.IMG_THUMBNAIL + char.image} />
            : <i className={classes(style.bar, 'fa fa-file-image-o fa-5x')} aria-hidden="true" />
          }
        </Link>
      </div>
      <div>
        <Link to={`${pathname}/${char.slug}`}>{char.name}</Link>
      </div>
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
