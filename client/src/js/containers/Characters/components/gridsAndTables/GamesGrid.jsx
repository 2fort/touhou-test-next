import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const Grid = ({ entity, pathname }) => {
  const data = entity.map(game => (
    <div key={game.title} className="flex-item">
      <p>
        <Link className="imagelink" to={`${pathname}/${game.slug}`}>
          <img alt="char" src={`/images/games/${game.cover}`} />
        </Link>
      </p>
      <p>
        <Link to={`${pathname}/${game.slug}`}>{game.title}</Link>
      </p>
      <p>{game.year}</p>
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
