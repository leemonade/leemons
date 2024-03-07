async function add({ class: _class, course, ctx }) {
  const classCourseDoc = await ctx.tx.db.ClassCourse.findOneAndUpdate(
    {
      class: _class,
      course,
    },
    { class: _class, course },
    { upsert: true, new: true }
  );
  return classCourseDoc.toObject();
}

module.exports = { add };
