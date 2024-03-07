const { LeemonsError } = require('@leemons/error');
const { exist: existMenu } = require('../core/menu/exist');
const { exist: existMenuItem } = require('../core/menu-item/exist');

async function validateExistMenu({ key, ctx }) {
  if (await existMenu({ key, ctx }))
    throw new LeemonsError(ctx, { message: `Menu with key '${key}' already exists` });
}

async function validateNotExistMenu({ key, ctx }) {
  if (!(await existMenu({ key, ctx })))
    throw new LeemonsError(ctx, { message: `Menu with key '${key}' not exists` });
}

async function validateExistMenuItem({ menuKey, key, ctx }) {
  if (await existMenuItem({ menuKey, key, ctx }))
    throw new LeemonsError(ctx, {
      message: `Menu item with key '${key}' for menu '${menuKey}' already exists`,
    });
}

async function validateNotExistMenuItem({ menuKey, key, ctx }) {
  if (!(await existMenuItem({ menuKey, key, ctx })))
    throw new LeemonsError(ctx, {
      message: `Menu item with key '${key}' for menu '${menuKey}' not exists`,
    });
}

function validateKeyPrefix({ key, calledFrom, ctx }) {
  if (!key.startsWith(calledFrom))
    throw new LeemonsError(ctx, { message: `The key name must begin with ${calledFrom}` });
}

module.exports = {
  validateExistMenu,
  validateNotExistMenu,
  validateExistMenuItem,
  validateNotExistMenuItem,
  validateKeyPrefix,
};
