const { addCourse } = require('./addCourse');
const { listCourses } = require('./listCourses');
const { updateCourse } = require('./updateCourse');
const { addNextCourseIndex } = require('./addNextCourseIndex');
const { getNextCourseIndex } = require('./getNextCourseIndex');
const { getCourseById } = require('./getCourseById');

module.exports = {
  addCourse,
  listCourses,
  updateCourse,
  getCourseById,
  addNextCourseIndex,
  getNextCourseIndex,
};
