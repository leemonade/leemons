const { range, keys, findIndex, toLower, isNaN, isEmpty } = require('lodash');
const getColumns = require('./getColumns');
const DataImporter = require('./getXlsImporter')();

const factory = new DataImporter();

async function simpleListImport(
  filePath,
  worksheet,
  columnLength = 20,
  autoDetectType = true,
  cleanEmpty = false
) {
  const importer = await factory.from(filePath);
  const config = {
    data: {
      worksheet,
      type: 'list',
      columns: getColumns(columnLength),
    },
  };

  const data = importer.getAllItems(config.data);

  // ·····················································
  // HEADER FIELDS

  const fields = keys(data[0])
    .map((key) => data[0][key])
    .filter((val) => val !== '');

  // ·····················································
  // ITEMS FIELDS START COLUMN INDEX

  const fieldStartColumnOffset = 1; // first column is omitted (bulk info)
  const fieldStartColumn =
    findIndex(fields, (field) => field.indexOf('root') > -1) + fieldStartColumnOffset;

  const fieldEndColumn = fields.length;

  // ·····················································
  // ITEMS START ROW INDEX

  const itemsStartRowOffset = 2; // fields names and header items
  const itemsStartRow = findIndex(data.slice(1), (item) => item[1] !== '') + itemsStartRowOffset;

  const items = data
    .slice(itemsStartRow)
    .map((row) => {
      const item = { root: row[1] };

      range(fieldStartColumn, fieldEndColumn).forEach((index) => {
        let value = row[fieldStartColumn + index];

        if (!cleanEmpty || (cleanEmpty && !isEmpty(value))) {
          if (autoDetectType) {
            // Boolean check
            if (toLower(value) === 'no') {
              value = false;
            } else if (toLower(value) === 'yes') {
              value = true;
            }
            // Number check
            else if (!isNaN(Number(value))) {
              value = parseFloat(value);
            }
          }

          item[fields[index]] = value;
        }
      });

      return item;
    })
    .reduce((acc, item) => {
      const { root, ...rest } = item;

      acc[root] = rest;

      return acc;
    }, {});

  return items;
}

module.exports = simpleListImport;
