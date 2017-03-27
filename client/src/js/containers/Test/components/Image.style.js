import { style } from 'typestyle';
import * as csstips from 'csstips';

export const imgContainer = style(csstips.flex3, csstips.horizontal, csstips.centerJustified, csstips.center, {
  background: '#fefefe',
});

export const innerContainer = style(csstips.content, {
  maxWidth: '100%',
});

export const img = style({
  maxWidth: '100%',
});
