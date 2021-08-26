const _ = require('lodash');
const { table } = require('../tables');

/**
 * Remove the family
 * @public
 * @static
 * @param {string} familyId - Family id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function remove(familyId, { transacting } = {}) {
  const datasetService = leemons.getPlugin('dataset').services.dataset;

  const promises = [
    table.families.delete({ id: familyId }, { transacting }),
    table.familyMembers.deleteMany({ family: familyId }),
  ];

  if (
    await datasetService.existValues('families-data', 'plugins.families', {
      target: familyId,
      transacting,
    })
  ) {
    promises.push(
      datasetService.deleteValues('families-data', 'plugins.families', {
        target: familyId,
        transacting,
      })
    );
  }

  await Promise.all(promises);
}

module.exports = { remove };
