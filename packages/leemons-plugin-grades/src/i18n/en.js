module.exports = {
  welcome_page: {
    page_title: 'Academic Rules',
    page_description:
      '"Academic Rules" allows you to create custom rules for your programs and courses: maximum or minimum core/elective credits, required subject areas, elective courses... thanks to these rules you will be able to create grade reports and know which students will be promoted.',
    hide_info_label: `Ok, I've got it. When the configuration is complete, don't show this info anymore`,
    step_evaluations: {
      title: 'Evaluation Systems',
      description:
        'Whether you need an evaluation system based on a numerical scale, letter-based or a mix of both, we support it all.',
      btn: 'Create systems',
    },
    step_promotions: {
      title: 'Promotion rules',
      description:
        'Creates a set of evaluation rules based on credits or on required and elective subjects. You can also add rules for specific knowledge areas.',
      btn: 'Add rules',
    },
    step_dependencies: {
      title: 'Dependencies',
      description:
        'Configure the dependencies between subjects, based on your performance or evaluation system.',
      btn: 'Setup dependencies',
    },
  },
  evaluationsPage: {
    pageTitle: 'Evaluation System',
    pageDescription:
      'With this tool you can create different types of evaluation systems that you can later assign to your programs.',
    addGrade: 'Add new evaluation system',
    successSave: 'Saved successfully',
    selectCenter: 'Seleccionar centro',
    errorCode6002: 'Cannot delete grade scale because it is used in conditions',
    errorCode6003: 'Cannot delete grade scale because it is used in grade tags',
    errorCode6004: 'Cannot delete grade scale because it is used in grades',
    detail: {
      nameLabel: 'Name',
      saveButtonLabel: 'Save',
      typeLabel: 'Choose type of grade scale:',
      percentagesLabel: 'Using percentages instead of numbers',
      scalesNumberLabel: 'Number',
      scalesDescriptionLabel: 'Description',
      scalesPercentageLabel: '% Percentage',
      scalesNumericalEquivalentLabel: 'Numerical equivalent',
      scalesLetterLabel: 'Letter',
      minScaleToPromoteLabel: 'Minimum value to pass/promote',
      minScaleToPromotePlaceholder: 'Select value...',
      otherTagsLabel: 'Other tags',
      otherTagsDescription:
        'If you need to use other tags to classify special conditions for some subjects, you can freely create them here.',
      otherTagsRelationScaleLabel: 'Co-relation with some scale value',
      tableAdd: 'Add',
      tableRemove: 'Remove',
      tableEdit: 'Edit',
      tableAccept: 'Accept',
      tableCancel: 'Cancel',
      nameRequired: 'Field required',
      typeRequired: 'Field required',
      minScaleToPromoteRequired: 'Field required',
    },
  },
};
