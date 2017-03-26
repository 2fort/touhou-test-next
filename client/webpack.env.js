const commitHash = require('child_process').execSync('git rev-parse --short HEAD').toString();

module.exports = BASE_URL => ({
  'process.env': {
    NODE_ENV: JSON.stringify('development'),
    COMMIT_HASH: JSON.stringify(commitHash),
    BASE_URL: JSON.stringify(BASE_URL),
    IMG_ORIG: JSON.stringify('/images/l/'),
    IMG_COMPRESSED: JSON.stringify('/images/m/'),
    IMG_THUMBNAIL: JSON.stringify('/images/s/'),
  },
});
