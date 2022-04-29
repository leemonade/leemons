const { listQuestionsBanks } = require('./listQuestionsBanks');
const { saveQuestionsBanks } = require('./saveQuestionsBanks');
const { getQuestionsBanksDetails } = require('./getQuestionsBanksDetails');
const { findByAssetIds } = require('./findByAssetIds');

module.exports = {
  list: listQuestionsBanks,
  listQuestionsBanks,
  save: saveQuestionsBanks,
  saveQuestionsBanks,
  details: getQuestionsBanksDetails,
  getQuestionsBanksDetails,
  findByAssetIds,
};
