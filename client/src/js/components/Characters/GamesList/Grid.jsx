import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const Grid = ({ gamesFlex, pathname }) => {
  const data = gamesFlex.map(game => (
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
  gamesFlex: PropTypes.array,
  pathname: PropTypes.string,
};

export default Grid;
