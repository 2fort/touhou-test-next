import React, { PropTypes } from 'react';

const Breadcrumbs = ({ children }) => (
  <div role="navigation" aria-label="breadcrumbs">
    {children.length
      ? children.reduce((prev, curr) => [prev, ' / ', curr])
      : children
    }
  </div>
);

Breadcrumbs.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Breadcrumbs;
