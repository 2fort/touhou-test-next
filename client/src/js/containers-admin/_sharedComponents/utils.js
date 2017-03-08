export const removeEmpty = (values) => {
  const obj = Object.assign({}, values);
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
    else if (obj[key] === '') delete obj[key];
  });
  return obj;
};

export function getEventPath(event) {
  if (event.nativeEvent.composedPath) {
    return event.nativeEvent.composedPath();
  }

  const path = [];
  let target = event.target;

  while (target.parentNode) {
    path.push(target);
    target = target.parentNode;
  }

  return path;
}
