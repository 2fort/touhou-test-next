import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { style } from 'typestyle';

const st = style({
  margin: '2rem',
  textAlign: 'center',
  fontSize: '1.5rem',
});

const Fetch404 = ({ children }) => (
  <div className={st}>
    <Helmet title={children.toString()} />
    {children}
  </div>
);

Fetch404.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Fetch404;
