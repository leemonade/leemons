const { addCourse } = require('./addCourse');
const { listCourses } = require('./listCourses');
const { updateCourse } = require('./updateCourse');
const { addNextCourseIndex } = require('./addNextCourseIndex');
const { getNextCourseIndex } = require('./getNextCourseIndex');

module.exports = {
  addCourse,
  listCourses,
  updateCourse,
  addNextCourseIndex,
  getNextCourseIndex,
};
