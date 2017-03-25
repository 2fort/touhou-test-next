import { style, media } from 'typestyle';

export const header = style({
  margin: '0 0 1rem',
  textAlign: 'center',
});

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
});

export const body = style({
  display: 'flex',
  flex: '1 1 99%',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  boxSizing: 'border-box',
});

export const desc = style({
  flex: '1 1 50%',
  wordBreak: 'break-all',
});

export const pDesc = style({
  padding: '0 1.5rem',
}, media({ maxWidth: 740 }, { padding: 0 }));

export const imgContainer = style({
  flex: '1 1 50%',
  textAlign: 'center',
}, media({ maxWidth: 740 }, {
  flex: '1 1 51%',
  padding: 0,
}));

export const img = style({
  maxWidth: '100%',
  height: 'auto',
  padding: '0 1rem',
  boxSizing: 'border-box',
}, media({ maxWidth: 740 }, { padding: 0 }));
