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

    console.log('-- VAMOS A AÑADIR AL USUARIO ---');
    console.dir(ctx.request.body, { depth: null });

    // const { email, name, surnames, program, profile } = ctx.request.body;
    const { program, onlyStudent, enrollGroup, teachGroup, skipDefaults, ...userData } =
      ctx.request.body;

    const profiles = await academicService.settings.getProfiles();
    // const programs = await academicService.programs.listPrograms();
    const centers = await userService.centers.list(0, 100);

    const programsByCenter = await Promise.all(
      centers.items.map((center) => academicService.programs.listPrograms(0, 100, center.id))
    );

    const programs = programsByCenter
      .reduce((acc, cur) => acc.concat(cur.items), [])
      .filter((item) => program.toLowerCase().indexOf(item.abbreviation.toLowerCase()) > -1);

    // ···················································
    // PROGRAM

    const userProgram = programs[0]?.id;

    if (!userProgram) {
      throw new Error('El programa no existe');
    }

    // List all groups for the program
    const [{ items: groups }, { items: classes }] = await Promise.all([
      academicService.groups.listGroups(0, 99999, userProgram),
      academicService.classes.listClasses(0, 99999, userProgram),
    ]);

    const registerAsTeacher = !onlyStudent;
    const tags = ['Student', 'Test'];

    // -----------------------------------------------------
    // USER REGISTRATION

    console.log('registerAsTeacher:', registerAsTeacher);

    if (registerAsTeacher) {
      tags.push('Teacher');
    }

    const userToAdd = {
      users: [
        {
          ...userData,
          tags,
          gender: 'Male',
          birthdate: new Date(1980, 1, 1),
        },
      ],
      center: programs[0].centers[0],
    };

    // First register as a Student
    const [user] = await userService.users.addBulk(
      { ...userToAdd, profile: profiles.student },
      ctx
    );

    const rolesRequests = [
      userService.profiles.getRoleForRelationshipProfileCenter(
        profiles.student,
        programs[0].centers[0]
      ),
      userService.users.searchUserAgents({ user: { email: user.email } }),
    ];

    // Now add teacher profile and Role
    if (registerAsTeacher) {
      await userService.users.addBulk({ ...userToAdd, profile: profiles.teacher }, ctx);

      rolesRequests.push(
        userService.profiles.getRoleForRelationshipProfileCenter(
          profiles.teacher,
          programs[0].centers[0]
        )
      );
    }

    // Get profile roles for the center
    const [studentRole, userAgents, teacherRole] = await Promise.all(rolesRequests);

    // Search user agent for the user and profiles
    const studentUserAgent = _.find(userAgents, { role: studentRole.id }).id;

    // -----------------------------------------------------
    // CLASS CREATION

    const promises = [];
    const classeIds = [];

    if (registerAsTeacher) {
      const teacherUserAgent = _.find(userAgents, { role: teacherRole.id }).id;
      const groupToClone = teachGroup ?? (!skipDefaults ? groupToDuplicate : null);

      if (groupToClone) {
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
        const group = getByName(groupToClone);
        const finalName = getName(groupToClone);

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

        _.forIn(duplications.classes, (value) => {
          classeIds.push(value.id);
          promises.push(
            academicService.classes.addTeacher(value.id, teacherUserAgent, 'main-teacher')
          );
        });
      }
    }

    // -----------------------------------------------------
    // CLASS ENROLLMENT

    const addToGroup = enrollGroup ?? (!skipDefaults ? willyGroup : null);

    console.log('addToGroup:', addToGroup);

    if (addToGroup) {
      const addToClassIds = _.map(
        _.filter(
          classes,
          (c) =>
            c.groups?.name.trim() === addToGroup.trim() ||
            c.groups?.abbreviation.trim() === addToGroup.trim()
        ),
        'id'
      );

      classeIds.push(...addToClassIds);
      promises.push(
        academicService.classes.addStudentsToClasses({
          class: classeIds,
          students: [studentUserAgent],
        })
      );
    }

    // -----------------------------------------------------
    // FINISH

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
