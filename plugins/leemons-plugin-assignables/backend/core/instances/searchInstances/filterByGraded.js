const { map, uniq } = require('lodash');

const { getGrade } = require('../../grades/getGrade');
const { getInstancesSubjects } = require('./getInstancesSubjects');

/**
 * Filters an array of objects based on a query by subject grades and the user's role.
 *
 * @param {Object} options - An object containing the following properties:
 * @param {Array<AssignablesInstance>|Array<AssignablesAssignation>} options.objects: The array of objects to be filtered.
 * @param {Object} options.query: The query used for filtering.
 * @param {Boolean} options.isTeacher: Indicates whether the user is a teacher.
 * @param {MoleculerContext} options.options.ctx - The Moleculer context object.
 * @return {Array} The filtered array of objects.
 */
async function filterByGraded({ objects, query, isTeacher, ctx }) {
  let instances = objects;
  if (!isTeacher) {
    instances = map(objects, 'instance');
  }
  if (query.evaluated === undefined) {
    return instances;
  }

  // EN: Get the instance classes.
  // ES: Obtener las clases de la instancia.
  const instancesSubjects = await getInstancesSubjects({ instances, ctx });

  if (!isTeacher) {
    const assignationsWithGrades = await Promise.all(
      objects.map(async (assignation) => {
        const studentGrades = await getGrade({
          assignation: assignation.id,
          visibleToStudent: true,
          type: 'main',
          ctx,
        });
        const gradedSubjects = uniq(map(studentGrades, 'subject'));

        return {
          ...assignation,
          grades: studentGrades,
          fullyGraded: gradedSubjects.length === instancesSubjects[assignation.instance]?.length,
        };
      })
    );

    return map(
      assignationsWithGrades.filter(({ fullyGraded }) => {
        if (query.evaluated) {
          return fullyGraded;
        }
        if (!query.evaluated) {
          return !fullyGraded;
        }

        return true;
      }),
      'instance'
    );
  }

  // EN: Get all the students assignations
  // ES: Obtener todas las asignaciones de los estudiantes.
  const studentsAssignations = await ctx.tx.db.Assignations.find({
    instance: instances,
  })
    .select(['instance', 'id'])
    .lean();

  // EN: Get all the students grades
  // ES: Obtener todas las calificaciones de los estudiantes.
  const studentsGrades = await Promise.all(
    studentsAssignations.map(async (assignation) => {
      const studentGrades = await getGrade({
        assignation: assignation.id,
        visibleToStudent: false,
        type: 'main',
        ctx,
      });

      return {
        ...assignation,
        grades: studentGrades,
        fullyGraded: studentGrades.length === instancesSubjects[assignation.instance]?.length,
      };
    })
  );

  // EN: Group the students grades by assignableInstance
  // ES: Agrupar las calificaciones de los estudiantes por instancia.
  const studentsGradesByAssignableInstance = studentsGrades.reduce(
    (acc, assignation) => ({
      ...acc,
      [assignation.instance]: [...(acc[assignation.instance] || []), assignation.fullyGraded],
    }),
    {}
  );

  // EN: Filter the assignations by the query.evaluated
  // ES: Filtrar las asignaciones por query.evaluated.
  return Object.entries(studentsGradesByAssignableInstance)
    .filter(([, studentsFullyGraded]) => {
      if (query.evaluated) {
        return !studentsFullyGraded.some((grade) => !grade);
      }
      return studentsFullyGraded.some((grade) => !grade);
    })
    .map(([assignableInstance]) => assignableInstance);

  // if (query.graded) {
  //   return objects.filter((object) => object.graded);
  // }

  // if (!query.graded) {
  //   return objects.filter((object) => !object.graded);
  // }
}

module.exports = {
  filterByGraded,
};
