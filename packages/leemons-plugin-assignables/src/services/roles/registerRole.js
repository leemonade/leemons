const addCategory = require('../leebrary/categories/addCategory');
const { roles } = require('../tables');
const getRole = require('./getRole');

const a = {
  creatable: true,
  createUrl: '/private/my-plugin/create',
  // canUse: []
  // Menu properties
  menu: {
    item: {
      iconSvg: '/public/my-plugin/category-icon.svg',
      activeIconSvg: '/public/my-plugin/category-icon_active.svg',
      label: {
        en: 'My awesome category',
        es: 'Mi increíble categoría',
      },
    },
    permissions: [
      {
        permissionName: 'plugin.my-plugin.my-permission',
        actionNames: ['view', 'update', 'create', 'delete', 'admin'],
      },
    ],
  },

  // Frontend config
  // Paths must be realtive to plugin's frontend "src/widgets/leebrary"
  listCardComponent: 'path/to/my/card-component',
  detailComponent: 'path/to/my/detail-component',
  componentOwner: 'plugins.owner',
};

module.exports = async function registerRole(role, { transacting: t, ...data } = {}) {
  const { frontend, ...categoryData } = data;

  return global.utils.withTransaction(
    async (transacting) => {
      if (!this.calledFrom) {
        throw new Error("Can't register role without plugin name");
      }

      // EN: Check if role already exists
      // ES: Comprueba si el rol ya existe
      try {
        const existingRole = await getRole.call(this, role, { transacting });

        if (existingRole) {
          throw new Error('Role already exists');
        }
      } catch (e) {
        if (e.message !== 'Role not found') {
          throw e;
        }
      }

      // EN: Register role
      // ES: Registrar rol
      await roles.create({ name: role, plugin: this.calledFrom }, { transacting });

      // EN: Register the leebrary category
      // ES: Registrar la categoría de leebrary
      await addCategory(
        {
          ...categoryData,
          role: `assignables.${role}`,
          label: { en: role, es: role },
        },
        { transacting }
      );

      return true;
    },
    roles,
    t
  );
};
