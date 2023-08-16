const _ = require('lodash');
const { validateSaveSession } = require('../../validations/forms');
const { tables } = require('../tables');

async function save(body, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      validateSaveSession(body);

      let session = null;

      if (body.id) {
        session = await tables.session.findOne({ id: body.id }, { transacting });
      }

      if (session) {
        session = await tables.session.update(
          { id: session.id },
          {
            start: new Date(body.start),
            end: new Date(body.end),
            class: body.class,
          },
          { transacting }
        );
      } else {
        session = await tables.session.create(
          {
            start: new Date(body.start),
            end: new Date(body.end),
            class: body.class,
          },
          { transacting }
        );
      }

      if (body.attendance) {
        await Promise.all(
          _.map(body.attendance, (value, key) =>
            tables.assistance.set(
              { session: session.id, student: key },
              { session: session.id, student: key, assistance: value, comment: body.comments[key] },
              { transacting }
            )
          )
        );
      }

      return session;
    },
    tables.session,
    _transacting
  );
}

module.exports = { save };
