const { uniq, uniqBy } = require('lodash');

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
    // const user = await userService.users.addBulk({ ...userToAdd, profile: profiles.student }, ctx);

    // Now add student profile
    // await userService.users.addBulk({ ...userToAdd, profile: profiles.teacher }, ctx);

    // -----------------------------------------------------
    // CLASS CREATION

    const userProgram = programs[0].id;
    const classes = await academicService.classes.listClasses(0, 100, userProgram);
    const groupsCodeByCourse = classes.items
      .map((classItem) => {
        if (Array.isArray(classItem.groups)) {
          return {
            course: classItem.courses.id,
            groups: classItem.groups.map((group) => ({
              id: group.id,
              abbreviation: group.abbreviation,
            })),
          };
        }

        return {
          course: classItem.courses.id,
          groups: { id: classItem.groups.id, abbreviation: classItem.groups.abbreviation },
        };
      })
      .reduce((acc, curr) => {
        if (!acc[curr.course]) {
          acc[curr.course] = [];
        }
        acc[curr.course] = uniqBy(acc[curr.course].concat(curr.groups), 'id');
        return acc;
      }, {});

    ctx.status = 200;
    ctx.body = { status: 200, groupsCodeByCourse, classes };
  } else {
    throw validator.error;
  }
}

module.exports = { add: addUser };
