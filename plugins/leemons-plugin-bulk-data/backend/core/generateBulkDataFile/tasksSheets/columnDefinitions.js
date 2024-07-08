const markdownNote = 'We write mark down as plain text here.';

const TASK_COLUMN_DEFINITIONS = {
  root: {
    title: 'Root',
    width: 15,
    style: { fontColor: 'white', bgColor: 'black' },
  },
  name: {
    title: 'Name',
    width: 20,
  },
  tagline: {
    title: 'Tagline',
    width: 30,
  },
  description: {
    title: 'Description',
    width: 50,
  },
  tags: {
    title: 'Tags',
    width: 25,
  },
  color: {
    title: 'Color',
    width: 10,
  },
  cover: {
    title: 'Cover',
    width: 15,
  },
  creator: {
    title: 'Creator',
    width: 20,
  },
  center: {
    title: 'Center',
    width: 20,
  },
  program: {
    title: 'Program',
    width: 20,
  },
  duration: {
    title: 'Duration',
    width: 15,
  },
  resources: {
    title: 'Resources',
    width: 25,
  },
  statement: {
    title: 'Statement',
    width: 30,
    note: markdownNote,
  },
  development: {
    title: 'Development',
    width: 30,
  },
  gradable: {
    title: 'Gradable',
    width: 10,
  },
  submission_type: {
    title: 'Submission Type',
    width: 20,
    style: { fontColor: 'white', bgColor: 'green' },
  },
  submission_extensions: {
    title: 'Submission Extensions',
    width: 20,
    style: { fontColor: 'white', bgColor: 'green' },
  },
  submission_max_size: {
    title: 'Submission Max Size',
    width: 20,
    style: { fontColor: 'white', bgColor: 'green' },
  },
  submission_multiple_files: {
    title: 'Submission Multiple Files',
    width: 25,
    style: { fontColor: 'white', bgColor: 'green' },
  },
  submission_description: {
    title: 'Submission Description',
    width: 30,
    style: { fontColor: 'white', bgColor: 'green' },
    note: markdownNote,
  },
  instructions_for_teachers: {
    title: 'Instructions for Teachers',
    width: 30,
    style: { fontColor: 'white', bgColor: 'red' },
    note: markdownNote,
  },
  instructions_for_students: {
    title: 'Instructions for Students',
    width: 30,
    style: { fontColor: 'white', bgColor: 'red' },
    note: markdownNote,
  },
  metadata: {
    title: 'Task Metadata',
    width: 30,
  },
  hideInLibrary: {
    title: 'Hide in library',
    width: 10,
  },
};

Object.keys(TASK_COLUMN_DEFINITIONS).forEach((key) => {
  if (!TASK_COLUMN_DEFINITIONS[key].style) {
    TASK_COLUMN_DEFINITIONS[key].style = { bgColor: 'lightBlue' };
  }
});

module.exports = { TASK_COLUMN_DEFINITIONS };
