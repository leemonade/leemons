/**
 * Adds a new category. If the category already exists or if the required fields are not provided, it throws an HTTP error.
 *
 * @async
 * @function add
 * @param {Object} params - The main parameter object.
 * @param {Object} params.data - The data of the category to add.
 * @param {string} params.data.key - The key of the category.
 * @param {Object} params.data.menu - The menu of the category.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<object>} The new category if it is successfully added.
 * @throws {LeemonsError} If the category already exists or if the required fields are not provided, a LeemonsError is thrown.
 */
const { isEmpty } = require('lodash');

const { LeemonsError } = require('@leemons/error');

const { exists } = require('../exists');
const { categoriesMenu } = require('../../../config/constants');

async function add({ data, ctx }) {
  const { menu, ...categoryData } = data;

  if (isEmpty(categoryData.key)) {
    throw new LeemonsError(ctx, {
      message: 'Category `key` is required',
      httpStatusCode: 400,
    });
  }

  if (isEmpty(menu)) {
    throw new LeemonsError(ctx, {
      message: 'Category `menu` is required',
      httpStatusCode: 400,
    });
  }

  try {
    let newCategory = null;
    if (!(await exists({ categoryData, ctx }))) {
      newCategory = await ctx.tx.db.Categories.create({
        ...categoryData,
        canUse: JSON.stringify(categoryData.canUse),
        pluginOwner: ctx.callerPlugin,
        componentOwner: categoryData.componentOwner || ctx.callerPlugin,
      });
    }

    // Add Menu item

    const menuItem = {
      removed: menu.removed,
      item: { ...menu.item, key: categoryData.key, order: menu.order ?? categoryData.order },
      permissions: menu.permissions,
    };
    await ctx.tx.call('menu-builder.menuItem.addItemsFromPlugin', {
      itemsData: menuItem,
      shouldWait: false,
      menuKey: categoriesMenu.key,
    });

    return newCategory;
  } catch (e) {
    ctx.logger.error(e);
    throw new LeemonsError(ctx, {
      message: `Failed to register category: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { add };
