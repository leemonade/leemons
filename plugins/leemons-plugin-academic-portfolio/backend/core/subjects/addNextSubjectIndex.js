// const { table } = require('../tables');
// const { getNextSubjectIndex } = require('./getNextSubjectIndex');
// const { LeemonsError } = require('leemons-error')

// TODO paola SUPER VERIFICAR Y BORRAS
async function addNextSubjectIndex(program, { course, index, transacting } = {}) {
  throw new Error('No use addNextSubjectIndex');
  // throw new LeemonsError(ctx, { message: 'No use addNextSubjectIndex' });
  /*
  let goodIndex = index;
  if (!index) {
    goodIndex = await getNextSubjectIndex(program, { course, transacting });
  }
  await table.configs.set(
    { key: `program-${program}-course-${course}-index` },
    { key: `program-${program}-course-${course}-index`, value: goodIndex.toString() },
    { transacting }
  );
  return goodIndex;

   */
}

module.exports = { addNextSubjectIndex };
