import React, { PropTypes } from 'react';

const CharactersIndex = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

CharactersIndex.propTypes = {
  children: PropTypes.node,
};

export default CharactersIndex;
