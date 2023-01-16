const _ = require('lodash');

const groupToDuplicate = 'G001';
const willyGroup = 'L001';

function getNextGroupName(name) {
  const split = name.split('G');
  const start = split[0];
  const digits = split[1];
  const n = parseInt(digits, 10);
  return `${start}G${_.padStart((n + 1).toString(), digits.length, '0')}`;
}

async function addUser(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      email: { type: 'string' },
      name: { type: 'string' },
      surnames: { type: 'string' },
      program: { type: 'string' },
    },
    required: ['email', 'name', 'surnames', 'program'],
    additionalProperties: true,
  });
  if (validator.validate(ctx.request.body)) {
    const { services: userService } = leemons.getPlugin('users');
    const { services: academicService } = leemons.getPlugin('academic-portfolio');

    // const { email, name, surnames, program, profile } = ctx.request.body;
    const { program, ...userData } = ctx.request.body;

    const profiles = await academicService.settings.getProfiles();
    // const programs = await academicService.programs.listPrograms();
    const centers = await userService.centers.list(0, 100);

    const programsByCenter = await Promise.all(
      centers.items.map((center) => academicService.programs.listPrograms(0, 100, center.id))
    );

    const programs = programsByCenter
      .reduce((acc, cur) => acc.concat(cur.items), [])
      .filter((item) => program.toLowerCase().indexOf(item.abbreviation.toLowerCase()) > -1);

    // ··················
    // Program

    const userToAdd = {
      users: [
        {
          ...userData,
          tags: ['Student', 'Teacher', 'Test'],
          gender: 'Male',
          birthdate: new Date(1980, 1, 1),
        },
      ],
      center: programs[0].centers[0],
    };

    // -----------------------------------------------------
    // USER REGISTRATION

    // First register as a teacher
    const [user] = await userService.users.addBulk(
      { ...userToAdd, profile: profiles.student },
      ctx
    );

    // Now add student profile
    await userService.users.addBulk({ ...userToAdd, profile: profiles.teacher }, ctx);

    // Get profile roles for the center
    const [studentRole, teacherRole, userAgents] = await Promise.all([
      userService.profiles.getRoleForRelationshipProfileCenter(
        profiles.student,
        programs[0].centers[0]
      ),
      userService.profiles.getRoleForRelationshipProfileCenter(
        profiles.teacher,
        programs[0].centers[0]
      ),
      userService.users.searchUserAgents({ user: { email: user.email } }),
    ]);

    // Search user agent for the user and profiles
    const studentUserAgent = _.find(userAgents, { role: studentRole.id }).id;
    const teacherUserAgent = _.find(userAgents, { role: teacherRole.id }).id;

    // -----------------------------------------------------
    // CLASS CREATION

    const userProgram = programs[0].id;

    // List all groups for the program
    const [{ items: groups }, { items: classes }] = await Promise.all([
      academicService.groups.listGroups(0, 99999, userProgram),
      academicService.classes.listClasses(0, 99999, userProgram),
    ]);

    const willyClassIds = _.map(
      _.filter(
        classes,
        (c) =>
          c.groups?.name.trim() === willyGroup.trim() ||
          c.groups?.abbreviation.trim() === willyGroup.trim()
      ),
      'id'
    );

    // eslint-disable-next-line no-inner-declarations
    function getByName(name) {
      return _.find(
        groups,
        (g) => g.name.trim() === name.trim() || g.abbreviation.trim() === name.trim()
      );
    }

    // eslint-disable-next-line no-inner-declarations
    function getName(name) {
      const g = getByName(name);
      if (g) {
        return getName(getNextGroupName(name));
      }
      return name;
    }

    // Search the group to clone
    const group = getByName(groupToDuplicate);
    const finalName = getName(groupToDuplicate);

    // Clone the group
    const duplications = await academicService.groups.duplicateGroup(
      {
        id: group.id,
        name: finalName,
        abbreviation: finalName,
        students: true,
        teachers: false,
      },
      { userSession: ctx.state.userSession }
    );

    const promises = [];
    const classeIds = [...willyClassIds];
    _.forIn(duplications.classes, (value) => {
      classeIds.push(value.id);
      promises.push(academicService.classes.addTeacher(value.id, teacherUserAgent, 'main-teacher'));
    });

    promises.push(
      academicService.classes.addStudentsToClasses({
        class: classeIds,
        students: [studentUserAgent],
      })
    );

    await Promise.all(promises);

    ctx.status = 200;
    ctx.body = { status: 200 };
  } else {
    throw validator.error;
  }
}

const initSuper = async (ctx) => {
  if (process.env.NODE_ENV !== 'production') {
    const { services } = leemons.getPlugin('admin');
    try {
      await services.settings.setLanguages({ code: 'es', name: 'Español' }, 'es');
      await services.settings.registerAdmin({
        name: 'Super',
        surnames: 'Admin',
        gender: 'male',
        birthdate: new Date(),
        email: 'super@leemons.io',
        password: 'testing',
        locale: 'es',
      });
      await services.settings.update({ status: 'INSTALLED', configured: true });

      ctx.status = 200;
      ctx.body = { status: 200 };
    } catch (e) {
      ctx.status = 500;
      ctx.body = { status: 500, error: e.message };
    }
  } else {
    ctx.status = 401;
    ctx.body = { status: 401, error: 'Endpoint disabled' };
  }
};

module.exports = { add: addUser, initSuper };
