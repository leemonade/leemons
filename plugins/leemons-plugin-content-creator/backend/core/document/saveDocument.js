/* eslint-disable no-param-reassign */
const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');
const { validateSaveDocument } = require('../../validations/forms');
const createDocument = require('./createDocument');
const updateDocument = require('./updateDocument');

async function saveDocument({ data: _data, ctx }) {
  const data = _.cloneDeep(_data);
  // Check is userSession is provided
  if (!ctx.meta.userSession)
    throw new LeemonsError(ctx, { message: 'User session is required (saveDocument)' });
  delete data.asset;
  validateSaveDocument(data);
  const { published } = data;

  const toSave = {
    asset: {
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      color: data.color,
      cover: data.cover,
      tags: data.tags,
      indexable: true,
      public: false,
    },
    role: 'content-creator',
    statement: data.introductoryText || '',
    subjects: _.map(data.subjects, (id) => ({
      subject: id,
      program: data.program,
    })),
    gradable: false,
    metadata: {},
  };

  let assignable = null;

  if (data.id) {
    delete toSave.role;
    assignable = await ctx.tx.call('assignables.assignables.updateAssignable', {
      assignable: { id: data.id, ...toSave },
    });
  } else {
    assignable = await ctx.tx.call('assignables.assignables.createAssignable', {
      assignable: toSave,
      published,
    });
  }

  let featuredImage = null;
  if (assignable.metadata.featuredImage) {
    if (data.featuredImage) {
      featuredImage = await ctx.tx.call('leebrary.assets.update', {
        data: {
          id: assignable.metadata.featuredImage,
          name: `Image content-creator - ${assignable.id}`,
          cover: data.featuredImage,
          description: '',
          indexable: false,
          public: true,
        },
        published,
      });
    } else {
      await ctx.tx.call('leebrary.assests.remove', { fileIds: assignable.metadata.featuredImage });
    }
  } else if (data.featuredImage) {
    featuredImage = await ctx.tx.call('leebrary.assests.add', {
      asset: {
        name: `Image content-creator - ${assignable.id}`,
        cover: data.featuredImage,
        description: '',
        indexable: false,
        public: true,
      },
      published,
    });
  }

  toSave.metadata.featuredImage = featuredImage?.id;
  assignable = await ctx.tx.call('assignables.assignables.updateAssignable', {
    assignable: { id: assignable.id, ...toSave },
    published,
  });

  const currentDocument = await ctx.tx.db.Documents.findOne({ assignable: assignable.id })
    .select(['id'])
    .lean();

  let document = null;
  const documentData = { content: data.content, assignable: assignable.id };
  if (currentDocument?.id) {
    document = await updateDocument({ documentId: currentDocument.id, data: documentData, ctx });
  } else {
    document = await createDocument({ data: documentData, ctx });
  }

  return document;
}

module.exports = saveDocument;
