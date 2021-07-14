const _ = require('lodash');
const prefixPN = require('../../helpers/prefixPN');
const { translations } = require('../../translations');

/**
 * Create a Menu Item
 * @private
 * @static
 * @param {MenuItem[]} menuItems - Array of menu items to transform in frotendMenu
 * @param {string} locale - locale to get texts
 * @param {any=} transacting - DB Transaction
 * @return {MenuItem[]} Frontend Menu
 * */
async function transformManyMenuItemsToFrontEndMenu(menuItems, locale, { transacting } = {}) {
  const translationItems = await translations().contents.getManyWithLocale(
    menuItems.reduce((acc, menuItem) => {
      acc.push(prefixPN(`${menuItem.menuKey}.${menuItem.key}.label`));
      acc.push(prefixPN(`${menuItem.menuKey}.${menuItem.key}.description`));
      return acc;
    }, []),
    locale,
    { transacting }
  );

  // We set each text in its item
  const translationItemsByKey = _.keyBy(translationItems, 'key');

  const notFoundLabelsKeys = [];
  const notFoundDescriptionsKeys = [];

  _.forEach(menuItems, (_menuItem) => {
    const menuItem = _menuItem;
    const labelKey = prefixPN(`${menuItem.menuKey}.${menuItem.key}.label`);
    const descriptionKey = prefixPN(`${menuItem.menuKey}.${menuItem.key}.description`);
    if (Object.prototype.hasOwnProperty.call(translationItemsByKey, labelKey)) {
      menuItem.label = translationItemsByKey[labelKey];
    } else {
      notFoundLabelsKeys.push(labelKey);
    }
    if (Object.prototype.hasOwnProperty.call(translationItemsByKey, descriptionKey)) {
      menuItem.description = translationItemsByKey[descriptionKey];
    } else {
      notFoundDescriptionsKeys.push(descriptionKey);
    }
  });

  // We set up the menu levels and their order
  const sortMenuItems = _.sortBy(menuItems, ['fixed', 'order']);

  const finalMenu = _.filter(sortMenuItems, (item) => !item.parentKey);

  _.forEach(sortMenuItems, (_parentItem) => {
    const parentItem = _parentItem;
    parentItem.childrens = _.filter(sortMenuItems, (item) => item.parentKey === parentItem.key);
  });

  return finalMenu;
}

module.exports = transformManyMenuItemsToFrontEndMenu;
