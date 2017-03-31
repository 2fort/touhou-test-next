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
      textDecoration: 'none',
      borderBottom: 0,
    },
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: '#f0efef',
      },
    },
    '@media (-moz-touch-enabled: 0)': {
      '&:hover': {
        backgroundColor: '#f0efef',
      },
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
