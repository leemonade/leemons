const _ = require('lodash');
const { getUserFamilyIds } = require('./getUserFamilyIds');
const { detail } = require('./detail');

async function listDetailPage(userSession, user, { transacting } = {}) {
  const familyIds = await getUserFamilyIds(user, { transacting });
  return Promise.all(_.map(familyIds, (id) => detail(id, userSession, { transacting })));
}

module.exports = { listDetailPage };
