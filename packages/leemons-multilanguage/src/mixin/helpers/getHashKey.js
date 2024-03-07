/**
 * Generates a hash key based on the provided locale and hash.
 * Optionally prefixes the key with 'value.' based on the useValuePrefix flag.
 *
 * @param {Object} params - The parameters for generating the hash key.
 * @param {string} params.locale - The locale to be included in the hash key.
 * @param {string} params.hash - The hash to be included in the hash key.
 * @param {boolean} [params.useValuePrefix=true] - Flag indicating whether to prefix the key with 'value.'.
 * @returns {string} The generated hash key.
 */
function getHashKey({ locale, hash, useValuePrefix = true }) {
  return useValuePrefix ? `value.${locale}.${hash}` : `${locale}.${hash}`;
}

module.exports = { getHashKey };
