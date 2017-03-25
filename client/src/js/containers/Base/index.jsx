import React, { PropTypes } from 'react';
import HelmetHead from './components/HelmetHead';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Base = ({ children }) => (
  <div>
    <HelmetHead />
    <Navbar />
    {children}
    <Footer />
  </div>
);

Base.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Base;
