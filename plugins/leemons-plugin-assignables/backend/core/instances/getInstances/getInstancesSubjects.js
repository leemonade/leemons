const { flatten, uniq } = require('lodash');

/**
 * @async
 * @function getInstancesSubjects
 * @param {Object} params - Parameters for getInstancesSubjects
 * @param {Object} params.classesPerInstance - The classes per instance
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The subjects per instance
 * @throws {LeemonsError} When there is an error retrieving the subjects per instance
 */

async function getInstancesSubjects({ classesPerInstance, ctx }) {
  const instances = Object.keys(classesPerInstance);
  const classes = uniq(flatten(Object.values(classesPerInstance)));

  const classesData = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: classes,
    withProgram: false,
    withTeachers: false,
    noSearchChildren: true,
    noSearchParents: true,
  });

  const subjectPerClass = {};

  classesData.forEach((klass) => {
    subjectPerClass[klass.id] = { program: klass.program, subject: klass.subject.id };
  });

  const subjectsPerInstance = {};

  instances.forEach((instance) => {
    const instanceClasses = classesPerInstance[instance];

    const subjects = [];

    instanceClasses.forEach((klass) => {
      subjects.push(subjectPerClass[klass]);
    });

    subjectsPerInstance[instance] = uniq(subjects);
  });

  return subjectsPerInstance;
}

module.exports = { getInstancesSubjects };
