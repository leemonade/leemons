const _ = require('lodash');

async function getAdminDashboard(config, { userSession, transacting } = {}) {
  if (config.center && config.center !== 'undefined') {
    return {
      academicPortfolio: await leemons
        .getPlugin('academic-portfolio')
        .services.common.adminDashboard(config, { userSession, transacting }),
    };
  }
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
    leemons
      .getPlugin('academic-portfolio')
      .services.common.adminDashboard(config, { userSession, transacting }),
    leemons
      .getPlugin('assignables')
      .services.assignableInstances.adminDashboard(config, { userSession, transacting }),
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
