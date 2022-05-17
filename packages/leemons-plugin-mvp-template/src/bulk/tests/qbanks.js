const { range, keys, findIndex, trim, isEmpty } = require('lodash');
const path = require('path');
const getColumns = require('../helpers/getColumns');

const XlsxImporter = require('../helpers/getXlsImporter')();

const factory = new XlsxImporter();
const filePath = path.resolve(__dirname, '../data.xlsx');

async function importQbanks(programs) {
  const importer = await factory.from(filePath);
  const config = {
    qbanks: {
      worksheet: 'te_qbanks',
      type: 'list',
      columns: getColumns(100),
    },
  };

  const qbanks = importer.getAllItems(config.qbanks);

  // ·····················································
  // HEADER FIELDS

  const fields = keys(qbanks[0])
    .map((key) => qbanks[0][key])
    .filter((val) => val !== '');

  // ·····················································
  // QBANKS FIELDS START COLUMN INDEX

  const fieldStartColumnOffset = 1; // first column is omitted
  const fieldStartColumn =
    findIndex(fields, (field) => field.indexOf('root') > -1) + fieldStartColumnOffset;
  const fieldStopColumn = findIndex(fields, (field) => field.indexOf('program') > -1);

  // ·····················································
  // QBANK RELATIONS COLUMN INDEX

  const programColumn = fieldStopColumn + 1;
  const subjectsColumn = programColumn + 1;

  // ·····················································
  // PROFILE ITEMS START ROW INDEX

  const itemsStartRowOffset = 2; // fields names and header items
  const itemsStartRow =
    findIndex(qbanks.slice(1), (qbank) => qbank[1] !== '') + itemsStartRowOffset;

  const items = qbanks
    .slice(itemsStartRow)
    .map((qbank) => {
      const item = { root: qbank[1] };

      // Add qbank fields
      range(fieldStartColumn, fieldStopColumn).forEach((index) => {
        item[fields[index]] = qbank[fieldStartColumn + index];
      });

      // Qbank program
      const program = programs[qbank[programColumn]];
      console.log('-- QBANK PROGRAM --');
      console.dir(program, { depth: null });
      item.program = program.id;
      item.subjects = qbank[subjectsColumn]
        ?.split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val));
      // .map((subject) => program.subjects));

      // Tags
      item.tags = item.tags
        ?.split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val));

      return item;
    })
    .reduce((acc, item) => {
      const { root, ...rest } = item;
      acc[root] = rest;
      return acc;
    }, {});

  // console.dir(items, { depth: null });
  return items;
}

// ·····················································
// TESTING

// importQbanks();

module.exports = importQbanks;
