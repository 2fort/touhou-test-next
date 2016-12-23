import { dispatch } from './store/configureStore';
import { beginTest, showResetButton, hideResetButton } from './actions/testActions';

export class test {
  static enter() {
    dispatch(beginTest());
    dispatch(showResetButton());
  }

  static leave() {
    dispatch(hideResetButton());
  }
}
