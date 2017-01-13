import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import NavbarHeader from './NavbarHeader';

require('../../../../sass/admin/app.scss');

const Index = ({ children }) => {
  return (
    <div>
      <Helmet
        link={[{
          rel: 'stylesheet',
          type: 'text/css',
          href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
          integrity: 'sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u',
          crossorigin: 'anonymous',
        }]}
      />
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
