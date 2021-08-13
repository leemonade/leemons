const add = require('./add');

async function addMain() {
  return add(
    {
      key: 'classroom',
      iconSvg: '/classroom/classroom.svg',
      activeIconSvg: '/classroom/classroomActive.svg',
      label: {
        en: 'Classroom',
        es: 'Clases',
      },
    },
    [
      {
        permissionName: 'plugins.classroom.classroom',
        actionNames: ['view'],
      },
    ]
  );
}

module.exports = addMain;
