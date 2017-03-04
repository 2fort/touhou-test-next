export const lessThan = num =>
  (value, previousValue) => (parseFloat(value) < num ? value : previousValue);
export const greaterThan = num =>
  (value, previousValue) => (parseFloat(value) > num ? value : previousValue);
