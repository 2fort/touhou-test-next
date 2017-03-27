import { style, media, classes } from 'typestyle';
import * as csstips from 'csstips';

export const menu = style({
  backgroundColor: '#222',
  boxShadow: '0 0 1px 1px rgba(0, 0, 0, .14), 0 0 2px 2px rgba(0, 0, 0, .098), 0 0 5px 1px rgba(0, 0, 0, .084)',
});

export const collapsible = style(csstips.horizontal, csstips.wrap,
  media({ maxWidth: 750 }, { ...csstips.vertical, width: '100%' }),
);

export const collapsibleHidden = classes(
  collapsible,
  style(
    media({ maxWidth: 750 }, { display: 'none' }),
  ),
);

export const nav = style(csstips.horizontal, csstips.wrap, {
  margin: '0 auto',
  padding: '0 8px',
  maxWidth: '80rem',
});

const navLinkElement = {
  color: '#ebebeb',
  opacity: '.9',
  padding: '.7rem .35rem',
  $nest: {
    '&:hover': {
      opacity: 1,
    },
  },
};

export const link = style(navLinkElement, {
  fontSize: '.9rem',
  marginLeft: '.5rem',
  textDecoration: 'none',
  borderTop: '2px transparent solid',
  borderBottom: '2px transparent solid',
  $nest: {
    '&:hover': {
      borderBottom: '2px #077ed9 solid',
    },
  },
});

export const logo = style(navLinkElement, {
  fontSize: '1.1rem',
  marginRight: 'auto',
  marginLeft: 0,
  $nest: {
    '&:hover': {
      border: 0,
    },
  },
});

export const reload = style(navLinkElement, {
  fontSize: '.9rem',
  marginRight: 'auto',
  marginLeft: 0,
});

export const burger = style(navLinkElement, {
  fontSize: '.9rem',
}, media({ minWidth: 750 }, { display: 'none' }),
);

export const active = style({
  opacity: 1,
  borderBottom: '2px #077ed9 solid',
});

export const desktopOnly = style(
  media({ maxWidth: 740 }, { display: 'none' }),
);
