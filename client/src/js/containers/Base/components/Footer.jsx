import React from 'react';
import { style } from 'typestyle';

const st = style({
  fontSize: '.9rem',
  margin: '1rem auto',
  maxWidth: '80rem',
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
      {process.commitHash.COMMIT_HASH}</a> build.
  </div>
);
