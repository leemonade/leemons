const { table } = require('../tables');
const { getNextSubjectIndex } = require('./getNextSubjectIndex');

async function generateNextSubjectInternalId(program, { course, transacting } = {}) {
  throw new Error('No use generateNextSubjectInternalId');
  /*
  const internalIndex = await getNextSubjectIndex(program, { course, transacting });
  const { subjectsDigits } = await table.programs.findOne(
    { id: program },
    { columns: ['id', 'subjectsDigits'], transacting }
  );
  let internalId = internalIndex.toString().padStart(subjectsDigits, '0');

  // ES: Si tenemos curso sacamos cual es un indice y los concatenamos al prinicio del id
  if (course) {
    const { index } = await table.groups.findOne(
      { id: course, type: 'course' },
      { columns: ['id', 'index'], transacting }
    );
    internalId = `${index}${internalId}`;
  }

  return internalId;
   */
}

module.exports = { generateNextSubjectInternalId };
