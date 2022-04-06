const zones = require('../src/services/widget-zone');
const items = require('../src/services/widget-item');

module.exports = {
  // ---- WIDGET ZONES ----
  getZone: zones.get,
  addZone: zones.add,
  existsZone: zones.exists,
  updateZone: zones.update,
  deleteZone: zones.remove,
  // ---- WIDGET ITEMS ----
  addItemToZone: items.add,
  existsItemInZone: items.exists,
  updateItemInZone: items.update,
  deleteItemInZone: items.remove,
  updateOrderItemsInZone: items.updateOrders,
  updateProfileItemsInZone: items.updateProfiles,
};
