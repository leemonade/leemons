const _ = require('lodash');
const { saveGeneral } = require('./saveGeneral');
const { saveCenter } = require('./saveCenter');
const { saveProgram } = require('./saveProgram');

async function saveFullByCenter(center, data, { transacting } = {}) {
  const programPromises = [];
  _.forEach(data.program, (programData, programId) => {
    programPromises.push(saveProgram(programId, programData, { transacting }));
  });
  await Promise.all([
    saveGeneral({ enabled: data.enabled }, { transacting }),
    saveCenter(
      center,
      {
        enableSecureWords: data.enableSecureWords,
        secureWords: data.secureWords,
        enableStudentsChats: data.enableStudentsChats,
        enableStudentsCreateGroups: data.enableStudentsCreateGroups,
        disableChatsBetweenStudentsAndTeachers: data.disableChatsBetweenStudentsAndTeachers,
        studentsCanAddTeachersToGroups: data.studentsCanAddTeachersToGroups,
      },
      { transacting }
    ),
    Promise.all(programPromises),
  ]);
  return data;
}

module.exports = { saveFullByCenter };
