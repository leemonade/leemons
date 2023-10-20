const _ = require('lodash');

async function getClassesWithSubject({ instancesIds, ctx }) {
  const classesFound = await ctx.tx.db.Classes.find({ assignableInstance: instancesIds })
    .select(['assignableInstance', 'class'])
    .lean();

  const classesIds = _.uniq(_.map(classesFound, 'class'));

  const classesInfo = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: classesIds,
    withTeachers: true,
  });

  const subjectsPerClass = {};
  classesInfo.forEach((klass) => {
    subjectsPerClass[klass.id] = klass.subject.id;
  });

  const classesPerInstance = {};
  classesFound.forEach(({ class: klass, assignableInstance: instance }) => {
    const klassObject = {
      id: klass,
      subject: subjectsPerClass[klass],
    };

    if (!classesPerInstance[instance]) {
      classesPerInstance[instance] = {
        classes: [klassObject],
        classesIds: [klassObject.id],
        subjectsIds: [klassObject.subject],
      };
    } else {
      classesPerInstance[instance].classes.push(klassObject);
      classesPerInstance[instance].classesIds.push(klassObject.id);
      classesPerInstance[instance].subjectsIds.push(klassObject.subject);
    }
  });

  return classesPerInstance;
}

module.exports = { getClassesWithSubject };
