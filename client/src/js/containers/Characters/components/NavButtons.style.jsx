import { style, media } from 'typestyle';

export const navContainer = style({
  display: 'flex',
  flex: '1 1 1%',
  textAlign: 'center',
  transition: 'all .2s',
});

export const navItem = style({
  alignItems: 'center',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  fontSize: '2rem',
  justifyContent: 'center',
  padding: '0 6px',
  transition: 'all .2s',
  $nest: {
    '&:disabled': {
      backgroundColor: '#fff',
      color: '#9b9b9b',
      $nest: {
        '&:hover': {
          backgroundColor: '#fff',
        },
      },
    },
    '&:hover': {
      backgroundColor: '#f0efef',
      textDecoration: 'none',
      border: 0,
    },
  },
}, media({ maxWidth: 740 }, { padding: '0 4px' }));
