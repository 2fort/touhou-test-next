import { style, media } from 'typestyle';
import * as csstips from 'csstips';

export const flexContainer = style(csstips.horizontal, csstips.wrap, csstips.aroundJustified, {
  '-ms-flex-align': 'baseline',
  '-webkit-align-items': 'baseline',
  alignItems: 'baseline',
  overflowX: 'auto',
  padding: '0 1rem .5rem',
}, media({ maxWidth: 580 }, { padding: '0 .5rem .5rem' }));

export const flexItem = style(csstips.content, csstips.vertical, csstips.verticallySpaced('.2rem'), {
  width: '150px',
  margin: '.65rem .85rem',
  textAlign: 'center',
  '&:empty': {
    height: 0,
    margin: '0 .85rem',
  },
},
  media({ maxWidth: 580 }, {
    margin: '.5rem .4rem',
    '&:empty': {
      height: 0,
      margin: '0 .4rem',
    },
  },
));

export const thumbnail = style({
  maxWidth: '150px',
  maxHeight: '150px',
});

export const imagelink = style({
  $nest: {
    '&:hover': {
      borderBottom: 0,
    },
  },
});

export const tdCentered = style({
  textAlign: 'center',
});

export const tableImg = style({
  maxWidth: '150px',
  maxHeight: '75px',
});

export const fullTable = style({
  width: '100%',
});

export const bar = style({
  marginBottom: '3px',
});
