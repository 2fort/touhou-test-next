import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const Breadcrumbs = ({ gameTitle, game, char }) => {
  if (!game) {
    return <div className="breadcrumbs">Characters</div>;
  } else if (game && !char) {
    return (
      <div className="breadcrumbs">
        <Link to="/characters">Characters</Link>{' '}/{' '}{gameTitle}
      </div>
    );
  }
  return (
    <div className="breadcrumbs">
      <Link to="/characters">Characters</Link>
      {' '}/{' '}
      <Link to={`/characters/${game}`}>{gameTitle}</Link>
    </div>
  );
};

Breadcrumbs.propTypes = {
  game: PropTypes.string,
  char: PropTypes.string,
  gameTitle: PropTypes.string,
};

export default Breadcrumbs;
