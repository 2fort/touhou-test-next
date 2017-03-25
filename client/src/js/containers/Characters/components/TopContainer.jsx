import React, { PropTypes } from 'react';
import { style } from 'typestyle';

const css = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
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
