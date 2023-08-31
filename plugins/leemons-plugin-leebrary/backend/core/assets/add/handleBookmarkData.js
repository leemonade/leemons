const { isEmpty, isNil, isString, trim } = require('lodash');
const got = require('got');
const metascraper = require('../../shared/metascraper');

/**
 * Handles bookmark data.
 * Checks URL and icon validity, fetches and updates metadata if valid.
 * Updates cover with fetched image or provided cover.
 * Updates icon with fetched logo if available.
 *
 * @async
 * @param {Object} params - The parameters for the function.
 * @param {Object} params.data - The data of the bookmark.
 * @param {string} params.data.categoryKey - The category key of the bookmark.
 * @param {string} [params.data.url] - The url of the bookmark
 * @param {string} [params.data.icon] - The icon of the bookmark.
 * @param {string} params.data.name - The name of the bookmark.
 * @param {string} params.data.description - The description of the bookmark.
 * @param {string} params.data.cover - The cover of the asset.
 * @param {string} params.cover - The cover of the bookmark.
 * @param {MoleculerContext} params.ctx Moleculer context
 * @returns {Promise<[Object, string]>} The handled bookmark data as a tuple [data, cover].
 */
async function handleBookmarkData({ data, cover, ctx }) {
  if (isString(data.url) && !isEmpty(data.url) && (isNil(data.icon) || isEmpty(data.icon))) {
    try {
      const { body: html } = await got(data.url);
      const metas = await metascraper({ html, url: data.url });
      data.name = !isEmpty(data.name) && data.name !== 'null' ? data.name : metas.title;
      data.description = data.description || metas.description;

      if (isEmpty(trim(data.cover))) data.cover = null;

      data.cover = cover ?? metas.image;
      cover = data.cover;

      if (!isEmpty(metas.logo)) {
        data.icon = data.icon || metas.logo;
      }
    } catch (err) {
      ctx.logger.error('Error getting bookmark metadata:', data.url, err);
    }
  }
  return [data, cover];
}

module.exports = { handleBookmarkData };
