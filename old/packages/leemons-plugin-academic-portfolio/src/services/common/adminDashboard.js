const _ = require('lodash');
const { table } = require('../tables');

async function adminDashboard(config, { userSession, transacting } = {}) {
  let centers = [];
  if (config.center && config.center !== 'undefined') {
    centers.push({ id: config.center });
  }
  if (!centers.length) {
    centers = await leemons
      .getPlugin('users')
      .services.users.getUserCenters(userSession.id, { transacting });
  }
  const programCenter = await table.programCenter.find(
    { center_$in: _.map(centers, 'id') },
    { transacting }
  );
  const [programs, classStudents, classTeachers, classes, subjects, groups] = await Promise.all([
    table.programs.find({ id_$in: _.map(programCenter, 'program') }, { transacting }),
    table.classStudent.find({}, { transacting }),
    table.classTeacher.find({}, { transacting }),
    table.class.find({}, { columns: ['id', 'program'], transacting }),
    table.subjects.find({}, { columns: ['id', 'program'], transacting }),
    table.groups.find({}, { columns: ['id', 'type', 'program'], transacting }),
  ]);

  const results = {
    programs: [],
    totalStudents: [],
    totalTeachers: [],
  };

  const classesByProgram = _.groupBy(classes, 'program');
  const subjectsByProgram = _.groupBy(subjects, 'program');
  const groupsByProgram = _.groupBy(groups, 'program');
  const classStudentsByClass = _.groupBy(classStudents, 'class');
  const classTeachersByClass = _.groupBy(classTeachers, 'class');

  _.forEach(programs, (program) => {
    const r = {
      program,
      students: [],
      teachers: [],
      subjects: [],
      courses: [],
      groups: [],
      substages: [],
      classes: [],
    };
    const groupsByType = _.groupBy(groupsByProgram[program.id], 'type');
    r.groups = _.map(groupsByType.group, 'id');
    r.courses = _.map(groupsByType.course, 'id');
    r.substages = _.map(groupsByType.substage, 'id');
    r.classes = _.map(classesByProgram[program.id], 'id');
    r.subjects = _.map(subjectsByProgram[program.id], 'id');
    _.forEach(r.classes, (id) => {
      r.students = r.students.concat(_.map(classStudentsByClass[id], 'student'));
      r.teachers = r.teachers.concat(_.map(classTeachersByClass[id], 'teacher'));
    });

    results.totalStudents = results.totalStudents.concat(r.students);
    results.totalTeachers = results.totalTeachers.concat(r.teachers);

    r.substages = _.uniq(r.substages).length;
    r.students = _.uniq(r.students).length;
    r.teachers = _.uniq(r.teachers).length;
    r.subjects = _.uniq(r.subjects).length;
    r.courses = _.uniq(r.courses).length;
    r.classes = _.uniq(r.classes).length;
    r.groups = _.uniq(r.groups).length;

    results.programs.push(r);
  });

  results.totalStudents = _.uniq(results.totalStudents).length;
  results.totalTeachers = _.uniq(results.totalTeachers).length;

  return results;
}

module.exports = { adminDashboard };
