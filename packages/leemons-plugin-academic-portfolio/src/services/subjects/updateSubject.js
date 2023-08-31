/* eslint-disable prefer-const */
const _ = require('lodash');
const { isArray } = require('lodash');
const { table } = require('../tables');
const { validateUpdateSubject } = require('../../validations/forms');
const { setSubjectCredits } = require('./setSubjectCredits');
const { setSubjectInternalId } = require('./setSubjectInternalId');
const { changeBySubject } = require('../classes/knowledge/changeBySubject');
const { setToAllClassesWithSubject } = require('../classes/course/setToAllClassesWithSubject');
const { classByIds } = require('../classes/classByIds');
const { getProgramCourses } = require('../programs/getProgramCourses');

async function processRoom({
  subject,
  color,
  transacting,
  assetImage,
  roomService,
  classe,
  assetIcon,
}) {
  const roomKey = leemons.plugin.prefixPN(`room.class.${classe.id}`);
  const roomExists = await roomService.exists(roomKey, { transacting });

  const roomData = {
    name: subject.name,
    bgColor: color,
    image: null,
    icon: null,
    transacting,
  };
  if (assetImage.cover) {
    roomData.image = assetImage.id;
  }
  if (classe.image?.cover) {
    roomData.image = classe.image.id;
  }
  if (assetIcon.cover) {
    roomData.icon = assetIcon.id;
  }
  if (roomExists) {
    return roomService.update(roomKey, roomData);
  }
  return roomService.add(roomKey, roomData);
}

async function updateSubject(data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateSubject(data, { transacting });
      let {
        id,
        course,
        credits,
        internalId,
        subjectType,
        knowledge,
        image,
        icon,
        color,
        ..._data
      } = data;

      let subject = await table.subjects.update({ id }, _data, { transacting });
      const promises = [];

      // ES: Añadimos el asset de la imagen
      const imageData = {
        indexable: true,
        public: true, // TODO Cambiar a false despues de hacer la demo
        name: subject.name,
      };
      const iconData = _.clone(imageData);
      if (image) imageData.cover = image;
      if (icon) iconData.cover = icon;
      const assetService = leemons.getPlugin('leebrary').services.assets;
      const [assetImage, assetIcon] = await Promise.all([
        assetService.update(
          { id: subject.image, ...imageData },
          {
            published: true,
            userSession,
            transacting,
          }
        ),
        assetService.update(
          { id: subject.icon, ...iconData },
          {
            published: true,
            userSession,
            transacting,
          }
        ),
      ]);
      subject = await table.subjects.update(
        { id: subject.id },
        {
          image: assetImage.id,
          icon: assetIcon.id,
        },
        { transacting }
      );

      await table.class.updateMany({ subject: subject.id }, { color }, { transacting });
      const classesWithSubject = await table.class.find(
        { subject: subject.id },
        { columns: ['id'], transacting }
      );
      const classes = await classByIds(_.map(classesWithSubject, 'id'), { transacting });
      const roomService = leemons.getPlugin('comunica').services.room;
      await Promise.allSettled(
        _.map(classes, (classe) =>
          processRoom({
            subject,
            color,
            transacting,
            assetImage,
            roomService,
            classe,
            assetIcon,
          })
        )
      );

      if (!course) {
        const programCourses = await getProgramCourses(subject.program, { transacting });
        course = programCourses[0].id;
      }
      const courses = isArray(course) ? course : [course];
      await setToAllClassesWithSubject(subject.id, courses, { transacting });

      if (!_.isUndefined(subjectType)) {
        promises.push(
          table.class.updateMany({ subject: subject.id }, { subjectType }, { transacting })
        );
      }

      if (!_.isUndefined(knowledge)) {
        promises.push(changeBySubject(subject.id, knowledge, { transacting }));
      }

      if (credits)
        promises.push(setSubjectCredits(subject.id, subject.program, credits, { transacting }));
      if (internalId)
        promises.push(
          setSubjectInternalId(subject.id, subject.program, internalId, {
            course: data.course,
            transacting,
          })
        );
      await Promise.all(promises);
      return subject;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { updateSubject };
