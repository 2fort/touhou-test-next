import React, { PropTypes } from 'react';
import HelmetHead from '../components/Index/HelmetHead';
import Navbar from '../components/Index/Navbar';

const Index = ({ children }) => (
  <div>
    <HelmetHead />
    <Navbar />
    {children}
  </div>
);

Index.propTypes = {
  children: PropTypes.node,
};

export default Index;
