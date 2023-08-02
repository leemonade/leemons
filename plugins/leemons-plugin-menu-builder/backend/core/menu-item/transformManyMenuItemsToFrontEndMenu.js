const _ = require('lodash');
function setLabelAndDescriptionToItems({ menuItems, translationItemsByKey, ctx }) {
  const notFoundLabelsKeys = [];
  const notFoundDescriptionsKeys = [];

  _.forEach(menuItems, (_menuItem) => {
    const menuItem = _menuItem;
    const labelKey = ctx.prefixPN(`${menuItem.menuKey}.${menuItem.key}.label`);
    const descriptionKey = ctx.prefixPN(`${menuItem.menuKey}.${menuItem.key}.description`);
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
async function transformManyMenuItemsToFrontEndMenu({ menuItems, locale, customItemIds, ctx }) {
  let translationItemsByKey = await ctx.tx.call('multilanguage.contents.getManyWithLocale', {
    keys: menuItems.reduce((acc, menuItem) => {
      acc.push(ctx.prefixPN(`${menuItem.menuKey}.${menuItem.key}.label`));
      acc.push(ctx.prefixPN(`${menuItem.menuKey}.${menuItem.key}.description`));
      return acc;
    }, []),
    locale,
  });

  let goodMenuItems;

  const {
    menuItems: _menuItems,
    notFoundLabelsKeys,
    notFoundDescriptionsKeys,
  } = setLabelAndDescriptionToItems({ menuItems, translationItemsByKey, ctx });

  goodMenuItems = _menuItems;

  // If any of the items is not in the specified language, we will try to make it available in any language.
  if (notFoundLabelsKeys.length || notFoundDescriptionsKeys.length) {
    translationItemsByKey = ctx.tx.call('multilanguage.contents.getManyWithKeys', {
      keys: notFoundLabelsKeys.concat(notFoundDescriptionsKeys),
    });

    const { menuItems: __menuItems } = setLabelAndDescriptionToItems({
      menuItems: goodMenuItems,
      translationItemsByKey: Object.keys(translationItemsByKey).reduce((acc, key) => {
        [acc[key]] = Object.values(translationItemsByKey[key]);
        return acc;
      }, {}),
      ctx,
    });
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

module.exports = { transformManyMenuItemsToFrontEndMenu };
