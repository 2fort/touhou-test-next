import { style } from 'typestyle';
import { darkgrey, url, percent, viewWidth } from 'csx';

const thumb = {
  backgroundImage: url('/images/arrow.svg'),
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '20px 30px',
  height: '30px',
};

export const container = style({
  height: '30px',
  margin: '1.25rem auto 0',
  maxWidth: '80rem',
});

export const inside = style({
  backgroundColor: darkgrey.toHexString(),
  borderRadius: '3px',
  height: '7px',
  marginBottom: '8px',
  width: '100%',
});

export function slider(step) {
  return style({
    cursor: 'pointer',
    height: '30px',
    marginTop: '-.4rem',
    padding: 0,
    '-webkit-appearance': 'none',
    background: 'transparent',
    width: percent((100 / 20) * step),
    $nest: {
      '&::-webkit-slider-runnable-track': {
        '-webkit-appearance': 'none',
        background: 'transparent',
      },
      '&::-webkit-slider-thumb': {
        '-webkit-appearance': 'none',
        background: 'transparent',
        width: percent(100 / step),
        ...thumb,
      },
      '&::-moz-range-track': {
        '-moz-appearance': 'none',
        background: 'transparent',
        border: 0,
      },
      '&::-moz-range-thumb': {
        '-moz-appearance': 'none',
        background: 'transparent',
        border: 0,
        width: percent(100 / step),
        ...thumb,
      },
      '&::-ms-track': {
        background: 'transparent',
        borderColor: 'transparent',
        color: 'transparent',
      },
      '&::-ms-thumb': {
        background: 'transparent',
        border: 0,
        width: viewWidth(100 / step),
        ...thumb,
      },
      '&::-ms-fill-lower': {
        backgroundColor: 'transparent',
      },
      '&::-ms-fill-upper': {
        backgroundColor: 'transparent',
      },
      '&:focus': {
        outline: 'none',
      },
      '&::-moz-focus-outer': {
        border: 0,
      },
    },
  });
}
