export default function checkResponseStatus(response) {
  if (response.status === 404) {
    throw new Error('Resource not found');
  }

  if (response.status !== 404 && response.status !== 200) {
    throw new Error(`Internal server error: ${response.statusText}`);
  }
}
