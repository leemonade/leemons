const { listTests } = require('./listTests');
const { getTestsDetails } = require('./getTestsDetails');
const { saveTest } = require('./saveTest');
const { setInstanceTimestamp } = require('./setInstanceTimestamp');
const { setQuestionResponse } = require('./setQuestionResponse');
const { getUserQuestionResponses } = require('./getUserQuestionResponses');
const { deleteTest } = require('./deleteTest');
const { assignTest } = require('./assignTest');
const { getInstanceFeedback } = require('./getInstanceFeedback');
const { setInstanceFeedback } = require('./setInstanceFeedback');
const { getAssignSavedConfigs } = require('./getAssignSavedConfigs');
const { duplicate } = require('./duplicate');

module.exports = {
  assignTest,
  duplicate,
  setInstanceFeedback,
  getInstanceFeedback,
  setFeedback: setInstanceFeedback,
  getFeedback: getInstanceFeedback,
  assign: assignTest,
  list: listTests,
  listTests,
  getAssignSavedConfigs,
  details: getTestsDetails,
  getTestsDetails,
  save: saveTest,
  saveTest,
  deleteTest,
  setInstanceTimestamp,
  setQuestionResponse,
  getUserQuestionResponses,
};
