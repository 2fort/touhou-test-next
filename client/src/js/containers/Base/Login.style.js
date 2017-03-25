import { style } from 'typestyle';
import { red } from 'csx';

export const loginContainer = style({
  margin: '3rem auto',
  textAlign: 'center',
});

export const elem = style({
  marginLeft: '5px',
});

export const error = style({
  color: red.toHexString(),
});
