const _ = require('lodash');
const systeminformation = require('systeminformation');
async function getAdminDashboardRealtime() {
  const [currentLoad, mem, networkInterfaces, networkInterfaceDefault] = await Promise.all([
    systeminformation.currentLoad(),
    systeminformation.mem(),
    systeminformation.networkInterfaces(),
    systeminformation.networkInterfaceDefault(),
  ]);

  return {
    currentLoad,
    mem,
    networkInterfaces,
    networkInterface: _.find(networkInterfaces, { iface: networkInterfaceDefault }),
  };
}

module.exports = { getAdminDashboardRealtime };
