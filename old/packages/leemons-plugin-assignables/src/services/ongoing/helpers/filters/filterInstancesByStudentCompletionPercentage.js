const { uniq, map, groupBy, union } = require('lodash');
const tables = require('../../../tables');

async function filterInstancesByStudentCompletionPercentage(
  {
    instances,
    min = 0,
    max = 100,
    includeMin,
    includeMax,
    excludeStudentsFullyEvaluated,
    instanceSubjectsProgramsAndClasses,
  },
  { transacting }
) {
  const uniqInstancesIds = uniq(map(instances, 'id'));

  const assignations = await tables.assignations.find(
    {
      instance_$in: uniqInstancesIds,
    },
    {
      columns: ['id', 'instance'],
      transacting,
    }
  );

  const assignationsIds = map(assignations, 'id');

  const [assignationsGrades, assignationsDates] = await Promise.all([
    !excludeStudentsFullyEvaluated
      ? []
      : tables.grades.find(
          {
            type: 'main',
            assignation_$in: assignationsIds,
          },
          {
            columns: ['id', 'subject', 'assignation'],
          }
        ),

    tables.dates.find(
      {
        type: 'assignation',
        instance_$in: assignationsIds,
        name: 'end',
      },
      {
        columns: ['id', 'instance', 'date'],
        transacting,
      }
    ),
  ]);

  const gradesPerAssignation = groupBy(assignationsGrades, 'assignation');
  const datesPerAssignation = groupBy(assignationsDates, 'instance');
  const assignationsPerInstance = {};

  assignations.forEach((assignation) => {
    assignationsPerInstance[assignation.instance] = union(
      assignationsPerInstance[assignation.instance],
      [assignation.id]
    );
  });

  return instances.filter((instance) => {
    const subjectsCount = instanceSubjectsProgramsAndClasses?.[instance.id]?.subjects?.length || 0;
    const students = assignationsPerInstance[instance.id] ?? [];
    const studentsCount = students.length;
    const studentsWhoFinished = students
      .map((studentAssignation) => ({
        hasFinished: !!datesPerAssignation[studentAssignation],
        isFullyEvaluated:
          gradesPerAssignation[studentAssignation]?.length === subjectsCount && subjectsCount > 0,
      }))
      .filter((student) => student.hasFinished && !student.isFullyEvaluated).length;

    const completionPercentage = studentsWhoFinished / studentsCount;

    if (includeMin) {
      return min === completionPercentage;
    }
    if (includeMax) {
      return max === completionPercentage;
    }
    return min < completionPercentage && max > completionPercentage;
  });
}

module.exports = {
  filterInstancesByStudentCompletionPercentage,
};
