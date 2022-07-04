const path = require('path');
const { keys, trim, isEmpty, toLower } = require('lodash');
const showdown = require('showdown');
const mime = require('mime');
const itemsImport = require('./helpers/simpleListImport');

const converter = new showdown.Converter();

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

  keys(items).forEach((key) => {
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
      development: isEmpty(task.development) ? null : converter.makeHtml(task.development),
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
    };
  });

  return items;
}

module.exports = importTasks;
