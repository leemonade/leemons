const table = leemons.query('plugins_subjects::teachingItems');

module.exports = async (items, { useNames, transacting } = {}) => {
  try {
    if (Array.isArray(items)) {
      const savedItems = await table.find(
        { [useNames ? 'name_$in' : 'id_$in']: items },
        { columns: [useNames ? 'name' : 'id'], transacting }
      );
      return items.reduce(
        async (obj, item) => ({
          ...(await obj),
          [item]: Boolean(savedItems.find((_item) => _item[useNames ? 'name' : 'id'] === item)),
        }),
        {}
      );
    }
    return Boolean(
      await table.findOne(
        { [useNames ? 'name' : 'id']: items },
        { columns: [useNames ? 'name' : 'id'], transacting }
      )
    );
  } catch (e) {
    throw new Error("Can't fetch the existing teaching items");
  }
};
