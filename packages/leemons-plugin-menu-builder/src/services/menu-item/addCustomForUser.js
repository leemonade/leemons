const _ = require('lodash');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const addItemPermissions = require('../../helpers/addItemPermissions');
const {
  validateExistMenuItem,
  validateNotExistMenu,
  validateNotExistMenuItem,
} = require('../../validations/exists');

const { withTransaction } = global.utils;

// plugins.menu-builder.plugins.menu-builder.main.plugins.menu-builder.user:a3578518-b547-4059-8afb-3d715a623b6d.user-list-22.8jrwn3fd8me1ulvna75wgjws2xj0c9a6n.label

/**
 * Create a Menu Item
 * @private
 * @static
 * @param {any} _userAuth User auth
 * @param {MenuItemAdd} data - The Menu Item to create
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function addCustomForUser(
  _userAuth,
  { label, description, ...data },
  { transacting: _transacting } = {}
) {
  const locales = translations();

  const userAuths = _.isArray(_userAuth) ? _userAuth : [_userAuth];

  // eslint-disable-next-line no-param-reassign
  data.key = leemons.plugin.prefixPN(
    `user.${userAuths[0].user}.${data.key}.${global.utils.randomString()}`
  );

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

      // Create LABEL & DESCRIPTIONS in locales
      if (locales) {
        if (label) {
          promises.push(
            locales.contents.add(
              leemons.plugin.prefixPN(`${data.menuKey}.${data.key}.label`),
              userAuths[0].locale,
              label,
              {
                transacting,
              }
            )
          );
        }

        if (description) {
          promises.push(
            locales.contents.add(
              leemons.plugin.prefixPN(`${data.menuKey}.${data.key}.description`),
              userAuths[0].locale,
              description,
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
          _.map(userAuths, 'id'),
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
