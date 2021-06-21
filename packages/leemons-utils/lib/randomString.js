/**
 * Generate long random string
 * @public
 * @static
 * @return {string}
 * */
function randomString() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

module.exports = randomString;
