import React from 'react';
import Helmet from 'react-helmet';
import { style } from 'typestyle';

import Container from './Container';

const st = style({
  margin: '2rem',
  textAlign: 'center',
  fontSize: '1.1rem',
});

export default () => (
  <Container>
    <div className={st}>
      <Helmet title="404" />
      Page not found!
    </div>
  </Container>
);
