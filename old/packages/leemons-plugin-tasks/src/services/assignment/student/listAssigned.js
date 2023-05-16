const { userInstances } = require('../../table');
const { get } = require('../instance/get');

module.exports = async function listAssigned(
  userAgent,
  page,
  size,
  { details = false, columns, transacting } = {}
) {
  try {
    const instances = await global.utils.paginate(
      userInstances,
      page,
      size,
      { id_$null: false, user: userAgent },
      { transacting }
    );

    if (details) {
      const data = (
        await get(
          instances.items.map((i) => i.instance),
          { columns, transacting }
        )
      ).reduce((o, d) => ({ ...o, [d.id]: d }), {});

      instances.items = instances.items.map((i) => ({
        ...i,
        ...data[i.instance],
      }));
    }

    return instances;
  } catch (e) {
    throw new Error(`Error getting student instances ${e.message}`);
  }
};
