import React, { PropTypes } from 'react';

const TopContainer = ({ children }) => (
  <div className="flex-top">
    {children}
  </div>
);

TopContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TopContainer;
