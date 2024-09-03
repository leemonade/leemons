const _ = require('lodash');
const { styleCell, booleanToYesNoAnswer } = require('./helpers');

const getCreator = (taskAsset, users) => users.find((u) => u.id === taskAsset.fromUser)?.bulkId;

function createTestsQBanksSheet({
  workbook,
  qBankDetails,
  users,
  programs,
  adminShouldOwnAllAssets,
  subjects,
}) {
  const worksheet = workbook.addWorksheet('te_qbanks');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'name', key: 'name', width: 20 },
    { header: 'description', key: 'description', width: 20 },
    { header: 'tagline', key: 'tagline', width: 20 },
    { header: 'color', key: 'color', width: 20 },
    { header: 'cover', key: 'cover', width: 20 },
    { header: 'tags', key: 'tags', width: 20 },
    { header: 'creator', key: 'creator', width: 20 },
    { header: 'program', key: 'program', width: 20 },
    { header: 'subjects', key: 'subjects', width: 20 },
    { header: 'published', key: 'published', width: 20 },
    { header: 'hideInLibrary', key: 'hideInLibrary', width: 10 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'BulkId',
    name: 'Name',
    description: 'Description',
    tagline: 'Tagline',
    color: 'Color',
    cover: 'Cover',
    tags: 'Tags',
    creator: 'Creator',
    program: 'Program',
    subjects: 'Subjects',
    published: 'Published',
    hideInLibrary: 'Hide in library',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  return qBankDetails.map((qBank, i) => {
    let subjectId = qBank.subjects?.[0]?.subject ?? '';
    if (!subjectId) subjectId = qBank.providerData.subjects?.[0];

    let _program = qBank.program;
    if (!_program) _program = qBank.providerData.program;

    const bulkId = `qbank_${(i + 1).toString().padStart(2, '0')}`;
    const creator = adminShouldOwnAllAssets ? 'admin' : getCreator(qBank, users);
    const qBankObject = {
      root: bulkId,
      name: qBank.name,
      description: qBank.description,
      tagline: qBank.tagline,
      color: qBank.color,
      cover: qBank.cover,
      tags: qBank.tags?.join(', '),
      creator,
      program: programs.find((item) => item.id === _program)?.bulkId ?? '',
      subjects: subjects.find((item) => item.id === subjectId)?.bulkId ?? '',
      published: booleanToYesNoAnswer(qBank.providerData.published),
      hideInLibrary: booleanToYesNoAnswer(!!qBank.hideInLibrary),
    };
    worksheet.addRow(_.omitBy(qBankObject, _.isNil));

    return {
      ...qBank,
      bulkId,
      qBankObject,
      worksheet,
    };
  });
}

module.exports = { createTestsQBanksSheet };
