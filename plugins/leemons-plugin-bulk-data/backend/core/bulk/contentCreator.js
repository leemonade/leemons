const { keys, trim, isEmpty, isNil } = require('lodash');
const chalk = require('chalk');

const itemsImport = require('./helpers/simpleListImport');

function parseAttributes(attributesString) {
  const attributes = {};
  attributesString.replace(/(\w+)=["']([^"']*)["']/g, (match, key, value) => {
    attributes[key] = value;
    return '';
  });
  return attributes;
}

async function newAssetForTextEditor({ props, userSession, ctx }) {
  const duplicatedAsset = await ctx.call(
    'leebrary.assets.duplicate',
    { assetId: props.id, preserveName: true, indexable: false, public: true },
    { meta: { userSession } }
  );

  const [assetDetail] = await ctx.call('leebrary.assets.getByIds', {
    ids: [duplicatedAsset.id],
    withFiles: true,
    shouldPrepareAssets: true,
  });

  return {
    id: assetDetail.id,
    cover: assetDetail.cover,
    url: assetDetail.url || assetDetail.cover,
    fileid: assetDetail.file?.id,
    coverid: duplicatedAsset.cover?.id,
  };
}

async function parseContent({
  htmlString,
  assets,
  nonIndexableAssets: _nonIndexableAssets,
  userSession,
  ctx,
}) {
  if (isEmpty(htmlString)) {
    return null;
  }
  const nonIndexableAssets = _nonIndexableAssets || {};

  let finalContent = htmlString;
  const regex = /<library ([^>]*?)bulkId=['"]([^'"]+)['"]([^>]*?)><\/library>/g;
  let match;
  const duplicatedAssets = {};

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(htmlString)) !== null) {
    const [fullMatch, preBulkIdAttributes, bulkId, postBulkIdAttributes] = match;

    let assetInfo;
    if (duplicatedAssets[bulkId]) {
      assetInfo = duplicatedAssets[bulkId];
    } else {
      const props = assets[bulkId] ?? nonIndexableAssets[bulkId];
      if (props) {
        // eslint-disable-next-line no-await-in-loop
        assetInfo = await newAssetForTextEditor({ props, userSession, ctx });
        duplicatedAssets[bulkId] = assetInfo;
      } else {
        assetInfo = null;
        ctx.logger.info(chalk`{yellow.bold WARN} Could not find asset with bulkId: ${bulkId}`);
      }
    }

    if (assetInfo) {
      const attributesString = preBulkIdAttributes + postBulkIdAttributes;
      const attributesObject = parseAttributes(attributesString);

      attributesObject.id = assetInfo.id;
      attributesObject.cover = assetInfo.cover;
      attributesObject.url = assetInfo.url;
      attributesObject.fileid = assetInfo.fileid;
      attributesObject.coverid = assetInfo.coverid;

      const updatedAttributes = Object.entries(attributesObject)
        .map(([key, value]) => `${key}="${value ?? ''}"`)
        .join(' ');

      const assetText = `<library ${updatedAttributes}></library>`;
      finalContent = finalContent.replace(fullMatch, assetText);
    } else {
      finalContent = finalContent.replace(fullMatch, '');
    }
  }

  return finalContent;
}

async function importContentCreatorDocuments({ file, config, ctx }) {
  const { users, programs, assets, nonIndexableAssets } = config;
  const items = await itemsImport(file, 'content_creator', 50);

  await Promise.all(
    keys(items)
      .filter((key) => !isNil(key) && !isEmpty(key))
      .map(async (key) => {
        const document = items[key];

        // BASIC DATA

        const { name, description = null, color = null, published, hideInLibrary } = document;

        const tags = (document.tags || '')
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val));

        let { cover } = document;
        if (cover && !cover.startsWith('http')) {
          const matchedAsset = assets[cover];
          if (matchedAsset?.cover?.id) {
            cover = matchedAsset.cover.id;
          } else {
            cover = null;
          }
        }

        // SUBJECTS TAG

        const { program: programBulkId } = document;
        let { subjects } = document;
        const program = programs[programBulkId];
        if (program) {
          subjects = (subjects || '')
            ?.split(',')
            .map((val) => trim(val))
            .filter((val) => !isEmpty(val))
            .map((subject) => program.subjects[subject]?.id);
        }

        // DOCUMENT CONTENT

        const creator = users[document.creator];
        const content = await parseContent({
          htmlString: document.htmlContent,
          assets,
          nonIndexableAssets,
          userSession: creator,
          ctx,
        });

        // FINAL ITEM
        items[key] = {
          name,
          description,
          color,
          published,
          program: program?.id || null,
          subjects,
          cover,
          tags,
          content,
          creator,
          hideInLibrary,
        };
      })
  );

  return items;
}

module.exports = importContentCreatorDocuments;
