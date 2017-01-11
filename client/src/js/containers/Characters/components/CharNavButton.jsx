import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const CharNavButton = ({ char, game, children }) => {
  let item;

  if (char) {
    item = <Link to={`/characters/${game}/${char}`}>{children}</Link>;
  } else {
    item = <button type="button" disabled>{children}</button>;
  }

  return (
    <div className="navigation">
      {item}
    </div>
  );
};

CharNavButton.defaultProps = {
  char: undefined,
};

CharNavButton.propTypes = {
  game: PropTypes.string.isRequired,
  char: PropTypes.string,
  children: PropTypes.element.isRequired,
};

export default CharNavButton;
