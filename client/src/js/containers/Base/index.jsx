import React, { PropTypes } from 'react';
import { style } from 'typestyle';
import * as csstips from 'csstips';
import HelmetHead from './components/HelmetHead';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const mainFlex = style(csstips.vertical, {
  maxWidth: '80rem',
  margin: '1.25rem auto 0',
});

const Base = ({ children }) => (
  <div>
    <HelmetHead />
    <Navbar />
    <div className={mainFlex}>
      {children}
      <Footer />
    </div>
  </div>
);

Base.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Base;
