import React, { PropTypes } from 'react';
import simpleContainer from './Container.style';

const Container = ({ children }) => (
  <div className={simpleContainer}>
    {children}
  </div>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
