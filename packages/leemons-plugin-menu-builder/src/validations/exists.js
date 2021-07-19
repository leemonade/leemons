const existMenu = require('../services/menu/exist');
const existMenuItem = require('../services/menu-item/exist');

async function validateExistMenu(key, { transacting }) {
  if (await existMenu(key, { transacting }))
    throw new Error(`Menu with key '${key}' already exists`);
}

async function validateNotExistMenu(key, { transacting }) {
  if (!(await existMenu(key, { transacting })))
    throw new Error(`Menu with key '${key}' not exists`);
}

async function validateExistMenuItem(menuKey, key, { transacting }) {
  if (await existMenuItem(menuKey, key, { transacting }))
    throw new Error(`Menu item with key '${key}' for menu '${menuKey}' already exists`);
}

async function validateNotExistMenuItem(menuKey, key, { transacting }) {
  if (!(await existMenuItem(menuKey, key, { transacting })))
    throw new Error(`Menu item with key '${key}' for menu '${menuKey}' not exists`);
}

function validateKeyPrefix(key, calledFrom) {
  if (!key.startsWith(calledFrom)) throw new Error(`The key name must begin with ${calledFrom}`);
}

module.exports = {
  validateExistMenu,
  validateNotExistMenu,
  validateExistMenuItem,
  validateNotExistMenuItem,
  validateKeyPrefix,
};
