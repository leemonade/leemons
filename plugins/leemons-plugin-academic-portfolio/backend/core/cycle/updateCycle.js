const { validateUpdateCycle } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateCycle({ data, ctx }) {
  await validateUpdateCycle(data);

  const { id, managers, ..._data } = data;

  const [cycle] = await Promise.all([
    ctx.tx.db.Cycles.findOneAndUpdate({ id }, _data, { new: true }),
    saveManagers({ userAgents: managers, type: 'cycle', relationship: id, ctx }),
  ]);
  return cycle;
}

module.exports = { updateCycle };
