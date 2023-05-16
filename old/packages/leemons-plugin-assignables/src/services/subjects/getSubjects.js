const _ = require('lodash');
const { subjects } = require('../tables');

module.exports = async function getSubjects(assignablesIds, { ids = false, transacting } = {}) {
  if (!Array.isArray(assignablesIds)) {
    const relatedSubjects = await subjects.find({ assignable: assignablesIds }, { transacting });

    return _.sortBy(
      relatedSubjects.map(({ subject, level, curriculum, id, program }) => {
        const obj = {
          program,
          subject,
          level,
          curriculum: JSON.parse(curriculum) || {},
        };

        if (ids) {
          obj.id = id;
        }

        return obj;
      }),
      'subject',
      'level'
    );
  }

  const relatedSubjects = await subjects.find({ assignable_$in: assignablesIds }, { transacting });

  const subjectsPerAssignable = {};

  relatedSubjects.forEach((subject) => {
    const subjectData = {
      program: subject.program,
      subject: subject.subject,
      level: subject.level,
      curriculum: JSON.parse(subject.curriculum) || {},
    };

    if (ids) {
      subjectData.id = subject.id;
    }

    if (!subjectsPerAssignable[subject.assignable]) {
      subjectsPerAssignable[subject.assignable] = [subjectData];
    } else {
      subjectsPerAssignable[subject.assignable].push(subjectData);
    }
  });

  // EN: Sort the subjects
  // ES: Ordenar las asignaturas
  Object.entries(subjectsPerAssignable).forEach(([key, unsortedSubjects]) => {
    const sortedSubjects = _.sortBy(unsortedSubjects, 'subject', 'level');

    subjectsPerAssignable[key] = sortedSubjects;
  });

  return subjectsPerAssignable;
};
