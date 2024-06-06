/**
 * Generates a hash key based on the provided key and hash.
 * Optionally prefixes the key with 'value.' based on the useValuePrefix flag.
 *
 * @param {Object} params - The parameters for generating the hash key.
 * @param {string} params.key - The key to be included in the hash key.
 * @param {string} params.hash - The hash to be included in the hash key.
 * @param {boolean} [params.useValuePrefix=true] - Flag indicating whether to prefix the key with 'value.'.
 * @returns {string} The generated hash key.
 */
function getItemHashKey({ key, hash, useValuePrefix = true }) {
  return useValuePrefix ? `value.${key}.${hash}` : `${key}.${hash}`;
}

module.exports = { getItemHashKey };
