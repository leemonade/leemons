const _ = require('lodash');
const { saveGeneral } = require('./saveGeneral');
const { saveCenter } = require('./saveCenter');
const { saveProgram } = require('./saveProgram');

async function saveFullByCenter({ center, data, ctx }) {
  const programPromises = [];
  _.forEach(data.program, (programData, programId) => {
    programPromises.push(saveProgram({ program: programId, config: programData, ctx }));
  });
  await Promise.all([
    saveGeneral({ config: { enabled: data.enabled }, ctx }),
    saveCenter({
      center,
      config: {
        enableSecureWords: data.enableSecureWords,
        secureWords: data.secureWords,
        enableStudentsChats: data.enableStudentsChats,
        enableStudentsCreateGroups: data.enableStudentsCreateGroups,
        disableChatsBetweenStudentsAndTeachers: data.disableChatsBetweenStudentsAndTeachers,
        studentsCanAddTeachersToGroups: data.studentsCanAddTeachersToGroups,
      },
      ctx,
    }),
    Promise.all(programPromises),
  ]);
  return data;
}

module.exports = { saveFullByCenter };
