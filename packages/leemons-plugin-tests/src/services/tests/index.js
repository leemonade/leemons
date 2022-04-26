const { listTests } = require('./listTests');
const { getTestsDetails } = require('./getTestsDetails');
const { saveTest } = require('./saveTest');

module.exports = {
  list: listTests,
  listTests,
  details: getTestsDetails,
  getTestsDetails,
  save: saveTest,
  saveTest,
};
