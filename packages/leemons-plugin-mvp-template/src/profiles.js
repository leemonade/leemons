const { isEmpty } = require('lodash');

const USER_PERMISSIONS = [
  {
    permissionName: 'plugins.users.user-data',
    actions: {
      admin: ['admin'],
      student: ['admin'],
      teacher: ['admin'],
    },
  },
  {
    permissionName: 'plugins.users.centers',
    actions: {
      admin: ['admin'],
      student: ['admin'],
      teacher: ['admin'],
    },
  },
  {
    permissionName: 'plugins.users.profiles',
    actions: {
      admin: ['admin'],
      student: ['admin'],
      teacher: ['admin'],
    },
  },
  {
    permissionName: 'plugins.users.users',
    actions: {
      admin: ['admin'],
      student: ['admin'],
      teacher: ['admin'],
    },
  },
];

const DATA_SET_PERMISSIONS = [
  {
    permissionName: 'plugins.dataset.dataset',
    actions: {
      admin: ['admin'],
      student: ['create'],
      teacher: ['create'],
    },
  },
];

const CALENDAR_PERMISSIONS = [
  {
    permissionName: 'plugins.calendar.calendar',
    actions: {
      admin: ['admin'],
      student: ['admin'],
      teacher: ['admin'],
    },
  },
];

const ACADEMIC_PORTFOLIO_PERMISSIONS = [
  {
    permissionName: 'plugins.academic-portfolio.portfolio',
    actions: {
      admin: ['admin'],
      student: ['admin'],
      teacher: ['admin'],
    },
  },
  {
    permissionName: 'plugins.academic-portfolio.programs',
    actions: {
      admin: ['admin'],
      student: ['admin'],
      teacher: ['admin'],
    },
  },
  {
    permissionName: 'plugins.academic-portfolio.profiles',
    actions: {
      admin: ['admin'],
      student: ['admin'],
      teacher: ['admin'],
    },
  },
  {
    permissionName: 'plugins.academic-portfolio.subjects',
    actions: {
      admin: ['admin'],
      student: ['admin'],
      teacher: ['admin'],
    },
  },
  {
    permissionName: 'plugins.academic-portfolio.tree',
    actions: {
      admin: ['admin'],
      student: ['admin'],
      teacher: ['admin'],
    },
  },
];

const PERMISSIONS = [
  ...USER_PERMISSIONS,
  ...DATA_SET_PERMISSIONS,
  ...CALENDAR_PERMISSIONS,
  ...ACADEMIC_PORTFOLIO_PERMISSIONS,
];

function getPermissions(rol) {
  return PERMISSIONS.map((permission) => ({
    ...permission,
    actions: permission.actions[rol],
  })).filter((permission) => !isEmpty(permission.actions));
}

async function initProfiles() {
  let result = null;

  try {
    const admin = await leemons.getPlugin('users').services.profiles.add({
      name: 'Admin',
      description: 'Profile for platform administrators',
      permissions: getPermissions('admin'),
    });

    const student = await leemons.getPlugin('users').services.profiles.add({
      name: 'Student',
      description: 'Profile for students',
      permissions: getPermissions('student'),
    });
    const teacher = await leemons.getPlugin('users').services.profiles.add({
      name: 'Teacher',
      description: 'Profile for teachers',
      permissions: getPermissions('teacher'),
    });
    const guardian = await leemons.getPlugin('users').services.profiles.add({
      name: 'Guardian',
      description: 'Profile for legal guardian of students',
      permissions: getPermissions('guardian'),
    });

    await leemons
      .getPlugin('users')
      .services.profiles.addProfileContact(admin.id, student.id, guardian.id, teacher.id);

    result = { admin, student, guardian, teacher };
  } catch (err) {
    console.error(err);
  }

  return result;
}

module.exports = initProfiles;
