import { style, media } from 'typestyle';

export const imgContainer = style({
  background: '#fefefe',
  flex: '1 1 67%',
  margin: 'auto 0',
  textAlign: 'center',
});

export const img = style({
  marginBottom: '-4px',
  maxHeight: '768px',
  maxWidth: '95%',
}, media({ maxHeight: 768 }, { maxHeight: '80vmin' }),
  media({ maxHeight: 415 }, { maxHeight: '75vmin' }),
);
