const _ = require('lodash');
const { mainMenuKey } = require('@leemons/menu-builder');
const { getMembers } = require('./getMembers');
const { removeMember } = require('../family-members/removeMember');
const { removeDatasetValues } = require('./removeDatasetValues');

/**
 * Remove the family
 * @public
 * @static
 * @param {string} family - Family id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function remove({ family, ctx }) {
  const { guardians, students } = await getMembers({ familyId: family, ctx });

  const promises = [];

  try {
    await ctx.call('menu-builder.menuItem.remove', {
      menuKey: mainMenuKey,
      key: ctx.prefixPN(`family-${family}`),
    });
  } catch (e) {
    // Nothing
  }

  try {
    await removeDatasetValues({ family, ctx, tx: false });
  } catch (e) {
    // Nothing
  }

  _.forEach(guardians, (guardian) => {
    promises.push(removeMember({ family, user: guardian.id, ctx }));
  });
  _.forEach(students, (student) => {
    promises.push(removeMember({ family, user: student.id, ctx }));
  });
  const isFamilyEmergencyNumbersInstalled = await ctx.tx.call(
    'deployment-manager.pluginIsInstalled',
    { pluginName: 'families-emergency-numbers' }
  );
  if (isFamilyEmergencyNumbersInstalled) {
    promises.push(
      ctx.tx.call('families-emergency-numbers.emergencyPhones.removeFamilyPhones', { family })
    );
  }

  await Promise.all(promises);

  await ctx.tx.db.Families.deleteOne({ id: family });

  return true;
}

module.exports = { remove };
