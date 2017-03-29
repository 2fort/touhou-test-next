import React from 'react';
import { style } from 'typestyle';

const st = style({
  fontSize: '.9rem',
  margin: '1rem auto',
  textAlign: 'center',
});

export default () => (
  <div className={st}>
    <i className="fa fa-github fa-fw fa-lg" aria-hidden="true" />
    <a href="https://github.com/2fort/touhou-test-next" target="_blank" rel="noopener noreferrer">GitHub</a>.
    Current:{' '}
    <a
      href="https://github.com/2fort/touhou-test-next/commits/master"
      target="_blank"
      rel="noopener noreferrer"
    >
      {process.env.COMMIT_HASH}</a> build.
  </div>
);
