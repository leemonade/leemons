//! Antes era getAssignationsOfAssignationInstance
//! Está solo para que no peten los test hay que migrarla
const { LeemonsError } = require('@leemons/error');

const { getUserPermissions } = require('../../permissions/instances/users');
const { getAssignations } = require('../getAssignations');

async function getAssignationsOfInstance({ instances, details = false, ctx }) {
  const ids = Array.isArray(instances) ? instances : [instances];

  const permissions = await getUserPermissions({ instancesIds: ids, ctx });

  if (!Object.values(permissions).every((permission) => permission.actions.includes('edit'))) {
    throw new LeemonsError(ctx, { message: 'You do not have permissions' });
  }

  const query = { instance: ids };

  const studentsAssignations = await ctx.tx.db.Assignations.find(query)
    .select(details ? ['id'] : undefined)
    .lean();

  if (details) {
    const studentsAssignationPerInstance = {};
    const assignationsDetails = await getAssignations({
      assignationsIds: studentsAssignations,
      throwOnMissing: false,
      ctx,
    });

    assignationsDetails.forEach((assignation) => {
      if (!studentsAssignationPerInstance[assignation.instance]) {
        studentsAssignationPerInstance[assignation.instance] = [assignation];
      } else {
        studentsAssignationPerInstance[assignation.instance].push(assignation);
      }
    });

    return studentsAssignationPerInstance;
  }

  const studentsAssignationPerInstance = {};

  studentsAssignations.forEach((assignation) => {
    const assignationObj = {
      ...assignation,
      classes: JSON.parse(assignation.classes || null),
      metadata: JSON.parse(assignation.metadata || null),
    };

    if (!studentsAssignationPerInstance[assignation.instance]) {
      studentsAssignationPerInstance[assignation.instance] = [assignationObj];
    } else {
      studentsAssignationPerInstance[assignation.instance].push(assignationObj);
    }
  });

  if (!Array.isArray(instances)) {
    return studentsAssignationPerInstance[instances];
  }

  return studentsAssignationPerInstance;
}

module.exports = { getAssignationsOfInstance };
