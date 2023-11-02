const { keys, trim, isNil, isEmpty } = require('lodash');
const itemsImport = require('../helpers/simpleListImport');

async function importQbanks(filePath, programs) {
  const items = await itemsImport(filePath, 'te_qbanks', 40, true, true);

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const qbank = items[key];

      // Qbank program
      const program = programs[qbank.program];

      qbank.program = program.id;
      qbank.subjects = (qbank.subjects || '')
        ?.split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((subject) => program.subjects[subject]?.id);

      // Tags
      qbank.tags = (qbank.tags || '')
        ?.split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val));

      qbank.tags = qbank.tags || [];

      items[key] = qbank;
    });

  /*
  const mock = {
    name: 'Qbank 3',
    tagline: 'Qbank 3 - Subtítulo',
    program: '1d4a67a1-76ac-4753-941b-373ffd7f1daf',
    subjects: ['bd72f431-a344-4d8c-9bc0-22c37a1efa65'],
    categories: [{ value: 'Datos' }, { value: 'Vocabulario' }],
    questions: [
      {
        type: 'mono-response',
        category: 0,
        level: 'elementary',
        tags: ['continentes', 'demografía'],
        question: '<p style="margin-left: 0px!important;">Qbank 3 - Enunciado</p>',
        properties: {
          explanation: '<p style="margin-left: 0px!important;"></p>',
          responses: [
            { value: { response: 'Qbank 3 - Respuesta 1', isCorrectResponse: false } },
            {
              value: {
                response: 'Qbank 3 - Respuesta 2',
                explanation: null,
                isCorrectResponse: true,
              },
            },
          ],
        },
      },
    ],
  };
  */

  // console.dir(items, { depth: null });
  return items;
}

// ·····················································
// TESTING

// importQbanks();

module.exports = importQbanks;
