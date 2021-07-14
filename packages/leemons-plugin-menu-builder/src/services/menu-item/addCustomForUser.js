const _ = require('lodash');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const prefixPN = require('../../helpers/prefixPN');
const addItemPermissions = require('../../helpers/addItemPermissions');
const {
  validateExistMenuItem,
  validateNotExistMenu,
  validateNotExistMenuItem,
} = require('../../validations/exists');

const { withTransaction } = global.utils;

/**
 * Create a Menu Item
 * @private
 * @static
 * @param {any} userAuth User auth
 * @param {MenuItemAdd} data - The Menu Item to create
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function addCustomForUser(
  userAuth,
  { label, description, ...data },
  { transacting: _transacting } = {}
) {
  const locales = translations();

  // eslint-disable-next-line no-param-reassign
  data.key = prefixPN(`user:${userAuth.id}.${data.key}`);

  return withTransaction(
    async (transacting) => {
      // Check for required params
      await validateNotExistMenu(data.menuKey, { transacting });

      // Check if the MENU ITEM exists
      await validateExistMenuItem(data.menuKey, data.key, { transacting });

      // Check if the MENU ITEM PARENT exists
      await validateNotExistMenuItem(data.menuKey, data.parentKey, { transacting });

      // Create the MENU ITEM
      const promises = [table.menuItem.create(data, { transacting })];

      // TODO Change to user locale
      const locale = 'en';

      // Create LABEL & DESCRIPTIONS in locales
      if (locales) {
        if (label) {
          promises.push(
            locales.contents.addManyByKey(
              prefixPN(`${data.menuKey}.${data.key}.label`),
              { [locale]: label },
              {
                transacting,
              }
            )
          );
        }

        if (description) {
          promises.push(
            locales.contents.addManyByKey(
              prefixPN(`${data.menuKey}.${data.key}.description`),
              { [locale]: description },
              {
                transacting,
              }
            )
          );
        }
      }

      // Add the necessary permissions to view the item
      promises.push(
        addItemPermissions(
          data.key,
          `${data.menuKey}.menu-item.custom`,
          [
            {
              permissionName: data.key,
              actionNames: ['view', 'admin'],
            },
          ],
          { isCustomPermission: true, transacting }
        )
      );

      promises.push(
        leemons.plugins.users.services.users.addCustomPermission(
          userAuth.id,
          {
            permissionName: data.key,
            actionNames: ['admin'],
          },
          { transacting }
        )
      );

      const [menuItem] = await Promise.all(promises);

      leemons.log.info(`Added custom menu item "${data.key}" to menu "${data.menuKey}"`);

      return menuItem;
    },
    table.menuItem,
    _transacting
  );
}

module.exports = addCustomForUser;
