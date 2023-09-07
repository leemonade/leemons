const _ = require('lodash');

async function publishCurriculum({ curriculumId, ctx }) {
  return ctx.tx.db.Curriculums.findOneAndUpdate(
    { id: curriculumId },
    { published: true },
    { new: true, lean: true }
  );
}

module.exports = { publishCurriculum };
