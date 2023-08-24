const { getById } = require('./getById');

/**
 * Checks if the category of a given asset is duplicable. If the category is not duplicable, it throws an HTTP error.
 * @param {object} params - The parameters object
 * @param {string} params.categoryId - The ID of the category
 * @param {object} params.transacting - The transaction object
 * @throws {HttpError} - Throws an HTTP error if the category is not duplicable
 */
async function checkDuplicable({ categoryId, transacting }) {
    const category = await getById(categoryId, { transacting });
    if (!category?.duplicable) {
        throw new global.utils.HttpError(401, 'Assets in this category cannot be duplicated');
    }
}

module.exports = { checkDuplicable };
