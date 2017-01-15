import React, { PropTypes } from 'react';

import NavbarHeader from './NavbarHeader';
import Loading from '../../containers/Base/components/Loading';

const Base = ({ children }) => {
  return (
    <div>
      <NavbarHeader />
      <div className="container">
        {children}
        <Loading />
      </div>
    </div>
  );
};

Base.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Base;
