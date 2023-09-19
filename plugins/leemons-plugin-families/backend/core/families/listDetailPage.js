const _ = require('lodash');
const { getUserFamilyIds } = require('./getUserFamilyIds');
const { detail } = require('./detail');

async function listDetailPage({ user, ctx }) {
  const familyIds = await getUserFamilyIds({ user, ctx });
  return Promise.all(_.map(familyIds, (id) => detail({ familyId: id, ctx })));
}

module.exports = { listDetailPage };
