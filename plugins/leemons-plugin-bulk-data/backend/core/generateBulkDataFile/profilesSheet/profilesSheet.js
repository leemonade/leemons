const { configureSheetColumns, styleCell } = require('../helpers');
const {
  PROFILES_COLUMN_DEFINITIONS,
  computeHeaderValues,
  SIMPLE_COLUMN_DEFINITIONS,
  PLUGIN_COLUMN_DEFINITIONS,
} = require('./columnDefinitions');

const addExtraGroup = (worksheet) => {
  const offset = Object.keys(SIMPLE_COLUMN_DEFINITIONS).length;
  const groupLength = Object.keys(PLUGIN_COLUMN_DEFINITIONS).length;

  const startColumn = 1 + offset;
  const endColumn = startColumn + groupLength - 1;
  worksheet.mergeCells(2, startColumn, 2, endColumn);

  const mergedCell = worksheet.getCell(2, startColumn);
  mergedCell.value = 'Plugin Permissions';
  styleCell({
    cell: mergedCell,
    fontColor: 'white',
    bgColor: 'black',
    alignment: { horizontal: 'center', vertical: 'middle' },
  });
};

async function createProfilesSheet({ workbook, centers, ctx }) {
  const worksheet = workbook.addWorksheet('profiles');
  configureSheetColumns({
    worksheet,
    columnDefinitions: PROFILES_COLUMN_DEFINITIONS,
    offset: 1,
    withGroupedTitles: true,
    addTitleKeysRow: true,
    addGroupTitleKeysRow: true,
    setDynamicColumnHeaders: computeHeaderValues,
  });
  addExtraGroup(worksheet);
}

module.exports = {
  createProfilesSheet,
};
