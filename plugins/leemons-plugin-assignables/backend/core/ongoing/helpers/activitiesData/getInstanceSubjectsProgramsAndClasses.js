const { uniq, map } = require('lodash');

async function getInstanceSubjectsProgramsAndClasses({ instances, ctx }) {
  const instancesIds = uniq(map(instances, 'id'));

  const instanceClasses = await ctx.tx.db.Classes.find({
    assignableInstance: instancesIds,
  }).lean();

  const classesPerInstance = {};

  instanceClasses.forEach((instanceClass) => {
    if (classesPerInstance[instanceClass.assignableInstance]) {
      classesPerInstance[instanceClass.assignableInstance].push(instanceClass.class);
    } else {
      classesPerInstance[instanceClass.assignableInstance] = [instanceClass.class];
    }
  });

  const classesData = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: uniq(map(instanceClasses, 'class')),
  });

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
