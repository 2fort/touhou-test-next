export default function checkResponseStatus(response) {
  if (response.status !== 200) {
    throw new Error(`Resource unavailable: ${response.statusText} (${response.status})`);
  }
}
