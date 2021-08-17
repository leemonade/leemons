module.exports = {
  common: {
    save: 'Save',
    view: 'View',
    edit: 'Edit',
  },
  welcome_page: {
    page_title: 'Welcome to Classroom',
    page_info: `<p>Classroom allows you to replicate the organisational structure of your educational institution.</p>
      <p>The first step is to create the <strong>Tree</strong>. This tree is used to represent the basic structure of your organisation.</p>
      <p>For example, if you have a school with educational programmes (primary and secondary) that has courses (first, second, third...) and in each of them you divide the students into groups that share class (group A, group B, ...), it will be necessary for the system to know this logic. You will only have to create the tree once (but you can add new leveles later).</p>
      <p>Then, in the <strong>Organisation</strong> section you can define the dataset (concrete information) for each level and the permissions you want to assign. Finally, in the <strong>Classes admin</strong> section you will be able to assign students, tutors and define the data foreseen in the previous step. These sections will only be available once you have created your tree.</p>
      <p>You can start by downloading our basic structure file and editing it in your favourite spreadsheet application or create the level tree manually from Leemons.</p>`,
    hide_info_label: `Ok, I've got it. When the configuration is complete, don´t show this info anymore`,
    bulk_load: {
      title: 'Bulk Upload',
      description:
        'Download the basic file and upload it once completed (if you need more help, you can see this basic guide on how our structure system works).',
      btn: 'Upload',
    },
    manual_load: {
      title: 'Manual creation',
      description:
        'Define your own structure using our visual editor (here are some examples of basic structures that you can use as a template).',
      btn: 'Create tree',
    },
  },
};
