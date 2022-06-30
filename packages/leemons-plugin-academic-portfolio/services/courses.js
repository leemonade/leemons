const { addCourse } = require('../src/services/courses');

module.exports = {
  addCourse,
  getCourseName: (item) => (item.name ? `${item.name}` : `${item.index}º`),
};
