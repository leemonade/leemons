/* eslint-disable prefer-const */
const _ = require('lodash');
const { isArray } = require('lodash');
const { validateUpdateSubject } = require('../../validations/forms');
const { setSubjectCredits } = require('./setSubjectCredits');
const { setSubjectInternalId } = require('./setSubjectInternalId');
const { changeBySubject } = require('../classes/knowledge/changeBySubject');
const { setToAllClassesWithSubject } = require('../classes/course/setToAllClassesWithSubject');
const { classByIds } = require('../classes/classByIds');
const { getProgramCourses } = require('../programs/getProgramCourses');

async function processRoom({ subject, color, assetImage, classe, assetIcon, ctx }) {
  const roomKey = ctx.prefixPN(`room.class.${classe.id}`);

  const roomExists = await ctx.tx.call('comunica.room.exists', { key: roomKey });

  const roomData = {
    name: subject.name,
    bgColor: color,
    image: null,
    icon: null,
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
    return ctx.tx.call('comunica.room.update', { key: roomKey, ...roomData });
  }
  return ctx.tx.call('comunica.room.add', { key: roomKey, ...roomData });
}

async function updateSubject({ data, ctx }) {
  await validateUpdateSubject({ data, ctx });
  let { id, course, credits, internalId, subjectType, knowledge, image, icon, color, ..._data } =
    data;

  let subject = await ctx.tx.db.Subjects.findOneAndUpdate({ id }, _data, { new: true });
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

  const [assetImage, assetIcon] = await Promise.all([
    ctx.tx.call('leebrary.assets.update', {
      data: { id: subject.image, ...imageData },
      published: true,
    }),
    ctx.tx.call('leebrary.assets.update', {
      data: { id: subject.icon, ...iconData },
      published: true,
    }),
  ]);
  subject = await ctx.tx.db.Subjects.findOneAndUpdate(
    { id: subject.id },
    {
      image: assetImage.id,
      icon: assetIcon.id,
    },
    { new: true }
  );

  await ctx.tx.db.Class.updateMany({ subject: subject.id }, { color });
  const classesWithSubject = await ctx.tx.db.Class.find({ subject: subject.id })
    .select(['id'])
    .lean();
  const classes = await classByIds({ ids: _.map(classesWithSubject, 'id'), ctx });

  await Promise.allSettled(
    _.map(classes, (classe) =>
      processRoom({
        subject,
        color,
        assetImage,
        classe,
        assetIcon,
        ctx,
      })
    )
  );

  if (!course) {
    const programCourses = await getProgramCourses({ ids: subject.program, ctx });
    course = programCourses[0].id;
  }
  const courses = isArray(course) ? course : [course];
  await setToAllClassesWithSubject({ subject: subject.id, course: courses, ctx });

  if (!_.isUndefined(subjectType)) {
    promises.push(ctx.tx.db.Class.updateMany({ subject: subject.id }, { subjectType }));
  }

  if (!_.isUndefined(knowledge)) {
    promises.push(changeBySubject({ subjectId: subject.id, knowledge, ctx }));
  }

  if (credits)
    promises.push(
      setSubjectCredits({ subject: subject.id, program: subject.program, credits, ctx })
    );
  if (internalId)
    promises.push(
      setSubjectInternalId({
        subject: subject.id,
        program: subject.program,
        internalId,
        course: data.course,
        ctx,
      })
    );
  await Promise.all(promises);
  return subject;
}

module.exports = { updateSubject };
