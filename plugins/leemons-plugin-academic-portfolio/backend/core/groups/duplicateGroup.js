const { validateDuplicateGroup } = require('../../validations/forms');
const { getProgramTreeTypes } = require('../programs/getProgramTreeTypes');
const {
  duplicateGroupWithClassesUnderNodeTreeByIds,
} = require('./duplicateGroupWithClassesUnderNodeTreeByIds');

async function duplicateGroup({ data, ctx }) {
  await validateDuplicateGroup({ data, ctx });
  const { id, ...props } = data;
  const group = await ctx.tx.db.Groups.findOne({ id }).lean();
  const nodeTypes = await getProgramTreeTypes({ programId: group.program, ctx });
  // TODO @askJaime: Estamos pasando datos que no se usan en la función -> groups, courses, substages, knowledges
  return duplicateGroupWithClassesUnderNodeTreeByIds({
    nodeTypes,
    id,
    teachers: true,
    groups: true,
    courses: true,
    substages: true,
    knowledges: true,
    ...props,
    ctx,
  });
}

module.exports = { duplicateGroup };
