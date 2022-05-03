const addCategory = require('../leebrary/categories/addCategory');
const { roles } = require('../tables');
const getRole = require('./getRole');

module.exports = async function registerRole(role, { transacting: t } = {}) {
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
          role: `assignables.${role}`,
          label: { en: role, es: role },
          creatable: false,
          provider: null,
        },
        { transacting }
      );

      return true;
    },
    roles,
    t
  );
};
