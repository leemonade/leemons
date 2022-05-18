const { listTests } = require('./listTests');
const { getTestsDetails } = require('./getTestsDetails');
const { saveTest } = require('./saveTest');
const { setInstanceTimestamp } = require('./setInstanceTimestamp');
const { setQuestionResponse } = require('./setQuestionResponse');
const { getUserQuestionResponses } = require('./getUserQuestionResponses');

module.exports = {
  list: listTests,
  listTests,
  details: getTestsDetails,
  getTestsDetails,
  save: saveTest,
  saveTest,
  setInstanceTimestamp,
  setQuestionResponse,
  getUserQuestionResponses,
};
