const { booleanToYesNoAnswer } = require('./booleanToYesNoAnswer');
const { configureSheetColumns } = require('./configureSheetColumns');
const {
  getDuplicatedAssetsReferenceAsString,
  handleNonIndexableAssetsNeeded,
} = require('./getDuplicatedAssetsReferenceAsString');
const { mergeGroupTitleCells } = require('./mergeGroupTitleCells');
const { solveCoverImage } = require('./solveCoverImage');
const { styleCell } = require('./styleCell');

module.exports = {
  styleCell,
  booleanToYesNoAnswer,
  mergeGroupTitleCells,
  configureSheetColumns,
  getDuplicatedAssetsReferenceAsString,
  handleNonIndexableAssetsNeeded,
  solveCoverImage,
};
