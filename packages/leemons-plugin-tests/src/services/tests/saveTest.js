/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { validateSaveTest } = require('../../validations/forms');

async function saveTest(data, { userSession, transacting: _transacting } = {}) {
  // const tagsService = leemons.getPlugin('common').services.tags;
  // const versionControlService = leemons.getPlugin('common').services.versionControl;
  return global.utils.withTransaction(
    async (transacting) => {
      validateSaveTest(data);
      const { assignables: assignableService, assignableInstances: assignableInstancesService } =
        leemons.getPlugin('assignables').services;

      const toSave = {
        asset: {
          name: data.name,
          tagline: data.tagline,
          description: data.description,
          color: data.color,
          cover: data.cover,
          tags: data.tags,
          indexable: true,
          public: true, // TODO Cambiar a false despues de la demo
        },
        role: 'tests',
        subjects: _.map(data.subjects, (subject) => ({ subject, program: data.program })),
        statement: data.statement,
        instructionsForTeachers: data.instructionsForTeachers,
        instructionsForStudents: data.instructionsForStudents,
        gradable: data.gradable || false,
        metadata: {
          questionBank: data.questionBank,
          filters: data.filters,
          questions: data.questions,
          type: data.type,
          level: data.level,
        },
      };

      let assignable = null;

      if (data.id) {
        delete toSave.role;
        assignable = await assignableService.updateAssignable(
          { id: data.id, ...toSave },
          {
            userSession,
            transacting,
            published: data.published,
          }
        );
      } else {
        assignable = await assignableService.createAssignable(toSave, {
          userSession,
          transacting,
          published: data.published,
        });
      }

      // TODO Eliminar cuando se integre la asignacion de test
      if (data.published) {
        const classService = leemons.getPlugin('academic-portfolio').services.classes;
        const classes = await classService.getBasicClassesByProgram(data.program, { transacting });

        const classStudents = await classService.student.getByClass(_.map(classes, 'id'), {
          transacting,
        });
        await assignableInstancesService.createAssignableInstance(
          {
            assignable: assignable.id,
            alwaysAvailable: false,
            duration: '20 minutes',
            messageToAssignees: '<p style="margin-left: 0px!important;">Pepe</p>',
            students: _.map(classStudents, 'student'),
            classes: _.map(classes, 'id'),
            curriculum: {
              content: true,
              objectives: true,
              assessmentCriteria: true,
            },
            dates: {
              start: '2022-05-11T22:00:00.000Z',
              deadline: '2022-05-19T22:00:00.000Z',
              visualization: '2022-05-11T22:00:00.000Z',
              close: '2022-05-26T22:00:00.000Z',
            },
            gradable: true,
            metadata: {
              questions: data.questions,
            },
          },
          { userSession, transacting }
        );
      }

      return assignable;
    },
    table.questionsBanks,
    _transacting
  );
}

module.exports = { saveTest };
