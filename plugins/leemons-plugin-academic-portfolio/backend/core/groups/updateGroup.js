const { validateUpdateGroup } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateGroup({ data, ctx }) {
  await validateUpdateGroup({ data, ctx });
  const { id, managers, ..._data } = data;
  const [group] = await Promise.all([
    ctx.tx.db.Groups.findOneAndUpdate({ id }, _data, { new: true, lean: true }),
    saveManagers({ userAgents: managers, type: 'group', relationship: id, ctx }),
  ]);
  return group;
}

module.exports = { updateGroup };
