const { keys, trim, isEmpty, isNil } = require('lodash');
const showdown = require('showdown');
const itemsImport = require('../helpers/simpleListImport');

const converter = new showdown.Converter();

async function importTests(filePath, { programs, qbanks, questions }) {
  const items = await itemsImport(filePath, 'te_tests', 50, true, true);

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const test = items[key];

      // Qbank program
      const program = programs[test.program];
      if (program) {
        test.program = program.id;
        test.subjects = (test.subjects || '')
          ?.split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((subject) => program.subjects[subject]?.id);
      }

      test.questions = (test.questions || '')
        ?.split('|')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((question) => questions[question]?.id);

      // Tags
      test.tags = (test.tags || '')
        ?.split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val));

      test.tags = test.tags || [];

      if (test.questionBank) test.questionBank = qbanks[test.questionBank]?.id;
      if (test.statement) test.statement = converter.makeHtml(test.statement || '');

      if (test.instructionsForTeachers && !isEmpty(test.instructionsForTeachers)) {
        test.instructionsForTeachers = converter.makeHtml(test.instructionsForTeachers);
      }

      if (test.instructionsForStudents && !isEmpty(test.instructionsForStudents)) {
        test.instructionsForStudents = converter.makeHtml(test.instructionsForStudents);
      }

      if (!isNil(test.useAllQuestions)) test.filters = { useAllQuestions: test.useAllQuestions };

      delete test.useAllQuestions;

      items[key] = test;
    });

  /*
  const mock = {
    name: 'Repasamos demografía',
    description: null,
    tagline: null,
    color: '#267337',
    tags: [],
    program: '1d4a67a1-76ac-4753-941b-373ffd7f1daf',
    subjects: ['bd72f431-a344-4d8c-9bc0-22c37a1efa65'],
    statement:
      '<p style="margin-left: 0px!important;">A ver cuántas preguntas eres capaz de responder correctamente.</p>',
    instructionsForTeachers: '<p style="margin-left: 0px!important;"></p>',
    instructionsForStudents: '<p style="margin-left: 0px!important;"></p>',
    gradable: true,
    questionBank: '6c3748c0-98aa-42cc-a14e-51d284aca74d@4.0.0',
    filters: { useAllQuestions: true },
    questions: [
      '1466d2d7-4324-4e9e-88db-2a5b77c54de6',
      '21d3343e-87f9-4da6-b7f1-5216887f1ee3',
      '2e5122fa-de6a-41ee-86a9-b7551e977303',
    ],
    type: 'learn',
    published: false,
  };
  */

  // console.dir(items, { depth: null });
  return items;
}

// ·····················································
// TESTING

// importQbanks();

module.exports = importTests;
