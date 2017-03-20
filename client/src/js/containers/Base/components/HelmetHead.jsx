import React from 'react';
import Helmet from 'react-helmet';

const HelmetHead = () => (
  <Helmet
    htmlAttributes={{ lang: 'en' }}
    titleTemplate="%s | Touhou Test"
    defaultTitle="Touhou Test - Do you know Touhou characters well? Check your skills!"
    meta={[
      {
        name: 'description',
        content: 'This application will help you quickly remember the characters from Touhou.',
      },
      {
        name: 'keywords',
        content: 'Touhou, test, characters',
      },
    ]}
  />
);

export default HelmetHead;
