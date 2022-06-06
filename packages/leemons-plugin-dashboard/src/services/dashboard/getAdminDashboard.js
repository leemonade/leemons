async function getAdminDashboard(config, { transacting } = {}) {
  const [academicPortfolio, instances, cpu, system, mem, memLayout, osInfo, currentLoad] =
    await Promise.all([
      leemons
        .getPlugin('academic-portfolio')
        .services.common.adminDashboard(config, { transacting }),
      leemons
        .getPlugin('assignables')
        .services.assignableInstances.adminDashboard(config, { transacting }),
      global.utils.systeminformation.cpu(),
      global.utils.systeminformation.system(),
      global.utils.systeminformation.mem(),
      global.utils.systeminformation.memLayout(),
      global.utils.systeminformation.osInfo(),
      global.utils.systeminformation.currentLoad(),
    ]);

  console.log(osInfo, currentLoad);

  return {
    academicPortfolio,
    instances: instances.instances,
  };
}

module.exports = { getAdminDashboard };
