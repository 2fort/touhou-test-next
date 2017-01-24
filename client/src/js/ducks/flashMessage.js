import Immutable from 'seamless-immutable';

// type: success, info, warning, danger

const ADD_FLASH_MESSAGE = 'ADD_FLASH_MESSAGE';
const DELETE_FLASH_MESSAGE = 'DELETE_FLASH_MESSAGE';

export function add(status, text, color) {
  return { type: ADD_FLASH_MESSAGE, status, text, color };
}

export function del() {
  return { type: DELETE_FLASH_MESSAGE };
}

const msgColors = [
  'success',
  'info',
  'warning',
  'danger',
];

export default function msg(state = Immutable({ status: '', text: '', color: '', date: 0 }), action) {
  switch (action.type) {
    case ADD_FLASH_MESSAGE:
      return Immutable.merge(state, {
        status: action.status || '',
        text: action.text,
        type: msgColors[action.color],
        date: new Date(),
      });

    case DELETE_FLASH_MESSAGE:
      return Immutable.merge(state, { status: '', text: '', type: '', date: 0 });

    default: {
      return state;
    }
  }
}
