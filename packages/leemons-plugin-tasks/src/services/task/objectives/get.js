const { taskObjectives: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function getObjectives(task, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });

  const existingObjectives = await table.find(
    {
      task: id,
    },
    {
      transacting,
    }
  );

  return {
    count: existingObjectives.length,
    objectives: existingObjectives.map(({ objective }) => objective),
  };
};
