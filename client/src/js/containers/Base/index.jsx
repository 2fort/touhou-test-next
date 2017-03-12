import React, { PropTypes } from 'react';
import HelmetHead from './components/HelmetHead';
import Navbar from './components/Navbar';

const Base = ({ children }) => (
  <div>
    <HelmetHead />
    <Navbar />
    {children}
    <div className="footer">
      <i className="fa fa-github fa-fw fa-lg" aria-hidden="true" />
      <a href="https://github.com/2fort/touhou-test-next" target="_blank" rel="noopener noreferrer">GitHub</a>.
      Current:{' '}
      <a
        href="https://github.com/2fort/touhou-test-next/commit/67f3c19a0cad6e16fe2d3bc220abdbbb5db66e4d"
        target="_blank"
        rel="noopener noreferrer"
      >
        67f3c19</a> build.
    </div>
  </div>
);

Base.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Base;
