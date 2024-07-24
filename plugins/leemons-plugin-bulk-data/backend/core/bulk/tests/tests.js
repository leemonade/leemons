const { keys, trim, isEmpty, isNil, toLower } = require('lodash');
const showdown = require('showdown');
const itemsImport = require('../helpers/simpleListImport');

const converter = new showdown.Converter();

function booleanCheck(value) {
  if (toLower(value) === 'no') {
    return false;
  }
  if (toLower(value) === 'yes') {
    return true;
  }
  return value;
}

async function importTests(filePath, { programs, qbanks, questions, assets }) {
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

      // Config
      test.config = test.config
        .split(',')
        .map((field) => field.trim())
        .reduce((acc, item) => {
          const [fieldKey, value] = item.split('|');
          acc[fieldKey] = booleanCheck(value ?? false);
          return acc;
        }, {});

      // Resources
      test.resources = (test.resources || '')
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((val) => assets?.[val]?.id)
        .filter(Boolean);

      // Instructions
      if (test.instructionsForTeachers) {
        test.instructionsForTeachers = converter.makeHtml(test.instructionsForTeachers);
      }
      if (test.instructionsForStudents) {
        test.instructionsForStudents = converter.makeHtml(test.instructionsForStudents);
      }

      items[key] = test;
    });

  return items;
}

module.exports = importTests;
