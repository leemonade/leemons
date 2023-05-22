const { uniq, map } = require('lodash');
const tables = require('../../../tables');

async function getInstanceSubjectsProgramsAndClasses(instances, { userSession, transacting }) {
  const instancesIds = uniq(map(instances, 'id'));

  const instanceClasses = await tables.classes.find(
    {
      assignableInstance_$in: instancesIds,
    },
    { transacting }
  );

  const classesPerInstance = {};

  instanceClasses.forEach((instanceClass) => {
    if (classesPerInstance[instanceClass.assignableInstance]) {
      classesPerInstance[instanceClass.assignableInstance].push(instanceClass.class);
    } else {
      classesPerInstance[instanceClass.assignableInstance] = [instanceClass.class];
    }
  });

  const classesData = await leemons
    .getPlugin('academic-portfolio')
    .services.classes.classByIds(uniq(map(instanceClasses, 'class')), { userSession, transacting });

  const subjectsPerClass = {};
  const programsPerClass = {};
  classesData.forEach((klass) => {
    subjectsPerClass[klass.id] = klass.subject.id;
    programsPerClass[klass.id] = klass.program;
  });

  const dataPerInstance = {};

  instances.forEach((instance) => {
    const classes = classesPerInstance[instance.id];
    const subjects = [];
    const programs = [];
    classes.forEach((klass) => {
      subjects.push(subjectsPerClass[klass]);
      programs.push(programsPerClass[klass]);
    });

    dataPerInstance[instance.id] = {
      subjects: uniq(subjects),
      programs: uniq(programs),
      classes: classesPerInstance[instance.id],
    };
  });

  return dataPerInstance;
}
exports.getInstanceSubjectsProgramsAndClasses = getInstanceSubjectsProgramsAndClasses;
