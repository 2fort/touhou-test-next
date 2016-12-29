import { PropTypes } from 'react';

export const IStep = {
  step: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  passed: PropTypes.bool.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.string).isRequired,
  rightAnswer: PropTypes.string.isRequired,
  givenAnswer: PropTypes.string.isRequired,
};
