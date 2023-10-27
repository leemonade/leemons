const { keys, trim, isEmpty, isNil, toLower, pick } = require('lodash');
const showdown = require('showdown');
const mime = require('mime');
const itemsImport = require('./helpers/simpleListImport');

const converter = new showdown.Converter();

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

async function newAssetForTextEditor(props, { userSession }) {
  const { services } = leemons.getPlugin('leebrary');

  const duplicatedAsset = await services.assets.duplicate(props.id, {
    preserveName: true,
    indexable: false,
    public: true,
    userSession,
  });

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

async function parseDevelopment({ task, assets, userSession }) {
  if (isEmpty(task.development)) {
    return null;
  }

  const developmentArray = task.development.split('\n[---]\n');

  const parsedMarkdownArray = developmentArray
    // EN: Unescape the separator.
    // ES: Eliminar escapado del separador.
    .map((development) => development.replace(/\\\[---\]/g, '[---]'))
    // EN: Move assets to new line (<p> tag)
    // ES: Mover assets a nueva línea (etiqueta <p>)
    .map((development) => development.replace(/(\[asset.*?\])/g, '\n<p>$1</p>\n'));

  const htmlArray = parsedMarkdownArray.map((development) => converter.makeHtml(development));

  const finalArray = await Promise.all(
    htmlArray.map(async (development) => {
      const regex = /<p>(\[asset.*?\])<\/p>/g;
      let match;
      let finalDevelopment = development;
      const duplicatedAssets = {};

      // eslint-disable-next-line no-cond-assign
      while ((match = regex.exec(development)) !== null) {
        const [paragraph, asset] = match;

        const componentInfo = Object.fromEntries(
          asset
            .substring(1, asset.length - 1)
            .split(',')
            .map((prop) => prop.split(':').map((s) => s.trim()))
        );

        let assetInfo;
        if (duplicatedAssets[componentInfo.asset]) {
          assetInfo = duplicatedAssets[componentInfo.asset];
        } else {
          const props = assets[componentInfo.asset];

          if (!props) {
            throw new Error(`Invalid asset id (${componentInfo.asset}) provided`);
          }

          // eslint-disable-next-line no-await-in-loop
          assetInfo = await newAssetForTextEditor(props, { userSession });

          duplicatedAssets[componentInfo.asset] = assetInfo;
        }

        const fullAssetinfo = {
          ...componentInfo,
          ...assetInfo,
          filetype: assetInfo.file?.type.replace(/\/.*/, ''),
        };

        const assetText = `<library ${Object.entries(
          pick(
            fullAssetinfo,
            [
              'id',
              'color',
              'name',
              'metadata',
              'cover',
              'url',
              'width',
              'display',
              'align',
              'tags',
              'filetype',
              !isEmpty(fullAssetinfo.tagline) && 'tagline',
              !isEmpty(fullAssetinfo.description) && 'description',
            ].filter(Boolean)
          )
        )
          .map(
            ([key, value]) =>
              `${key}="${scapeHTML(typeof value === 'object' ? JSON.stringify(value) : value)}"`
          )
          .join('\n')}></library>`;

        finalDevelopment = finalDevelopment.replace(paragraph, assetText);
      }

      return finalDevelopment || development;
    })
  );

  return finalArray.map((development) => ({ development }));
}

function getDataType(extensions) {
  return extensions.reduce((values, extension) => {
    const type = mime.getType(extension);
    const ext = mime.getExtension(extension);

    if (type) {
      return {
        ...values,
        [extension]: type,
      };
    }
    if (ext) {
      return {
        ...values,
        [extension]: extension,
      };
    }

    return {
      ...values,
      [extension]: extension,
    };
  }, {});
}

async function importTasks(filePath, { users, centers, programs, assets }) {
  const items = await itemsImport(filePath, 'ta_tasks', 40);
  const subjects = await itemsImport(filePath, 'ta_task_subjects', 40);

  await Promise.all(
    keys(items)
      .filter((key) => !isNil(key) && !isEmpty(key))
      .map(async (key) => {
        const task = items[key];

        task.center = centers[task.center]?.id;
        const program = programs[task.program];

        task.subjects = Object.entries(subjects)
          .filter(([, item]) => item.task === key)
          .map(([, item]) => ({
            subject: program.subjects[item.subject]?.id,
            level: item.level,
            program: program.id,
            curriculum: {
              objectives: (item.objectives || '')
                .split('\n')
                .map((val) => `<p style="margin-left: 0px!important;">${trim(val)}</p>`),
            },
          }));

        task.resources = (task.resources || '')
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((val) => assets && assets[val]?.id)
          .filter(Boolean);

        task.tags = (task.tags || '')
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val));

        // ·····················································
        // SUBMISSION

        let submission = null;
        const type = task.submission_type;

        if (type && !isEmpty(type)) {
          let data = null;

          if (toLower(type) === 'file') {
            data = {
              maxSize: task.submission_max_size,
              extensions: getDataType((task.submission_extensions || '').split(',')),
              multipleFiles: task.submission_multiple_files,
            };
          }

          submission = {
            type,
            data,
            description: !isEmpty(task.submission_description)
              ? converter.makeHtml(task.submission_description)
              : null,
          };
        }

        const creator = users[task.creator];
        const development = await parseDevelopment({ task, assets, userSession: creator });

        items[key] = {
          asset: {
            name: task.name,
            tagline: task.tagline,
            description: task.description || null,
            tags: task.tags || [],
            color: task.color || null,
            cover: task.cover || null,
          },
          center: task.center,
          subjects: task.subjects,
          statement: converter.makeHtml(task.statement || ''),
          duration: task.duration || null,
          submission,
          gradable: task.gradable,
          creator,
          instructionsForTeachers: !isEmpty(task.instructions_for_teachers)
            ? converter.makeHtml(task.instructions_for_teachers)
            : null,
          instructionsForStudents: !isEmpty(task.instructions_for_students)
            ? converter.makeHtml(task.instructions_for_students)
            : null,
          resources: task.resources,
          metadata: development
            ? {
                development,
              }
            : undefined,
        };
      })
  );

  return items;
}

module.exports = importTasks;
