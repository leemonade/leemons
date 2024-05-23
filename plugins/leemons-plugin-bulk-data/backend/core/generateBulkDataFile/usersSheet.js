const { cloneDeep } = require('lodash');
const { styleCell } = require('./helpers');
const {
  ADMIN_BULK_ID,
  SUPER_ADMIN_BULK_ID,
  AUTO_PASSWORD,
  ADMIN_EMAIL,
  SUPER_ADMIN_EMAIL,
} = require('./config/constants');

async function addNotAdministrativeUsers({ worksheet, centers, ctx }) {
  const { data: usersData } = await ctx.call('users.users.listRest', {
    page: 0,
    size: 9999,
  });

  const userAgents = await ctx.call('users.users.getUserAgentsInfo', {
    userAgentIds: usersData.userAgents.map((agent) => agent.id),
    withCenter: true,
    withProfile: true,
  });
  const users = usersData.items.map((user) => ({
    ...user,
    userAgents: userAgents.filter((agent) => agent.user.id === user.id),
  }));
  const usersToReturn = [];
  const profileCounts = {};

  users.forEach((user) => {
    let mainProfile;
    const userProfiles = user.userAgents.map((agent) => {
      const profileSysName = agent.profile.sysName;
      if (!mainProfile) mainProfile = profileSysName; // Assume the first profile is the main one
      const centerBulkId = centers.find((center) => center.id === agent.center.id).bulkId;
      return `${profileSysName}@${centerBulkId}`;
    });

    if (!profileCounts[mainProfile]) {
      profileCounts[mainProfile] = 1;
    } else {
      profileCounts[mainProfile]++;
    }

    const profileCount = profileCounts[mainProfile].toString().padStart(2, '0');
    const bulkId = `${mainProfile}${profileCount}`;
    const rowObject = {
      root: bulkId,
      name: user.name,
      surnames: user.surnames,
      gender: user.gender,
      birthdate: user.birthdate,
      email: user.email,
      password: AUTO_PASSWORD,
      locale: user.locale,
      avatar: undefined, // TODO: get an image that can actually be used
      tags: user.tags.join(', '),
      profiles: userProfiles.join(', '),
    };

    usersToReturn.push({
      id: user.id,
      avatar: undefined, // todo aquí también va el avatar resuelto
      name: user.name,
      surnames: user.surnames,
      bulkId,
      userAgents: cloneDeep(user.userAgents),
    });
    worksheet.addRow(rowObject);
  });
  return usersToReturn;
}

async function createUsersSheet({ workbook, centers, admin, superAdmin, predefinedUsers, ctx }) {
  const worksheet = workbook.addWorksheet('users');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 30 },
    { header: 'name', key: 'name', width: 30 },
    { header: 'surnames', key: 'surnames', width: 30 },
    { header: 'gender', key: 'gender', width: 30 },
    { header: 'birthdate', key: 'birthdate', width: 30 },
    { header: 'email', key: 'email', width: 30 },
    { header: 'password', key: 'password', width: 30 },
    { header: 'locale', key: 'locale', width: 30 },
    { header: 'avatar', key: 'avatar', width: 50 },
    { header: 'tags', key: 'tags', width: 30 },
    { header: 'profiles', key: 'profiles', width: 50 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'BulkID',
    name: 'Name',
    surnames: 'Surnames',
    gender: 'Gender',
    birthdate: 'Birthdate',
    email: 'Email',
    password: 'Password',
    locale: 'Locale',
    avatar: 'Picture',
    tags: 'Tags',
    profiles: 'Profiles',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  let users;
  if (!predefinedUsers?.length) {
    users = await addNotAdministrativeUsers({ worksheet, centers, ctx });
  }

  if (admin) {
    const adminRow = {
      root: ADMIN_BULK_ID,
      name: admin.name ?? 'admin',
      surnames: admin.surname ?? 'Leemons',
      gender: admin.surname ?? 'Female',
      birthdate: new Date('1993-01-01'),
      email: admin.email ?? ADMIN_EMAIL,
      password: admin.password ?? AUTO_PASSWORD,
      locale: admin.locale ?? 'es',
      tags: 'Admin',
      profiles: centers.map((center) => `admin@${center.bulkId}`).join(', '),
    };
    worksheet.addRow(adminRow);
  }

  if (superAdmin) {
    const superAdminRow = {
      root: SUPER_ADMIN_BULK_ID,
      name: superAdmin.name ?? 'superAdmin',
      surnames: superAdmin.surname ?? 'Leemons',
      gender: superAdmin.gender ?? 'Female',
      birthdate: new Date('1990-01-01'),
      email: superAdmin.email ?? SUPER_ADMIN_EMAIL,
      password: superAdmin.password ?? AUTO_PASSWORD,
      locale: superAdmin.locale ?? 'en',
      profiles: 'super',
    };
    worksheet.addRow(superAdminRow);
  }
  return users;
}

module.exports = {
  createUsersSheet,
};
