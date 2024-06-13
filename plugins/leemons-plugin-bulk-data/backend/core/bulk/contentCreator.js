const { keys, trim, isEmpty, isNil, toLower, pick, omit } = require('lodash');
const mime = require('mime');
const itemsImport = require('./helpers/simpleListImport');

// EN: This function is based on: @leebrary/helpers/prepareAsset
// EN: Esta función está basada en: @leebrary/helpers/prepareAsset
function getFileUrl(fileID) {
  return `/api/leebrary/file/${fileID}`;
}

function scapeHTML(value) {
  if (typeof value === 'string') {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&quot;');
  }

  return value;
}

async function newAssetForTextEditor({ props, userSession, ctx }) {
  const duplicatedAsset = await ctx.call(
    'leebrary.assets.duplicate',
    { assetId: props.id, preserveName: true, indexable: false, public: true },
    { meta: { userSession } }
  );

  if (duplicatedAsset.file?.id) {
    duplicatedAsset.url = getFileUrl(duplicatedAsset.file.id);
  }
  if (duplicatedAsset.cover?.id) {
    duplicatedAsset.cover = getFileUrl(duplicatedAsset.cover.id);
  }

  return {
    ...props,
    url: duplicatedAsset.url || duplicatedAsset.cover,
    cover: duplicatedAsset.cover,
    id: duplicatedAsset.id,
    processed: true,
  };
}

async function parseContent({ htmlString, assets, userSession, ctx }) {
  if (isEmpty(htmlString)) {
    return null;
  }

  let finalContent = htmlString;
  const regex = /<library.*?bulkId=['"]([^'"]+)['"].*?<\/library>/g;
  let match;
  const duplicatedAssets = {};

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(htmlString)) !== null) {
    const [fullMatch, bulkId] = match;

    let assetInfo;
    if (duplicatedAssets[bulkId]) {
      assetInfo = duplicatedAssets[bulkId];
    } else {
      const props = assets[bulkId];

      if (!props) {
        throw new Error(`Invalid asset bulk id (${bulkId}) provided`);
      }

      // eslint-disable-next-line no-await-in-loop
      assetInfo = await newAssetForTextEditor({ props, userSession, ctx });
      duplicatedAssets[bulkId] = assetInfo;
    }

    const assetText = `<library ${Object.entries(
      pick(
        assetInfo,
        [
          'id',
          'url',
          'cover',
          'name',
          'filetype',
          'tags',
          'description',
          'width',
          'align',
          'display',
        ].filter(Boolean)
      )
    )
      .map(
        ([key, value]) =>
          `${key}="${scapeHTML(typeof value === 'object' ? JSON.stringify(value) : value)}"`
      )
      .join(' ')}></library>`;

    finalContent = finalContent.replace(fullMatch, assetText);
  }

  return finalContent;
}

function booleanCheck(value) {
  if (toLower(value) === 'no') {
    return false;
  }
  if (toLower(value) === 'yes') {
    return true;
  }
  return value;
}

async function importContentCreatorDocuments({ file, users, programs, assets, ctx }) {
  const items = await itemsImport(file, 'content_creator', 50);

  await Promise.all(
    keys(items)
      .filter((key) => !isNil(key) && !isEmpty(key))
      .map(async (key) => {
        const document = items[key];

        const program = programs[document.program];
        if (program) {
          document.program = program.id;
          document.subjects = (document.subjects || '')
            ?.split(',')
            .map((val) => trim(val))
            .filter((val) => !isEmpty(val))
            .map((subject) => program.subjects[subject]?.id);
        }

        document.resources = (document.resources || '')
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((val) => assets && assets[val]?.id)
          .filter(Boolean);

        document.tags = (document.tags || '')
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val));

        document.cover = (document.cover || '').startsWith('http') ? document.cover : null;

        if (!document.cover) {
          const matchedAsset = assets[document.cover]?.id;
          if (matchedAsset?.file?.id) {
            document.cover = matchedAsset.file.id;
          }
        }

        const creator = users[document.creator];
        const content = await parseContent({
          htmlString: document.htmlContent,
          assets,
          userSession: creator,
          ctx,
        });
        delete document.htmlContent;

        items[key] = {
          name: document.name,
          description: document.description || null,
          tags: document.tags || [],
          color: document.color || null,
          cover: document.cover,
          subjects: document.subjects,
          content,
          creator,
          published: document.published,
        };
      })
  );

  return items;
}

/*
{
  "content": "<p style=\"margin-left: 0px!important;\">Test con link </p><library id=\"lrn:local:common:local:66391118febb6b7190c3a406:CurrentVersions:666ad88777f8008531da5458@1.0.0\" name=\"Eclipse\" filetype=\"image\" metadata=\"[{&quot;value&quot;:&quot;22.7 KB&quot;,&quot;label&quot;:&quot;Size&quot;},{&quot;value&quot;:&quot;JPEG&quot;,&quot;label&quot;:&quot;Format&quot;},{&quot;value&quot;:&quot;800&quot;,&quot;label&quot;:&quot;Width&quot;},{&quot;value&quot;:&quot;450&quot;,&quot;label&quot;:&quot;Height&quot;}]\" tags=\"[]\" cover=\"https://s3.eu-west-1.amazonaws.com/plugins.media-library.leemons.io/leemons/66391118febb6b7190c3a406/leebrary/lrn%3Alocal%3Aleebrary%3Alocal%3A66391118febb6b7190c3a406%3AFiles%3A666ad88777f8008531da5465.jpeg?AWSAccessKeyId=AKIA5YLEB7KFPBJL447L&Expires=1718364680&Signature=RZP4DB%2Fh1pGH1FF%2FyYpmOCzzeKo%3D&response-content-disposition=attachment%3B%20filename%3D%22lrn%3Alocal%3Aleebrary%3Alocal%3A66391118febb6b7190c3a406%3AFiles%3A666ad88777f8008531da5465.jpeg%22\" url=\"https://s3.eu-west-1.amazonaws.com/plugins.media-library.leemons.io/leemons/66391118febb6b7190c3a406/leebrary/lrn%3Alocal%3Aleebrary%3Alocal%3A66391118febb6b7190c3a406%3AFiles%3A666ad88777f8008531da5465.jpeg?AWSAccessKeyId=AKIA5YLEB7KFPBJL447L&Expires=1718364680&Signature=RZP4DB%2Fh1pGH1FF%2FyYpmOCzzeKo%3D&response-content-disposition=attachment%3B%20filename%3D%22lrn%3Alocal%3Aleebrary%3Alocal%3A66391118febb6b7190c3a406%3AFiles%3A666ad88777f8008531da5465.jpeg%22\" fileextension=\"jpeg\" fileid=\"lrn:local:leebrary:local:66391118febb6b7190c3a406:Files:666ad88777f8008531da5465\" coverid=\"lrn:local:leebrary:local:66391118febb6b7190c3a406:Files:666ad88777f8008531da5465\" width=\"100%\" display=\"embed\" align=\"left\" isfloating=\"false\" processed=true></library><p style=\"margin-left: 0px!important;\"></p>",
  "name": "Test con link ",
  "description": "asdfasdf dsa s dfasd asdf asdf",
  "cover": "lrn:local:leebrary:local:66391118febb6b7190c3a406:Files:666ad84877f8008531da5439",
  "subjects": [
    "lrn:local:academic-portfolio:local:66391118febb6b7190c3a406:Subjects:6639407da59c03338f8b11fa"
  ],
  "color": "#51347F",
  "program": "lrn:local:academic-portfolio:local:66391118febb6b7190c3a406:Programs:663919ec32ebc94330a9ae9f",
  "tags": [
    "Casos"
  ],
  "published": true
}
*/

module.exports = importContentCreatorDocuments;
