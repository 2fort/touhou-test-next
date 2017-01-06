import React, { PropTypes } from 'react';
import HelmetHead from '../../shared/HelmetHead';
import Navbar from './components/Navbar';

const Base = ({ children }) => (
  <div>
    <HelmetHead />
    <Navbar />
    {children}
  </div>
);

Base.propTypes = {
  children: PropTypes.node,
};

export default Base;
