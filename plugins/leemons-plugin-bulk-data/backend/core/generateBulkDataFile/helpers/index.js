const { booleanToYesNoAnswer } = require('./booleanToYesNoAnswer');
const { styleCell } = require('./styleCell');
const { mergeGroupTitleCells } = require('./mergeGroupTitleCells');
const { configureSheetColumns } = require('./configureSheetColumns');
const {
  getDuplicatedAssetsReferenceAsString,
  handleNonIndexableAssetsNeeded,
} = require('./getDuplicatedAssetsReferenceAsString');
const { solveCoverImage } = require('./solveCoverImage');

module.exports = {
  styleCell,
  booleanToYesNoAnswer,
  mergeGroupTitleCells,
  configureSheetColumns,
  getDuplicatedAssetsReferenceAsString,
  handleNonIndexableAssetsNeeded,
  solveCoverImage,
};
