const { range, keys, findIndex, isEmpty, isNil } = require('lodash');
const getColumns = require('./helpers/getColumns');
const DataImporter = require('./helpers/getXlsImporter')();

const factory = new DataImporter();

async function importAppearanceSettings(filePath) {
  const importer = await factory.from(filePath);
  const config = {
    data: {
      worksheet: 'appearance',
      type: 'list',
      columns: getColumns(20),
    },
  };
  const data = importer.getAllItems(config.data);
  const customFalsie = 'No';
  const customTruthy = 'Yes';

  // ·····················································
  // HEADER FIELDS
  const fields = keys(data[0])
    .map((key) => data[0][key])
    .filter((value) => !isNil(value) && !isEmpty(value));

  // ·····················································
  // ITEM FIELDS START COLUMN INDEX
  const fieldStartColumnOffset = 1; // first column is omitted
  const fieldStartColumn =
    findIndex(fields, (field) => field.indexOf('root') > -1) + fieldStartColumnOffset;

  // ·····················································
  // ITEMS START ROW INDEX
  const itemsStartRowOffset = 2; // fields names and header items
  const itemsStartRow = findIndex(data.slice(1), (item) => item[1] !== '') + itemsStartRowOffset;

  return data
    .slice(itemsStartRow)
    .map((row) => {
      const item = { root: row[1] };

      // Fields
      range(fieldStartColumn, fields.length).forEach((index) => {
        let value = row[fieldStartColumn + index];
        if (value === customTruthy) value = true;
        else if (value === customFalsie) value = false;
        item[fields[index]] = value;
      });

      return item;
    })
    .reduce((acc, item) => {
      const { root, ...rest } = item;
      acc[root] = rest;
      return acc;
    }, {});
}

module.exports = importAppearanceSettings;
