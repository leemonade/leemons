const _ = require('lodash');

async function getAdminDashboard(config, { transacting } = {}) {
  const [
    academicPortfolio,
    instances,
    cpu,
    mem,
    memLayout,
    currentLoad,
    diskLayout,
    fsSize,
    networkInterfaces,
    networkInterfaceDefault,
  ] = await Promise.all([
    leemons.getPlugin('academic-portfolio').services.common.adminDashboard(config, { transacting }),
    leemons
      .getPlugin('assignables')
      .services.assignableInstances.adminDashboard(config, { transacting }),
    global.utils.systeminformation.cpu(),
    global.utils.systeminformation.mem(),
    global.utils.systeminformation.memLayout(),
    global.utils.systeminformation.currentLoad(),
    global.utils.systeminformation.diskLayout(),
    global.utils.systeminformation.fsSize(),
    global.utils.systeminformation.networkInterfaces(),
    global.utils.systeminformation.networkInterfaceDefault(),
  ]);

  return {
    academicPortfolio,
    instances: instances.instances,
    pc: {
      cpu,
      mem,
      memLayout,
      currentLoad,
      diskLayout,
      fsSize,
      networkInterfaces,
      networkInterface: _.find(networkInterfaces, { iface: networkInterfaceDefault }),
    },
  };
}

module.exports = { getAdminDashboard };
