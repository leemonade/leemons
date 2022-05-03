const _ = require('lodash');
const { subjects: table } = require('../tables');

module.exports = async function searchBySubject(subjects, { transacting } = {}) {
  let relatedSubjects = await table.find(
    { subject_$in: _.compact(_.isArray(subjects) ? subjects : [subjects]) },
    { columns: ['assignable', 'subject'], transacting }
  );

  relatedSubjects = Object.entries(
    relatedSubjects.reduce(
      (obj, value) => ({
        ...obj,
        [value.assignable]: [...(obj[value.assignable] || []), value.subject],
      }),
      {}
    )
  )
    .filter(([, sbjcts]) => !_.difference(subjects, sbjcts).length)
    .map(([assignable]) => assignable);

  return relatedSubjects;
};
