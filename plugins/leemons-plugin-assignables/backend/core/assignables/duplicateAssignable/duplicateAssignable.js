const { pick } = require('lodash');
const { getAssignable } = require('../getAssignable');
const { validAssignableProperties } = require('../../../validations/validateAssignable');
const { createAssignable } = require('../createAssignable');

async function duplicateAssignable({ id, published, ctx }) {
  const assignable = await getAssignable({
    id,
    ctx,
  });

  assignable.asset.name += ' (1)';

  const assignableToCreate = pick(assignable, validAssignableProperties);

  const newAssignable = await createAssignable({
    assignable: assignableToCreate,
    published: published === undefined ? false : published,
    ctx,
  });

  return newAssignable;
}

module.exports = { duplicateAssignable };
