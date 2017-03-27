import { cssRaw, cssRule } from 'typestyle';
import { normalize, setupPage } from 'csstips';

import * as tables from 'purecss/build/tables-min.css';
import * as forms from 'purecss/build/forms-min.css';
import * as buttons from 'purecss/build/buttons-min.css';

cssRaw(tables);
cssRaw(forms);
cssRaw(buttons);

normalize();
setupPage('#touhou');

cssRule('html', {
  backgroundColor: '#f5f5f5',
  fontFamily: 'Arial, Helvetica, Tahoma, sans-serif',
  fontSize: '16px',
});

cssRule('body', {
  margin: '0 auto',
});

cssRule('h1', 'h2', {
  margin: '0 0 .5rem',
});

cssRule('a', {
  color: '#077ed9',
  textDecoration: 'none',
  $nest: {
    '&:hover': {
      borderBottom: '1px solid #077ed9',
    },
  },
});

cssRule('button', {
  fontFamily: 'Arial, Helvetica, Tahoma, sans-serif',
  background: 'none',
  border: 0,
  cursor: 'pointer',
  $nest: {
    '&:focus': {
      outline: 'none',
    },
    '&:disabled': {
      cursor: 'default',
    },
  },
});

cssRule('input', {
  fontFamily: 'Arial, Helvetica, Tahoma, sans-serif',
});
