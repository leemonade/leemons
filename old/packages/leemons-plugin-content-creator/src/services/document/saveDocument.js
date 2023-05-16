/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { validateSaveDocument } = require('../../validations/forms');
const createDocument = require('./createDocument');
const updateDocument = require('./updateDocument');

async function saveDocument(_data, { userSession, transacting: _transacting } = {}) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;
  return global.utils.withTransaction(
    async (transacting) => {
      const data = _.cloneDeep(_data);
      // Check is userSession is provided
      if (!userSession) throw new Error('User session is required (saveDocument)');
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
          public: true, // TODO Cambiar a false despues de la demo
        },
        role: 'content-creator',
        statement: data.introductoryText || '',
        subjects: _.map(data.subjects, ({ level, subject }) => ({
          level,
          subject,
          program: data.program,
        })),
        gradable: false,
        metadata: {},
      };

      let assignable = null;

      if (data.id) {
        delete toSave.role;
        assignable = await assignableService.updateAssignable(
          { id: data.id, ...toSave },
          {
            userSession,
            transacting,
          }
        );
      } else {
        assignable = await assignableService.createAssignable(toSave, {
          userSession,
          transacting,
          published,
        });
      }

      let featuredImage = null;
      if (assignable.metadata.featuredImage) {
        if (data.featuredImage) {
          featuredImage = await leemons.getPlugin('leebrary').services.assets.update(
            {
              id: assignable.metadata.featuredImage,
              name: `Image content-creator - ${assignable.id}`,
              cover: data.featuredImage,
              description: '',
              indexable: false,
              public: true,
            },
            {
              published,
              userSession,
              transacting,
            }
          );
        } else {
          await leemons
            .getPlugin('leebrary')
            .services.assets.remove(assignable.metadata.featuredImage, {
              userSession,
              transacting,
            });
        }
      } else if (data.featuredImage) {
        featuredImage = await leemons.getPlugin('leebrary').services.assets.add(
          {
            name: `Image content-creator - ${assignable.id}`,
            cover: data.featuredImage,
            description: '',
            indexable: false,
            public: true,
          },
          {
            published,
            userSession,
            transacting,
          }
        );
      }

      toSave.metadata.featuredImage = featuredImage?.id;
      assignable = await assignableService.updateAssignable(
        { id: assignable.id, ...toSave },
        {
          userSession,
          transacting,
          published,
        }
      );

      const currentDocument = await table.documents.findOne(
        { assignable: assignable.id },
        {
          columns: ['id'],
          transacting,
        }
      );

      let document = null;
      const documentData = { content: data.content, assignable: assignable.id };
      if (currentDocument?.id) {
        document = await updateDocument(currentDocument.id, documentData, { transacting });
      } else {
        document = await createDocument(documentData, { transacting });
      }

      return document;
    },
    table.documents,
    _transacting
  );
}

module.exports = saveDocument;
