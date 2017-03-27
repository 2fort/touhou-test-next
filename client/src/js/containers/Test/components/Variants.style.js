import { style, media } from 'typestyle';
import { color, white } from 'csx';
import * as csstips from 'csstips';

export const buttons = style(csstips.flex, csstips.vertical, csstips.verticallySpaced(12), {
  margin: '.85rem .85rem',
});

export const btn = (bgColor = process.colors.blue, active) => {
  const st = {
    backgroundColor: bgColor,
    borderRadius: '3px',
    boxShadow: '0 2px 5px 0 rgba(0, 0, 0, .26)',
    color: 'rgba(255, 255, 255, .87)',
    fontWeight: 'bold',
    marginBottom: '.85rem',
    padding: '.75rem 1rem',
    textAlign: 'center',
    $nest: {
      '&:hover': {
        backgroundColor: color(bgColor).darken(0.07).toHexString(),
      },
      '&:disabled': {
        $nest: {
          '&:hover': {
            backgroundColor: bgColor,
          },
        },
      },
    },
  };

  return style(st, active && { boxShadow: 'inset 3px 7px 7px rgba(0, 0, 0, .17)' },
    media({ maxWidth: 740 }, {
      fontSize: '.9em',
      padding: '.5rem .7rem',
    }),
    media({ maxWidth: 580 }, {
      fontSize: '.8em',
      padding: '.35rem .5rem',
    }),
  );
};

// /////////////// //

export const btnImg = style(csstips.flex, csstips.horizontal, csstips.wrap, csstips.aroundJustified, {
  margin: '.85rem .85rem .5rem',
});

export const variantOuter = style(csstips.content, csstips.vertical, csstips.center, csstips.centerJustified, {
  backgroundColor: white.toHexString(),
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '7px',
  margin: '0 5px 15px',
});

export const variantOuterActive = style({
  borderColor: '#808080',
});

export const imgButton = style({
  padding: 0,
});

export const transparentImg = style({
  backgroundColor: '#fff',
});

