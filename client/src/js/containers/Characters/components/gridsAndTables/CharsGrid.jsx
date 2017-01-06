import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const Grid = ({ entity, pathname }) => {
  const data = entity.map(char => (
    <div key={char.name} className="flex-item">
      <p>
        <Link className="imagelink" to={`${pathname}/${char.slug}`}>
          <img alt="char" src={`/images/s/${char.image}`} />
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
  entity: PropTypes.arrayOf(PropTypes.object),
  pathname: PropTypes.string,
};

export default Grid;
