import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

const Fetch404 = ({ children }) => (
  <div className="fetch404">
    <Helmet title={children.toString()} />
    {children}
  </div>
);

Fetch404.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Fetch404;
