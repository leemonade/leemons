const _ = require('lodash');
const { isArray } = require('lodash');
const { table } = require('../tables');
const { validateUpdateSubject } = require('../../validations/forms');
const { setSubjectCredits } = require('./setSubjectCredits');
const { setSubjectInternalId } = require('./setSubjectInternalId');
const { changeBySubject } = require('../classes/knowledge/changeBySubject');
const { setToAllClassesWithSubject } = require('../classes/course/setToAllClassesWithSubject');
const { classRoomImagePermissions } = require('../classes/classRoomImagePermissions');

async function updateSubject(data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateSubject(data, { transacting });
      const {
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
      const roomService = leemons.getPlugin('comunica').services.room;
      await Promise.all(
        _.map(classesWithSubject, (item) =>
          roomService.update(leemons.plugin.prefixPN(`room.class.${item.id}`), {
            name: subject.name,
            image,
            icon,
            iconPermissions: classRoomImagePermissions,
            bgColor: color,
            imagePermissions: classRoomImagePermissions,
            userSession,
            transacting,
          })
        )
      );

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
