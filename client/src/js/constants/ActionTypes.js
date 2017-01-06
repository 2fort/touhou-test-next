// Characters actions
export const CHANGE_MODE = 'CHARACTERS/CHANGE_MODE';

// Test actions
const testPrefix = 'TEST/';
export const TEST_BEGIN = `${testPrefix}BEGIN`;
export const TEST_END = `${testPrefix}END`;

export const TEST_SET_STEP = `${testPrefix}SET_STEP`;

export const TEST_OPEN_RESULTS_WINDOW = `${testPrefix}OPEN_RESULTS_WINDOW`;
export const TEST_CLOSE_RESULTS_WINDOW = `${testPrefix}CLOSE_RESULTS_WINDOW`;

export const TEST_RESET = `${testPrefix}RESET_TEST`;
export const TEST_ANSWER_GIVEN = `${testPrefix}ANSWER_GIVEN`;

// mounting actions
export const COMPONENT_MOUNT = 'COMPONENT_MOUNT';
export const COMPONENT_UNMOUNT = 'COMPONENT_UNMOUNT';
export const COMPONENT_DESTROY = 'COMPONENT_DESTROY';

// fetching actions
export const FETCH_BEGIN = 'FETCH_BEGIN';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAIL = 'FETCH_FAIL';
