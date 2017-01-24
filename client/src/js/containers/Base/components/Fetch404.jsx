import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

const Fetch404 = ({ title, children }) => (
  <div>
    <Helmet title={title} />
    {children}
  </div>
);

Fetch404.defaultProps = {
  title: 'Not found!',
};

Fetch404.propTypes = {
  title: PropTypes.string,
  children: PropTypes.string.isRequired,
};

export default Fetch404;
