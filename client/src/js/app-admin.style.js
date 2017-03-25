import { cssRaw, cssRule } from 'typestyle';
import { setupPage } from 'csstips';

import * as progress from 'react-progress-bar-plus/lib/progress-bar.css';

cssRaw(progress);

setupPage('#example');

cssRule('html', {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '14px',
});
