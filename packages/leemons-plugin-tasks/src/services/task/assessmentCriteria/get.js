const { taskAssessmentCriteria: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function getAssessmentCriteria(task, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });

  const existingCriteria = await table.find(
    {
      task: id,
      $sort: 'position:ASC',
    },
    {
      transacting,
    }
  );

  return {
    count: existingCriteria.length,
    assessmentCriteria: existingCriteria.map(({ content: assessmentCriteria, position }) => ({
      content: assessmentCriteria,
      position,
    })),
  };
};
