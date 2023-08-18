const {
  programCanHaveCoursesOrHaveCourses,
} = require('../programs/programCanHaveCoursesOrHaveCourses');

async function subjectNeedCourseForAdd({ program, ctx }) {
  // ES: Comprobamos si el programa tiene o puede tener cursos asignados
  // EN: We check if the program has or can have assigned courses
  const haveCourses = await programCanHaveCoursesOrHaveCourses({ id: program, ctx });
  if (haveCourses) {
    // ES: Si puede tener cursos comprobamos si dentro de la configuracion del programa hay que meter a las asignaturas el indice del curso
    // EN: If it can have courses, we check if within the program's configuration we need to input the course index to the subjects
    const { subjectsFirstDigit } = await ctx.tx.db.Programs.findOne({ id: program })
      .select(['id', 'subjectsFirstDigit'])
      .lean();
    return subjectsFirstDigit === 'course';
  }
  return false;
}

module.exports = { subjectNeedCourseForAdd };
