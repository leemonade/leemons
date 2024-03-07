const _ = require('lodash');
const { validateSaveSession } = require('../../validations/forms');

async function save({ body, ctx }) {
  validateSaveSession(body);

  let session = null;

  if (body.id) {
    session = await ctx.tx.db.Session.findOne({ id: body.id }).lean();
  }

  if (session) {
    session = await ctx.tx.db.Session.findOneAndUpdate(
      { id: session.id },
      {
        start: new Date(body.start),
        end: new Date(body.end),
        class: body.class,
      },
      { new: true, lean: true }
    );
  } else {
    session = await ctx.tx.db.Session.create({
      start: new Date(body.start),
      end: new Date(body.end),
      class: body.class,
    });
    session = session.toObject();
  }

  if (body.attendance) {
    await Promise.all(
      _.map(body.attendance, (value, key) =>
        ctx.tx.db.Assistance.updateOne(
          { session: session.id, student: key },
          { session: session.id, student: key, assistance: value, comment: body.comments[key] },
          { upsert: true }
        )
      )
    );
  }

  return session;
}

module.exports = { save };
