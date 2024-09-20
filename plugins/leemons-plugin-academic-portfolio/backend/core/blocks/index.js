const { addBlock } = require('./addBlock');
const { getBlockById } = require('./getBlockById');
const { getRawBlocksBySubject } = require('./getRawBlocksBySubject');
const { listSubjectBlocks } = require('./listSubjectBlocks');
const { removeBlock } = require('./removeBlock');
const { updateBlock } = require('./updateBlock');

module.exports = {
  addBlock,
  updateBlock,
  getBlockById,
  getRawBlocksBySubject,
  listSubjectBlocks,
  removeBlock,
};
