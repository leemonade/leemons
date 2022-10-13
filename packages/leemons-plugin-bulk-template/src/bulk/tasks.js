const path = require('path');
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

function parseDevelopment(task, assets) {
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

  const finalArray = htmlArray.map((development) => {
    const regex = /<p>(\[asset.*?\])<\/p>/g;
    let match;
    let finalDevelopment = '';

    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(development)) !== null) {
      const [paragraph, asset] = match;

      const componentInfo = Object.fromEntries(
        asset
          .substring(1, asset.length - 1)
          .split(',')
          .map((prop) => prop.split(':').map((s) => s.trim()))
      );

      const assetInfo = assets[componentInfo.asset];
      if (assetInfo.file?.id) {
        assetInfo.url = getFileUrl(assetInfo.file.id);
      }
      if (assetInfo.cover?.id) {
        assetInfo.cover = getFileUrl(assetInfo.cover.id);
      }

      if (!assetInfo) {
        throw new Error(`Invalid asset id (${componentInfo.asset}) provided`);
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

      finalDevelopment += match.input.replace(paragraph, assetText);
    }

    return finalDevelopment || development;
  });

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

async function importTasks({ users, centers, programs, assets }) {
  const filePath = path.resolve(__dirname, 'data.xlsx');
  const items = await itemsImport(filePath, 'ta_tasks', 40);
  const subjects = await itemsImport(filePath, 'ta_task_subjects', 40);

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
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

      /*
    task.subjects = (task.subjects || '')
      .split(',')
      .map((val) => trim(val))
      .filter((val) => !isEmpty(val))
      .map((subjectItem) => {
        const [subject, level] = subjectItem.split('|');
        const subjectKey = `${subject}.objectives`;

        return {
          subject: program.subjects[subject]?.id,
          level,
          program: program.id,
          curriculum: {
            objectives: (task[subjectKey] || '')
              .split('\n')
              .map((val) => `<p style="margin-left: 0px!important;">${trim(val)}</p>`),
          },
        };
      });
      */

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

      const development = parseDevelopment(task, assets);

      items[key] = {
        asset: {
          name: task.name,
          tagline: task.tagline,
          description: task.description,
          tags: task.tags,
          color: task.color,
          cover: task.cover,
        },
        center: task.center,
        subjects: task.subjects,
        statement: converter.makeHtml(task.statement || ''),
        duration: task.duration || null,
        submission,
        gradable: task.gradable,
        creator: users[task.creator],
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
    });

  return items;
}

module.exports = importTasks;
