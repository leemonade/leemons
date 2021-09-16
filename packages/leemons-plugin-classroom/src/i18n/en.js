module.exports = {
  common: {
    save: 'Save',
    view: 'View',
    edit: 'Edit',
    organization: 'Organization',
    center: 'Center',
    add_level: 'Add level',
    select_template: 'Select template',
  },
  welcome_page: {
    page_title: 'Welcome to Classroom',
    page_info: `<p>Classroom allows you to replicate the organisational structure of your educational institution.</p>
      <p>The first step is to create the <strong>Tree</strong>. This tree is used to represent the basic structure of your organisation.</p>
      <p>For example, if you have a school with educational programmes (primary and secondary) that has courses (first, second, third...) and in each of them you divide the students into groups that share class (group A, group B, ...), it will be necessary for the system to know this logic. You will only have to create the tree once (but you can add new leveles later).</p>
      <p>Then, in the <strong>Organisation</strong> section you can define the dataset (concrete information) for each level and the permissions you want to assign. Finally, in the <strong>Classes admin</strong> section you will be able to assign students, tutors and define the data foreseen in the previous step. These sections will only be available once you have created your tree.</p>
      <p>You can start by downloading our basic structure file and editing it in your favourite spreadsheet application or create the level tree manually from Leemons.</p>`,
    hide_info_label: `Ok, I've got it. When the configuration is complete, don't show this info anymore`,
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
  tree_page: {
    page_title: 'Tree',
    page_info:
      'Use the button <span class="w-5 h-5 border-2 border-primary rounded-full leading-none inline-block text-primary font-semibold text-center">+</span> to create each level, then use the right panel to configure the data set for the level.',
    from_template_info: {
      title: 'Do you want to pre-load a template to save time?',
      description:
        'Choose the type of template and click on load tree, later you can modify the dataset of each level according to the needs of your organisation.',
      btn: 'Preview template',
      hide_info: {
        description: 'I prefer to do it manually.',
        btn: `Don't show anymore`,
      },
    },
    level: {
      new: {
        placeholder: 'Level name',
        tree_label: 'New level',
        btn: 'Save Level and continue',
        is_class_label: 'Class level (Minimum level to student assignment)',
      },
      tabs: {
        dataset: {
          label: 'Level Dataset',
          description: 'Configuration of general fields for the level',
          add_field: 'Add field',
        },
        profiles: {
          label: 'Assignable User profiles',
        },
      },
    },
  },
  class_list: {
    page_title: 'Administración de clases',
    page_info:
      'Aquí puedes encontrar y administrar la estructura de niveles de tu Universidad y asignar estudiantes a clases.',
    details: {
      type_program: 'programs',
      type_courses: 'courses',
      type_groups: 'groups',
    },
    class_table: {
      th_tutor: 'Tutor',
      th_students: 'Students',
      th_actions: 'Actions',
      btn_edit: 'Edit',
      btn_expand: 'Expand',
      btn_view: 'View',
    },

    view_panel: {
      summary: {
        btn_edit: 'Edit',
        btn_expand: 'Expand',
        counter: 'Students',
      },
      table: {
        th_name: 'First Name',
        th_surename: 'Second Name',
        th_email: 'E-mail Adress',
        th_birthday: 'birthday',
      },
    },
  },
};
