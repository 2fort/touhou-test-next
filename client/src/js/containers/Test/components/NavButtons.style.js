import { style, media } from 'typestyle';
import { white } from 'csx';
import * as csstips from 'csstips';

export const navContainer = style(csstips.horizontal, csstips.content, {
  transition: 'all .2s',
});

export const navItem = style(csstips.horizontal, csstips.center, {
  backgroundColor: white.toHexString(),
  fontSize: '2rem',
  transition: 'all .2s',
  padding: '0 5px',
  $nest: {
    '&:hover': {
      backgroundColor: '#f0efef',
      textDecoration: 'none',
      border: 0,
    },
    '&:disabled': {
      backgroundColor: white.toHexString(),
      color: process.colors.gray,
      $nest: {
        '&:hover': {
          backgroundColor: white.toHexString(),
        },
      },
    },
  },
}, media({ maxWidth: 740 }, { padding: '0 4px' }));
