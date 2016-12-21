import React, { PropTypes } from 'react';

const GamesIndex = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

GamesIndex.propTypes = {
  children: PropTypes.node,
};

export default GamesIndex;
