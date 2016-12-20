import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import * as testApi from '../../api';

const Breadcrumbs = ({ game, char }) => {
  if (!game) {
    return <div className="breadcrumbs">Characters</div>;
  } else if (game && !char) {
    return (
      <div className="breadcrumbs">
        <Link to="/characters">Characters</Link>&nbsp;/&nbsp;{testApi.getProperGameTitle(game)}
      </div>
    );
  }
  return (
    <div className="breadcrumbs">
      <Link to="/characters">Characters</Link>&nbsp;/&nbsp;
        <Link to={`/characters/${game}`}>
          {testApi.getProperGameTitle(game)}
        </Link>
    </div>
  );
};

Breadcrumbs.propTypes = {
  game: PropTypes.string,
  char: PropTypes.string,
};

export default Breadcrumbs;
