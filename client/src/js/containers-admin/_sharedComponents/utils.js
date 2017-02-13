export function prepareFormData(values, files, fileFiedName) {
  const newValues = Object.assign({}, values);
  const formData = new FormData();

  // if files === object & no file inside, then previous image (if was) will be deleted
  if (files) {
    newValues[fileFiedName] = '';
  }

  // we have a file! File will be added, or replaced
  if (files && files[0]) {
    formData.append(fileFiedName, files[0], files[0].name);
  }

  // delete all unnecessary fields
  delete newValues.id;
  delete newValues.slug;

  formData.append('payload', JSON.stringify(newValues));

  return formData;
}

export function parseQuery({ sort, filter, page, limit }) {
  return Object.assign(
    {}, sort && { sort }, filter && { filter }, page && { page: Number(page) }, limit && { limit: Number(limit) },
  );
}
