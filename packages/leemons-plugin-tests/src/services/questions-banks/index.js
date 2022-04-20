const { listQuestionsBanks } = require('./listQuestionsBanks');
const { saveQuestionsBanks } = require('./saveQuestionsBanks');
const { getQuestionsBanksDetails } = require('./getQuestionsBanksDetails');

module.exports = {
  list: listQuestionsBanks,
  listQuestionsBanks,
  save: saveQuestionsBanks,
  saveQuestionsBanks,
  details: getQuestionsBanksDetails,
  getQuestionsBanksDetails,
};
