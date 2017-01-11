import React, { PropTypes } from 'react';
import HelmetHead from './components/HelmetHead';
import Navbar from './components/Navbar';

const Base = ({ children }) => (
  <div>
    <HelmetHead />
    <Navbar />
    {children}
  </div>
);

Base.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Base;
