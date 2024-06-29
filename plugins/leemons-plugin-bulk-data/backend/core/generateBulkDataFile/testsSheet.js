const { omitBy, flatMap, isNil } = require('lodash');
const TurndownService = require('turndown');
const {
  styleCell,
  booleanToYesNoAnswer,
  getDuplicatedAssetsReferenceAsString,
} = require('./helpers');

const turndown = new TurndownService();

// HELPERS ························································································|

function getQuestionsString(testQuestions, questions) {
  const questionsMatching = questions.filter((q) => testQuestions.includes(q.id));
  return questionsMatching.map((item) => item.bulkId).join('|');
}

const getCreator = (taskAsset, users) => users.find((u) => u.id === taskAsset.fromUser)?.bulkId;

const getMetadataConfig = (test) => {
  const { hasInstructions, hasResources } = test.providerData.metadata.config ?? {};
  const result = [];
  result.push(`hasInstructions|${booleanToYesNoAnswer(!!hasInstructions)}`);
  result.push(`hasResources|${booleanToYesNoAnswer(!!hasResources)}`);
  return result.join(', ');
};

// MAIN FUNCTION ························································································|

async function createTestsSheet({
  workbook,
  questions,
  testDetails,
  qBanks,
  programs,
  subjects,
  users,
  adminShouldOwnAllAssets,
  libraryAssets,
  ctx,
}) {
  const worksheet = workbook.addWorksheet('te_tests');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'questionBank', key: 'questionBank', width: 20 },
    { header: 'name', key: 'name', width: 20 },
    { header: 'tagline', key: 'tagline', width: 20 },
    { header: 'description', key: 'description', width: 30 },
    { header: 'tags', key: 'tags', width: 20 },
    { header: 'color', key: 'color', width: 10 },
    { header: 'cover', key: 'cover', width: 20 },
    { header: 'program', key: 'program', width: 20 },
    { header: 'subjects', key: 'subjects', width: 20 },
    { header: 'type', key: 'type', width: 15 },
    { header: 'gradable', key: 'gradable', width: 10 },
    { header: 'useAllQuestions', key: 'useAllQuestions', width: 15 },
    { header: 'questions', key: 'questions', width: 20 },
    { header: 'statement', key: 'statement', width: 30 },
    { header: 'creator', key: 'creator', width: 20 },
    { header: 'published', key: 'published', width: 10 },
    { header: 'config', key: 'config', width: 10 },
    { header: 'resources', key: 'resources', width: 10 },
    { header: 'instructionsForTeachers', key: 'instructionsForTeachers', width: 10 },
    { header: 'instructionsForStudents', key: 'instructionsForStudents', width: 10 },
    { header: 'duration', key: 'duration', width: 10 },
    { header: 'hideInLibrary', key: 'hideInLibrary', width: 10 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'BulkId',
    questionBank: 'Question Bank',
    name: 'Name',
    tagline: 'Tagline',
    description: 'Description',
    tags: 'Tags',
    color: 'Color',
    cover: 'Cover',
    program: 'Program',
    subjects: 'Subjects',
    type: 'Type',
    gradable: 'Gradable',
    useAllQuestions: 'Use All Questions',
    questions: 'Questions',
    statement: 'Statement',
    creator: 'Creator',
    published: 'Published',
    resources: 'Resources',
    config: 'Config',
    instructionsForTeachers: 'Instructions for Teachers',
    instructionsForStudents: 'Instructions for Students',
    duration: 'Duration',
    hideInLibrary: 'Hide in library',
  });

  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const notIndexableAssetIds = flatMap(testDetails, (test) => test.providerData.resources);
  const notIndexableAssets = await ctx.call('leebrary.assets.getByIds', {
    ids: notIndexableAssetIds,
    shouldPrepareAssets: true,
    withFiles: true,
  });

  const testsToReturn = [];
  testDetails.forEach((test, index) => {
    if (!test.providerData) return;
    const bulkId = `test${(index + 1).toString().padStart(2, '0')}`;
    const statementMarkdown = turndown.turndown(test.providerData.statement);
    const creator = adminShouldOwnAllAssets ? 'admin' : getCreator(test, users);

    const instructionsForTeachers = turndown.turndown(
      test.providerData.instructionsForTeachers ?? ''
    );
    const instructionsForStudents = turndown.turndown(
      test.providerData.instructionsForTeachers ?? ''
    );

    const testResourceAssets = (test.providerData.resources || []).map((id) =>
      notIndexableAssets.find((asset) => asset.id === id)
    );
    const resources = getDuplicatedAssetsReferenceAsString({
      libraryAssets,
      dups: testResourceAssets,
    });

    const questionBank = qBanks.find(
      (qBank) => qBank.providerData.id === test.providerData.metadata.questionBank
    )?.bulkId;

    const testObject = {
      root: bulkId,
      questionBank,
      name: test.name,
      tagline: test.tagline,
      description: test.description,
      tags: test.tags?.join(', '),
      color: test.color,
      cover: test.cover,
      program: programs.find((program) => program.id === test.program)?.bulkId ?? '',
      subjects:
        subjects.find((subject) => subject.id === test.subjects?.[0]?.subject)?.bulkId ?? '',
      type: test.providerData.metadata.type,
      gradable: booleanToYesNoAnswer(test.providerData.gradable),
      useAllQuestions: booleanToYesNoAnswer(test.providerData.metadata.filters?.useAllQuestions),
      questions: getQuestionsString(test.providerData.metadata.questions, questions),
      statement: statementMarkdown,
      creator,
      published: booleanToYesNoAnswer(test.providerData.published),
      resources,
      config: getMetadataConfig(test),
      instructionsForStudents,
      instructionsForTeachers,
      duration: test.providerData.duration,
      hideInLibrary: booleanToYesNoAnswer(!!test.hideInLibrary),
    };

    worksheet.addRow(omitBy(testObject, isNil));
    testsToReturn.push({ bulkId, ...test });
  });

  return testsToReturn;
}

module.exports = { createTestsSheet };
