const { add, exist, remove, removeAll } = require('../src/services/menu-item');

function _add(
  { menuKey, key, parentKey, url, window, iconName, iconSvg, label, description },
  permissions,
  { transacting } = {}
) {
  return add.call(
    this,
    {
      menuKey,
      key,
      parentKey,
      url,
      window,
      iconName,
      iconSvg,
      label,
      description,
    },
    permissions,
    { transacting }
  );
}

module.exports = {
  add: _add,
  remove,
  removeAll,
  exist,
};
