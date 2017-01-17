import React, { PropTypes } from 'react';

import NavbarHeader from './components/NavbarHeader';
import FlashMsg from './components/FlashMsg';
import Loading from '../../containers/Base/components/Loading';

const Base = ({ children }) => (
  <div>
    <NavbarHeader />
    <div className="container">
      <FlashMsg />
      {children}
      <Loading />
    </div>
  </div>
);

Base.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Base;
