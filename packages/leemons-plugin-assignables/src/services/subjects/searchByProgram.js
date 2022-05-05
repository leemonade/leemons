const _ = require('lodash');
const { subjects: table } = require('../tables');

module.exports = async function searchByProgram(programs, { transacting } = {}) {
  let relatedPrograms = await table.find(
    { program_$in: _.compact(_.isArray(programs) ? programs : [programs]) },
    { columns: ['assignable', 'program'], transacting }
  );

  relatedPrograms = Object.entries(
    relatedPrograms.reduce(
      (obj, value) => ({
        ...obj,
        [value.assignable]: [...(obj[value.assignable] || []), value.program],
      }),
      {}
    )
  )
    .filter(([, prgrm]) => !_.difference(programs, prgrm).length)
    .map(([assignable]) => assignable);

  return relatedPrograms;
};
