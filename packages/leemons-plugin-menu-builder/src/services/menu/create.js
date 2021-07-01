const { addMenuPermissionMany } = require('../../helpers/addPermissionMany');
const { table } = require('../../tables');

const { withTransaction, slugify } = global.utils;

/**
 * Create a Menu
 * @private
 * @static
 * @param {string} name - A name to identify the Menu (just to admin it)
 * @property {MenuPermissionsAdd} permissions Permissions for Menu
 * @return {Promise<Menu>} Created / Updated menu
 * */
async function add(name, permissions, { transacting: _transacting } = {}) {
  return withTransaction(
    async (transacting) => {
      const slug = slugify(name, { lower: true });
      const existMenu = await table.menu.count({ slug }, { transacting });
      if (existMenu) throw new Error(`Menu with name '${name}' already exists`);

      leemons.log.info(`Creating Menu :: '${slug}'`);
      const menu = await table.menu.create({ name, slug }, { transacting });
      await addMenuPermissionMany(menu.id, permissions, { transacting });
      return menu;
    },
    table.menu,
    _transacting
  );
}

module.exports = { add };
