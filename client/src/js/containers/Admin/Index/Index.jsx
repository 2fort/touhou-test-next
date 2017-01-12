import React, { PropTypes } from 'react';
import NavbarHeader from './NavbarHeader';

require('../../../../sass/admin/app.scss');

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
