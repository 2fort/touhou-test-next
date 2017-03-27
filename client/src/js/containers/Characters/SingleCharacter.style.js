import { style, media } from 'typestyle';
import * as csstips from 'csstips';

export const header = style({
  margin: '0 0 1rem',
  textAlign: 'center',
});

export const container = style(csstips.horizontal);

export const body = style(csstips.flex, csstips.horizontal, csstips.wrap,
  media({ maxWidth: 740 }, csstips.vertical),
);

export const desc = style(csstips.flex6, {
  wordBreak: 'break-all',
});

export const pDesc = style({
  padding: '0 1.5rem',
}, media({ maxWidth: 740 }, { padding: 0 }));

export const imgContainer = style(csstips.flex6, {
  textAlign: 'center',
}, media({ maxWidth: 740 }, {
  padding: 0,
}));

export const img = style({
  maxWidth: '100%',
  padding: '0 1rem',
}, media({ maxWidth: 740 }, { padding: 0 }));
