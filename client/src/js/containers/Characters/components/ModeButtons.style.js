import { style, media } from 'typestyle';

export const btn = style({
  textAlign: 'right',
  fontSize: '.95rem',
});

export const desktopOnly = style(
  media({ maxWidth: 740 }, { display: 'none' }),
);
