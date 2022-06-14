const { pick } = require('lodash');
const { validAssignableProperties } = require('../../helpers/validators/assignable');
const createAssignable = require('./createAssignable');
const getAssignable = require('./getAssignable');

module.exports = async function duplicateAssignable(
  assignableId,
  { published = false, userSession, transacting } = {}
) {
  const assignable = await getAssignable.call(this, assignableId, { userSession, transacting });

  assignable.asset.name += ' (1)';

  const assignableToCreate = pick(assignable, validAssignableProperties);

  const newAssignable = await createAssignable.call(this, assignableToCreate, {
    published,
    userSession,
    transacting,
  });

  return newAssignable;
};
