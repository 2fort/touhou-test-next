const commitHash = require('child_process').execSync('git rev-parse --short HEAD').toString();

module.exports = (NODE_ENV, BASE_URL) => ({
  'process.env': {
    NODE_ENV: JSON.stringify(NODE_ENV),
    COMMIT_HASH: JSON.stringify(commitHash),
    BASE_URL: JSON.stringify(BASE_URL),
    IMG_ORIG: JSON.stringify('/images/l/'),
    IMG_COMPRESSED: JSON.stringify('/images/m/'),
    IMG_THUMBNAIL: JSON.stringify('/images/s/'),
  },
  'process.colors': {
    blue: JSON.stringify('#3f51b5'),
    red: JSON.stringify('#d32f2f'),
    green: JSON.stringify('#4caf50'),
    gray: JSON.stringify('#9b9b9b'),
  },
});
