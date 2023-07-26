const zones = require('../src/services/widget-zone');
const items = require('../src/services/widget-item');
const { table } = require('../src/services/tables');

module.exports = {
  // ---- WIDGET ZONES ----
  getZone: zones.get,
  addZone: zones.add,
  existsZone: zones.exists,
  updateZone: zones.update,
  deleteZone: zones.remove,
  setZone: async function setZone(key, { name, description, transacting } = {}) {
    const exists = await zones.exists(key, { transacting });
    if (exists) return zones.update.call(this, key, { name, description, transacting });
    return zones.add.call(this, key, { name, description, transacting });
  },
  // ---- WIDGET ITEMS ----
  setItemToZone: async function setItemToZone(
    zoneKey,
    key,
    url,
    { name, description, profiles, properties = {}, transacting } = {}
  ) {
    const exists = await table.widgetItem.count({ key }, { transacting });
    if (exists) {
      return items.update.call(this, zoneKey, key, {
        url,
        name,
        description,
        profiles,
        properties,
        transacting,
      });
    }
    return items.add.call(this, zoneKey, key, url, {
      name,
      description,
      profiles,
      properties,
      transacting,
    });
  },
  addItemToZone: items.add,
  existsItemInZone: items.exists,
  updateItemInZone: items.update,
  deleteItemInZone: items.remove,
  updateOrderItemsInZone: items.updateOrders,
  updateProfileItemsInZone: items.updateProfiles,
};
