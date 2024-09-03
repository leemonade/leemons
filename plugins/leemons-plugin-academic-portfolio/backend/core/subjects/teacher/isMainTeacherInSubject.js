const { subjectByIds } = require('../subjectByIds');

async function isMainTeacherInSubject({ subjectIds, ctx }) {
  if (!subjectIds?.length) return false;
  const subjectDetails = await subjectByIds({
    ids: subjectIds,
    withClasses: true,
    ctx,
  });
  const [teacherUserAgent] = ctx.meta.userSession.userAgents;

  const allMainTeachers = subjectDetails.reduce((acc, subject) => {
    const mainTeachersInSubject = subject.classes.reduce((accClasses, { teachers }) => {
      const mainTeachers = teachers.filter((teacher) => teacher.type === 'main-teacher');
      accClasses.push(...mainTeachers.map((teacher) => teacher.teacher));
      return accClasses;
    }, []);
    acc.push(...mainTeachersInSubject);
    return acc;
  }, []);

  return allMainTeachers.includes(teacherUserAgent.id);
}
module.exports = {
  isMainTeacherInSubject,
};
