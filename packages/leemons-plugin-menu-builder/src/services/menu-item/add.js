const _ = require('lodash');
const { addMenuItemPermissionMany } = require('../../helpers/addPermissionMany');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const constants = require('../../../config/constants');

const { withTransaction, slugify } = global.utils;

/**
 * Create a Menu Item
 * @private
 * @static
 * @param {string} menuSlug - The SLUG which identify the Menu to include the item
 * @param {MenuItemAdd} data - The Menu Item to create
 * @property {MenuPermissionsAdd} permissions Permissions for Menu Item
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function add(
  menuSlug,
  { pluginName, name, parentId, parentSlug, url, window, iconName, iconSvg, label, description },
  permissions,
  { transacting: _transacting } = {}
) {
  const locales = translations();

  return withTransaction(
    async (transacting) => {
      // Check for required params
      if (_.isNil(name)) throw new Error(`Must indicate a NAME to identify the Menu Item`);
      if (!_.isObjectLike(label))
        throw new Error(`Must indicate at least one localized label to display in the Menu Item`);

      // Check if the MENU exists
      const existMenu = await table.menu.findOne({ slug: menuSlug }, { transacting });
      if (!existMenu) throw new Error(`Menu with name '${menuSlug}' doesn't exists`);

      // Check if the MENU ITEM exists
      const slug = `${pluginName}-${slugify(name, { lower: true })}`;
      const existMenuItem = await table.menuItem.count({ slug }, { transacting });
      if (existMenuItem) throw new Error(`Menu item with name '${name}' already exists`);

      // Check if the MENU ITEM PARENT exists
      if (_.isString(parentSlug)) {
        const parentSlugClean = parentSlug.replace(`${pluginName}-`, ''); // Let's clean the SLUG, in case it comes with the plugin name
        const existMenuItemParent = await table.menuItem.count(
          { slug: `${pluginName}-${parentSlugClean}` },
          { transacting }
        );
        if (!existMenuItemParent)
          throw new Error(`Menu item PARENT with name '${parentSlug}' doesn't exists`);
      }
      if (!_.isNil(parentId)) {
        const existMenuItemParent = await table.menuItem.count({ id: parentId }, { transacting });
        if (!existMenuItemParent)
          throw new Error(`Menu item PARENT with ID '${parentId}' doesn't exists`);
      }

      // Create the MENU ITEM
      leemons.log.info(`Creating MenuItem :: '${name}'`);
      const promises = [
        table.menuItem.create(
          { name, slug, pluginName, url, window, iconName, iconSvg },
          { transacting }
        ),
      ];

      // Create LABEL & DESCRIPTIONS in locales
      if (locales) {
        promises.push(
          locales.contents.addManyByKey(`${constants.translationPrefix}.${slug}.label`, label, {
            transacting,
          })
        );

        if (description) {
          promises.push(
            locales.contents.addManyByKey(
              `${constants.translationPrefix}.${slug}.description`,
              description,
              {
                transacting,
              }
            )
          );
        }
      }

      const values = await Promise.all(promises);

      const menuItem = values[0];
      await addMenuItemPermissionMany(menuItem.id, permissions, { transacting });
      return menuItem;
    },
    table.menuItem,
    _transacting
  );
}

module.exports = { add };
