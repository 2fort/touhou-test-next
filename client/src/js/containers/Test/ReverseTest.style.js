import { style } from 'typestyle';
import * as csstips from 'csstips';

export const reverseTest = style(csstips.horizontal, {
  background: '#f9f9f9',
  borderRadius: '2px',
  boxShadow: '0 1px 4px 0 rgba(0, 0, 0, .14)',
  padding: 0,
});

export const testCenter = style(csstips.flex);

export const characterName = style({
  margin: '1rem auto',
  textAlign: 'center',
});
