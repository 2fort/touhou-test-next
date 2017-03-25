import { style, media } from 'typestyle';
import { color, white } from 'csx';

const blueColor = color('#3f51b5');

export const blue = style({
  backgroundColor: blueColor.toHexString(),
  $nest: {
    '&:hover': {
      backgroundColor: blueColor.darken(0.07).toHexString(),
    },
    '&:disabled': {
      $nest: {
        '&:hover': {
          backgroundColor: blueColor.toHexString(),
        },
      },
    },
  },
});

export const red = style({
  backgroundColor: '#d32f2f',
});

export const green = style({
  backgroundColor: '#4caf50',
});

export const whiteColor = style({
  backgroundColor: white.toHexString(),
});

export const buttons = style({
  display: 'flex',
  flex: '1 1 22%',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  margin: '.85rem .85rem 0',
});

export const btn = style({
  borderRadius: '3px',
  boxShadow: '0 2px 5px 0 rgba(0, 0, 0, .26)',
  color: 'rgba(255, 255, 255, .87)',
  fontWeight: 'bold',
  marginBottom: '.85rem',
  padding: '.75rem 1rem',
  textAlign: 'center',
}, media({ maxWidth: 740 }, {
  fontSize: '.9em',
  padding: '.5rem .7rem',
}),
  media({ maxWidth: 580 }, {
    fontSize: '.8em',
    padding: '.35rem .5rem',
  }),
);

export const btnActive = style({
  boxShadow: 'inset 3px 7px 7px rgba(0, 0, 0, .17)',
});

// /////////////// //

export const btnImg = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  margin: '.85rem .85rem 0',
  justifyContent: 'space-around',
  padding: 0,
});

export const variantOuter = style({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  alignContent: 'center',
  border: '1px solid #ddd',
  borderRadius: '4px',
  marginBottom: '.85rem',
  padding: '.5rem',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
});

export const variantOuterActive = style({
  borderColor: '#808080',
});

export const transparentImg = style({
  backgroundColor: '#fff',
});

