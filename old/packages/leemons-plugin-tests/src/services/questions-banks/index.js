const { listQuestionsBanks } = require('./listQuestionsBanks');
const { saveQuestionsBanks } = require('./saveQuestionsBanks');
const { getQuestionsBanksDetails } = require('./getQuestionsBanksDetails');
const { findByAssetIds } = require('./findByAssetIds');
const { deleteQuestionBank } = require('./deleteQuestionBank');

module.exports = {
  delete: deleteQuestionBank,
  deleteQuestionBank,
  list: listQuestionsBanks,
  listQuestionsBanks,
  save: saveQuestionsBanks,
  saveQuestionsBanks,
  details: getQuestionsBanksDetails,
  getQuestionsBanksDetails,
  findByAssetIds,
};
