// mounting actions
export const CONTAINER_MOUNT = 'CONTAINER_MOUNT';
export const CONTAINER_UNMOUNT = 'CONTAINER_UNMOUNT';
export const CONTAINER_DESTROY = 'CONTAINER_DESTROY';

// fetching actions
export const FETCH_BEGIN = 'FETCH_BEGIN';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAIL = 'FETCH_FAIL';

// form submit actions
export const SUBMIT_SUCCESS = 'SUBMIT_SUCCESS';
export const SUBMIT_FAIL = 'SUBMIT_FAIL';

// flash messages actions
export const FLUSH_MSG = 'FLUSH_MSG';

/* ////////////////////// */

// Characters actions
export const CHANGE_MODE = 'CHARACTERS/CHANGE_MODE';

// Test actions
const testPrefix = 'Test';
export const TEST_BEGIN = `${testPrefix}/BEGIN`;
export const TEST_END = `${testPrefix}/END`;

export const TEST_SET_STEP = `${testPrefix}/SET_STEP`;

export const TEST_OPEN_RESULTS_WINDOW = `${testPrefix}/OPEN_RESULTS_WINDOW`;
export const TEST_CLOSE_RESULTS_WINDOW = `${testPrefix}/CLOSE_RESULTS_WINDOW`;

export const TEST_RESET = `${testPrefix}/RESET_TEST`;
export const TEST_ANSWER_GIVEN = `${testPrefix}/ANSWER_GIVEN`;

// GamesTable actions
const gamesTablePrefix = 'GamesTable';
export const NEW_GAME_MODAL_OPEN = `${gamesTablePrefix}/NEW_GAME_MODAL_OPEN`;
export const NEW_GAME_MODAL_CLOSE = `${gamesTablePrefix}/NEW_GAME_MODAL_CLOSE`;
export const EDIT_GAME_MODAL_OPEN = `${gamesTablePrefix}/EDIT_GAME_MODAL_OPEN`;
export const EDIT_GAME_MODAL_CLOSE = `${gamesTablePrefix}/EDIT_GAME_MODAL_CLOSE`;
