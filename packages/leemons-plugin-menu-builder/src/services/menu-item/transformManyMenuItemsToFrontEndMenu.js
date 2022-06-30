const _ = require('lodash');
const { translations } = require('../../translations');

function setLabelAndDescriptionToItems(menuItems, translationItemsByKey) {
  const notFoundLabelsKeys = [];
  const notFoundDescriptionsKeys = [];

  _.forEach(menuItems, (_menuItem) => {
    const menuItem = _menuItem;
    const labelKey = leemons.plugin.prefixPN(`${menuItem.menuKey}.${menuItem.key}.label`);
    const descriptionKey = leemons.plugin.prefixPN(
      `${menuItem.menuKey}.${menuItem.key}.description`
    );
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
  return { menuItems, notFoundLabelsKeys, notFoundDescriptionsKeys };
}

/**
 * Create a Menu Item
 * @private
 * @static
 * @param {MenuItem[]} menuItems - Array of menu items to transform in frotendMenu
 * @param {string} locale - locale to get texts
 * @param {string[]} customItemIds - Custom item ids
 * @param {any=} transacting - DB Transaction
 * @return {MenuItem[]} Frontend Menu
 * */
async function transformManyMenuItemsToFrontEndMenu(
  menuItems,
  locale,
  customItemIds,
  { transacting } = {}
) {
  let translationItemsByKey = await translations().contents.getManyWithLocale(
    menuItems.reduce((acc, menuItem) => {
      acc.push(leemons.plugin.prefixPN(`${menuItem.menuKey}.${menuItem.key}.label`));
      acc.push(leemons.plugin.prefixPN(`${menuItem.menuKey}.${menuItem.key}.description`));
      return acc;
    }, []),
    locale,
    { transacting }
  );

  let goodMenuItems;

  const {
    menuItems: _menuItems,
    notFoundLabelsKeys,
    notFoundDescriptionsKeys,
  } = setLabelAndDescriptionToItems(menuItems, translationItemsByKey);

  goodMenuItems = _menuItems;

  // If any of the items is not in the specified language, we will try to make it available in any language.
  if (notFoundLabelsKeys.length || notFoundDescriptionsKeys.length) {
    translationItemsByKey = await translations().contents.getManyWithKeys(
      notFoundLabelsKeys.concat(notFoundDescriptionsKeys),
      { transacting }
    );

    const { menuItems: __menuItems } = setLabelAndDescriptionToItems(
      goodMenuItems,
      Object.keys(translationItemsByKey).reduce((acc, key) => {
        acc[key] = Object.values(translationItemsByKey[key])[0];
        return acc;
      }, {})
    );
    goodMenuItems = __menuItems;
  }

  // We set up the menu levels and their order
  const sortMenuItems = _.sortBy(goodMenuItems, ['fixed', 'order']);

  const finalMenu = _.filter(sortMenuItems, (item) => !item.parentKey);

  _.forEach(sortMenuItems, (_parentItem) => {
    const parentItem = _parentItem;
    parentItem.children = _.filter(
      sortMenuItems,
      (item) => item.parentKey === parentItem.key && customItemIds.indexOf(item.key) < 0
    );
    parentItem.customChildren = _.filter(
      sortMenuItems,
      (item) => item.parentKey === parentItem.key && customItemIds.indexOf(item.key) >= 0
    );
  });

  return finalMenu;
}

module.exports = transformManyMenuItemsToFrontEndMenu;
