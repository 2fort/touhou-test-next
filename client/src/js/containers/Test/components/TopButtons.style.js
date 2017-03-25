import { style } from 'typestyle';
import { color } from 'csx';

const blueColor = color('#3f51b5');

export const red = style({
  backgroundColor: '#d32f2f',
});

export const green = style({
  backgroundColor: '#4caf50',
});

export const blue = style({
  backgroundColor: blueColor.lighten(0.05).toHexString(),
});

export const gray = style({
  backgroundColor: '#9b9b9b',
});

export const topbuttons = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  margin: '-1rem auto 1rem',
  maxWidth: '80rem',
});

export const elem = style({
  border: '1px solid rgba(0, 0, 0, .25)',
  boxSizing: 'border-box',
  flex: '1 1 5%',
  marginLeft: '1px',
  marginRight: '1px',
  opacity: '.55',
  zIndex: '-1',
});

export const elemActive = style({
  opacity: 1,
});
