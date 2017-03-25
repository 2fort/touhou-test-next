import { style } from 'typestyle';
import { percent } from 'csx';

export const table = {
  main: style({
    width: '100%',
    tableLayout: 'fixed',
  }),
};

export const tbody = {
  loading: style({
    opacity: '.5',
  }),
};

export const td = {
  width: num => style({
    width: percent(num),
  }),

  withImage: style({
    $nest: {
      '& img': {
        maxWidth: '125px',
        maxHeight: '75px',
      },
    },
  }),

  tooWide: style({
    wordBreak: 'break-all',
  }),

  tooShort: style({
    minWidth: '115px',
  }),
};
