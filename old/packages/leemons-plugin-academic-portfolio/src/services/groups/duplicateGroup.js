const { table } = require('../tables');
const { validateDuplicateGroup } = require('../../validations/forms');
const { getProgramTreeTypes } = require('../programs/getProgramTreeTypes');
const {
  duplicateGroupWithClassesUnderNodeTreeByIds,
} = require('./duplicateGroupWithClassesUnderNodeTreeByIds');

async function duplicateGroup(data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateDuplicateGroup(data, { transacting });
      const { id, ...props } = data;
      const group = await table.groups.findOne({ id }, { transacting });
      const nodeTypes = await getProgramTreeTypes(group.program, { transacting });
      return duplicateGroupWithClassesUnderNodeTreeByIds(nodeTypes, id, {
        teachers: true,
        groups: true,
        courses: true,
        substages: true,
        knowledges: true,
        ...props,
        userSession,
        transacting,
      });
    },
    table.groups,
    _transacting
  );
}

module.exports = { duplicateGroup };
