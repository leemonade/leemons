const { taskObjectives: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function getObjectives(task, subject, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });

  const existingObjectives = await table.find(
    {
      task: id,
      subject,
      $sort: 'position:ASC',
    },
    {
      transacting,
    }
  );

  return {
    count: existingObjectives.length,
    objectives: existingObjectives.map(({ objective, position }) => ({ objective, position })),
  };
};
