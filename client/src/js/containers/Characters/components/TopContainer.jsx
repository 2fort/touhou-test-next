import React, { PropTypes } from 'react';
import { style } from 'typestyle';
import * as csstips from 'csstips';

const css = style(csstips.horizontal, csstips.betweenJustified, {
  padding: '1rem 1rem .5rem',
});

const TopContainer = ({ children }) => (
  <div className={css}>
    {children}
  </div>
);

TopContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TopContainer;
