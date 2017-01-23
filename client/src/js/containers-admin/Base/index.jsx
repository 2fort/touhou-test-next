import React, { PropTypes } from 'react';

import NavbarHeader from './components/NavbarHeader';
import FlashMsg from './components/FlashMsg';
import LoadingLine from './components/LoadingLine';

const Base = ({ children }) => (
  <div>
    <LoadingLine />
    <NavbarHeader />
    <div className="container main-container">
      <FlashMsg />
      {children}
    </div>
  </div>
);

Base.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Base;
