const { validateAddCourse } = require('../../validations/forms');
const { getNextCourseIndex } = require('./getNextCourseIndex');
const { addNextCourseIndex } = require('./addNextCourseIndex');

async function addCourse({ data, index: _index, ctx }) {
  await validateAddCourse({ data, ctx });
  let index = _index;
  if (!index) {
    index = await getNextCourseIndex({ program: data.program, ctx });
    await addNextCourseIndex({ program: data.program, index, ctx });
  }
  const groupDoc = await ctx.tx.db.Groups.create({ ...data, index, type: 'course' });
  return groupDoc.toObject();
}

module.exports = { addCourse };
