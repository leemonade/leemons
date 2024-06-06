const { keyBy } = require('lodash');
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

  const classByIds = keyBy(classesInfo, 'id');

  const classesPerInstance = {};
  classesFound.forEach(({ class: klass, assignableInstance: instance }) => {
    const klassObject = {
      id: klass,
      subject: classByIds[klass].subject.id,
      program: classByIds[klass].program,
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
