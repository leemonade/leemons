const _ = require('lodash');

async function getAdminDashboardRealtime({ transacting } = {}) {
  const [currentLoad, mem, networkInterfaces, networkInterfaceDefault] = await Promise.all([
    global.utils.systeminformation.currentLoad(),
    global.utils.systeminformation.mem(),
    global.utils.systeminformation.networkInterfaces(),
    global.utils.systeminformation.networkInterfaceDefault(),
  ]);

  return {
    currentLoad,
    mem,
    networkInterfaces,
    networkInterface: _.find(networkInterfaces, { iface: networkInterfaceDefault }),
  };
}

module.exports = { getAdminDashboardRealtime };
