const { table } = require('../tables');
const {
  programCanHaveCoursesOrHaveCourses,
} = require('../programs/programCanHaveCoursesOrHaveCourses');

async function subjectNeedCourseForAdd(program, { transacting } = {}) {
  // ES: Comprobamos si el programa tiene o puede tener cursos asignados
  const haveCourses = await programCanHaveCoursesOrHaveCourses(program, { transacting });
  if (haveCourses) {
    // ES: Si puede tener cursos comprobamos si dentro de la configuracion del programa hay que meter a las asignaturas el indice del curso
    const { subjectsFirstDigit } = await table.programs.findOne(
      { id: program },
      { columns: ['id', 'subjectsFirstDigit'], transacting }
    );
    return subjectsFirstDigit === 'course';
  }
  return false;
}

module.exports = { subjectNeedCourseForAdd };
