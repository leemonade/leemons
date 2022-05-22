const { listTests } = require('./listTests');
const { getTestsDetails } = require('./getTestsDetails');
const { saveTest } = require('./saveTest');
const { setInstanceTimestamp } = require('./setInstanceTimestamp');
const { setQuestionResponse } = require('./setQuestionResponse');
const { getUserQuestionResponses } = require('./getUserQuestionResponses');
const { deleteTest } = require('./deleteTest');

module.exports = {
  list: listTests,
  listTests,
  details: getTestsDetails,
  getTestsDetails,
  save: saveTest,
  saveTest,
  deleteTest,
  setInstanceTimestamp,
  setQuestionResponse,
  getUserQuestionResponses,
};
