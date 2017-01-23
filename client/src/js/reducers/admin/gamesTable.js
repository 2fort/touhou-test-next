import Immutable from 'seamless-immutable';
import * as types from '../../constants/ActionTypes';

const defaultState = Immutable({
  newGameModalVisible: false,
  editGameModalVisible: false,
  editFormInitValues: {},
});

function reducer(state = null, action) {
  switch (action.type) {
    case types.NEW_GAME_MODAL_OPEN: {
      return Immutable.merge(state, { newGameModalVisible: true });
    }

    case types.NEW_GAME_MODAL_CLOSE: {
      return Immutable.merge(state, { newGameModalVisible: false });
    }

    case types.EDIT_GAME_MODAL_OPEN: {
      return Immutable.merge(state, { editGameModalVisible: true, editFormInitValues: action.initValues });
    }

    case types.EDIT_GAME_MODAL_CLOSE: {
      return Immutable.merge(state, { editGameModalVisible: false, editFormInitValues: {} });
    }

    default: {
      return state;
    }
  }
}

const gamesTable = {
  defaultState,
  reducer,
};

export default gamesTable;
