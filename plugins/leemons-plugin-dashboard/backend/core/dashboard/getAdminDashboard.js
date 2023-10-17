const _ = require('lodash');
const systeminformation = require('systeminformation');

async function getAdminDashboard({ config, ctx }) {
  const { userSession } = ctx.meta;
  if (config.center && config.center !== 'undefined') {
    return {
      academicPortfolio: await ctx.tx.call('academic-portfolio.common.adminDashboard', { config }),
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
    ctx.tx.call('academic-portfolio.common.adminDashboard', { config }),
    ctx.tx.call('assignables.assignableInstances.adminDashboard', { config }),
    systeminformation.cpu(),
    systeminformation.mem(),
    systeminformation.memLayout(),
    systeminformation.currentLoad(),
    systeminformation.diskLayout(),
    systeminformation.fsSize(),
    systeminformation.networkInterfaces(),
    systeminformation.networkInterfaceDefault(),
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
