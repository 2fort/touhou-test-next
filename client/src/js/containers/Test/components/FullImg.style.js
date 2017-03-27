import { style } from 'typestyle';

export const btnExpand = style({
  border: '1px solid #ddd',
  borderRadius: '4px',
  marginTop: '3px',
  width: '32px',
  backgroundColor: '#fff',
  padding: '1px',
  $nest: {
    '&:hover': {
      borderColor: '#808080',
    },
  },
});

export const fullimg = style({
  maxWidth: '100%',
  maxHeight: '100%',
  position: 'fixed',
  top: '50%',
  left: '50%',
  zIndex: '10001',
  backgroundColor: '#fff',
  transform: 'translate(-50%, -50%)',
  cursor: 'zoom-out',
});
