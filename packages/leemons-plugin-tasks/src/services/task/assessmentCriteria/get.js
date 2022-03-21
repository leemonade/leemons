const { taskAssessmentCriteria: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function getAssessmentCriteria(task, { transacting } = {}) {
  const { fullId } = await parseId(task, null, { transacting });

  const existingCriteria = await table.find(
    {
      task: fullId,
      $sort: 'position:ASC',
    },
    {
      transacting,
    }
  );

  return {
    count: existingCriteria.length,
    assessmentCriteria: existingCriteria.map(({ assessmentCriteria, position }) => ({
      assessmentCriteria,
      position,
    })),
  };
};
