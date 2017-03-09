import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import { IMG_THUMBNAIL } from '../../../../config';

const Grid = ({ entity, pathname }) => {
  const data = entity.map(char => (
    <div key={char.name} className="flex-item">
      <p>
        <Link className="imagelink" to={`${pathname}/${char.slug}`}>
          {char.image
            ? <img alt="char" src={IMG_THUMBNAIL + char.image} />
            : <i className="fa fa-file-image-o fa-5x" aria-hidden="true" style={{ marginBottom: '3px' }} />
          }
        </Link>
      </p>
      <p>
        <Link to={`${pathname}/${char.slug}`}>{char.name}</Link>
      </p>
    </div>
  ));

  return (
    <div className="flex-container">
      {data}
    </div>
  );
};

Grid.propTypes = {
  entity: PropTypes.arrayOf(PropTypes.object).isRequired,
  pathname: PropTypes.string.isRequired,
};

export default Grid;
