import { style } from 'typestyle';

export const home = style({
  padding: '1.5rem 3rem',
  fontSize: '1.25rem',
  textAlign: 'center',
});

export const btnSimple = style({
  fontSize: '1.5rem',
  color: '#fff',
  backgroundColor: '#db4437',
  borderRadius: '10px',
  boxShadow: '0 2px 10px 2px rgba(0, 0, 0, .44)',
  border: 0,
  padding: '.5rem 1rem',
  margin: '1.5rem .5rem',
  $nest: {
    '&:focus': {
      outline: 'none',
    },
    '&:active': {
      boxShadow: 'inset 0 2px 10px 2px rgba(0, 0, 0, .44)',
    },
  },
});
