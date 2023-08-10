const { validateUpdateCourse } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateCourse({ data, ctx }) {
  await validateUpdateCourse({ data, ctx });
  const { id, managers, ..._data } = data;
  const [group] = await Promise.all([
    ctx.tx.db.Groups.findOneAndUpdate({ id }, _data, { new: true }),
    saveManagers({ userAgents: managers, type: 'course', relationship: id, ctx }),
  ]);
  return group;
}

module.exports = { updateCourse };
