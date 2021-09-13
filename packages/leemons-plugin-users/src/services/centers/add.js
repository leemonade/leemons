const existName = require('./existName');
const { translations } = require('../translations');
const { table } = require('../tables');
const createNecessaryRolesForProfilesAccordingToCenters = require('../profiles/createNecessaryRolesForProfilesAccordingToCenters');

/**
 * Create one center
 * @private
 * @static
 * @param {CenterAdd} data
 * @param {any=} _transacting -  DB Transaction
 * @return {Promise<Center>} Created / Updated role
 * */
async function add({ name, description, locale }, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      if (await existName(name, { transacting }))
        throw new Error(`Center with name '${name}' already exists`);

      if (translations()) {
        if (!(await translations().locales.has(locale, { transacting }))) {
          throw new Error(`The locale '${locale}' not exists`);
        }
      }

      leemons.log.info(`Creating center '${name}'`);
      const center = await table.centers.create(
        {
          name,
          description,
          locale,
          uri: global.utils.slugify(name, { lower: true }),
        },
        { transacting }
      );

      await createNecessaryRolesForProfilesAccordingToCenters(undefined, center.id, {
        transacting,
      });

      leemons.events.emit('didCreateCenter');
      return center;
    },
    table.roles,
    _transacting
  );
}

module.exports = add;
