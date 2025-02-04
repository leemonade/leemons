const { assignTest } = require('./assignTest');
const { createAssignSavedConfig } = require('./createAssignSavedConfig');
const { deleteAssignSavedConfig } = require('./deleteAssignSavedConfig');
const { deleteTest } = require('./deleteTest');
const { duplicate } = require('./duplicate');
const { getAssignSavedConfigs } = require('./getAssignSavedConfigs');
const { getInstanceFeedback } = require('./getInstanceFeedback');
const { getTestsDetails } = require('./getTestsDetails');
const { getUserQuestionResponses } = require('./getUserQuestionResponses');
const { listTests } = require('./listTests');
const { saveTest } = require('./saveTest');
const { setInstanceFeedback } = require('./setInstanceFeedback');
const { setInstanceTimestamp } = require('./setInstanceTimestamp');
const { setOpenQuestionGrade } = require('./setOpenQuestionGrade');
const { setQuestionResponse } = require('./setQuestionResponse');
const { updateAssignSavedConfig } = require('./updateAssignSavedConfig');

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
  createAssignSavedConfig,
  getAssignSavedConfigs,
  updateAssignSavedConfig,
  deleteAssignSavedConfig,
  details: getTestsDetails,
  getTestsDetails,
  save: saveTest,
  saveTest,
  deleteTest,
  setInstanceTimestamp,
  setQuestionResponse,
  getUserQuestionResponses,
  setOpenQuestionGrade,
};
