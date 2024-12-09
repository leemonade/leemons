const { gradeMapQuestion } = require('./gradeMapQuestion');
const { gradeMonoResponseQuestion } = require('./gradeMonoResponseQuestion');
const { gradeOpenQuestion } = require('./gradeOpenQuestion');
const { gradeShortResponseQuestion } = require('./gradeShortResponseQuestion');
const { gradeTrueFalseQuestion } = require('./gradeTrueFalseQuestion');

module.exports = {
  gradeMonoResponseQuestion,
  gradeMapQuestion,
  gradeTrueFalseQuestion,
  gradeShortResponseQuestion,
  gradeOpenQuestion,
};
