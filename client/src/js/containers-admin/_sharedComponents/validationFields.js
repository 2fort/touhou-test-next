export const required = value => (value ? undefined : 'Required');
export const number = value => (value && isNaN(Number(value)) ? 'Must be a number' : undefined);
export const maxValue = max => value => (value && value > max ? `Must be less or equal ${max}` : undefined);
export const moreThan0 = value => (value && value <= 0 ? 'Must be more than 0' : undefined);
export const minLength = min => value =>
  (value && value.length < min ? `Minimum ${min} characters required` : undefined);
export const minLength2 = minLength(2);
