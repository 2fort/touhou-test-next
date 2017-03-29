import { style } from 'typestyle';
import { color } from 'csx';
import * as csstips from 'csstips';

export const red = style({
  backgroundColor: process.colors.red,
});

export const green = style({
  backgroundColor: process.colors.green,
});

export const blue = style({
  backgroundColor: color(process.colors.blue).lighten(0.05).toHexString(),
});

export const gray = style({
  backgroundColor: process.colors.gray,
});

export const topbuttons = style(csstips.horizontal, {
  margin: '-1rem auto 1rem',
});

export const elem = style(csstips.flex, {
  border: '1px solid rgba(0, 0, 0, .25)',
  marginLeft: '1px',
  marginRight: '1px',
  opacity: '.55',
  zIndex: '-1',
});

export const elemActive = style({
  opacity: 1,
});
