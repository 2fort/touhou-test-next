import React, { PropTypes } from 'react';
import { style } from 'typestyle';
import { red } from 'csx';

const ErrorSpan = ({ children }) => (
  <span className={style({ color: red.toHexString() })}>
    {children}
  </span>
);

ErrorSpan.propTypes = {
  children: PropTypes.string.isRequired,
};

export default ErrorSpan;
