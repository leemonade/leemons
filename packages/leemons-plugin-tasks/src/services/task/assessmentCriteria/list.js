const { taskAssessmentCriteria: table } = require('../../table');

module.exports = async function listAssessmentCriteria({ transacting } = {}) {
  try {
    const list = await table.find(
      { assessmentCriteria_$null: false },
      {
        columns: ['id', 'assessmentCriteria'],
        transacting,
      }
    );

    return list.map(({ assessmentCriteria }) => assessmentCriteria);
  } catch (e) {
    throw new Error(`Failed to list assessmentCriteria: ${e.message}`);
  }
};
