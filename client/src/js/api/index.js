// Code handles json regardless of the response.status
// Also in case of network error, rejects with a custom error object
// https://github.com/github/fetch/issues/203

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON, status from the response
 */
function parseJSON(response) {
  const remember = {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    headers: {
      total: response.headers.get('X-Total-Count'),
    },
  };
  return new Promise(resolve =>
    // at this point response can be:
    // 1) 200-299 OK response with json from server
    // 2) error (400-500, etc.) response from server with json payload
    // 3) error response from server without json payload
    // 4) error response from fetch (like 404) if server is unreachable
    response.json()
      // 1), 2)
      .then(json => resolve({ json, ...remember }))
      // 3), 4)
      .catch(() => resolve(remember)),
    );
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {Promise}           The request promise
 */
export default function request(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    fetch(endpoint, options)
      .then(parseJSON)
      .then((response) => {
        // response can be OK and without json
        if (response.ok) {
          return resolve(response);
        }

        // if json exists, return json
        if (response.json) {
          reject({ status: response.status, message: response.json.message });
        }

        // if not, return message
        return reject({ status: response.status, message: response.statusText });
      })
      // catch network error
      .catch(error => reject({ message: error.message }));
  });
}
