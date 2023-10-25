const { difference } = require('lodash');
const { tryParse, isNonEmptyArray } = require('../helpers');

function filterInstancesByProgramAndSubjects({
  instances,
  filters = {},
  instanceSubjectsProgramsAndClasses,
}) {
  const programs = tryParse(filters?.programs ?? null);
  const subjects = tryParse(filters?.subjects ?? null);
  const classes = tryParse(filters?.classes ?? null);

  if (!isNonEmptyArray(programs) && !isNonEmptyArray(subjects) && !isNonEmptyArray(classes)) {
    return instances;
  }

  let filteredInstances = instances;

  if (isNonEmptyArray(programs)) {
    filteredInstances = filteredInstances.filter(
      (instance) =>
        difference(programs, instanceSubjectsProgramsAndClasses[instance.id]?.programs)?.length ===
        0
    );
  }

  if (isNonEmptyArray(subjects)) {
    filteredInstances = filteredInstances.filter(
      (instance) =>
        difference(subjects, instanceSubjectsProgramsAndClasses[instance.id].subjects)?.length === 0
    );
  }

  if (isNonEmptyArray(classes)) {
    filteredInstances = filteredInstances.filter(
      (instance) =>
        difference(classes, instanceSubjectsProgramsAndClasses[instance.id].classes)?.length === 0
    );
  }

  return filteredInstances;
}

module.exports = { filterInstancesByProgramAndSubjects };
