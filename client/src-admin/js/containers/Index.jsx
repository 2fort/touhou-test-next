import React, { PropTypes } from 'react';

import NavbarHeader from '../components/Index/NavbarHeader';

const Index = ({ children }) => {
  return (
    <div>
      <NavbarHeader />
      <div className="container">
        {children}
      </div>
    </div>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};

export default Index;
