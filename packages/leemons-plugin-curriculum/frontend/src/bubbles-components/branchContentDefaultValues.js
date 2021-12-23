export const BRANCH_CONTENT_MESSAGES = {
  addContent: 'Add Content',
  blockNameLabel: 'Content Block Name',
  blockNamePlaceholder: 'Name...',
  blockTypeLabel: 'Type',
  blockTypePlaceholder: 'Select...',
  blockTypeNothingFound: 'No data',
  blockOrderedLabel: 'Ordered',
  blockOrderedPlaceholder: 'Select...',
  groupTypeOfContentLabel: 'Type of Content',
  groupTypeOfContentPLaceholder: 'Select...',
  groupContentConfigLabel: 'Content config',
  groupAddColumnButtonLabel: 'Add Column',
  fieldLimitCharactersLabel: 'Limited characters',
  fieldMinLabel: 'Min',
  fieldMinPlaceholder: 'Min...',
  fieldMaxLabel: 'Max',
  fieldMaxPlaceholder: 'Max...',
  blockSaveConfigButtonLabel: 'Save Config',
  codeTypePlaceholder: 'Select...',
  codeTypeNothingFound: 'No data',
  codeComposerLabel: 'Code composer',
  cancelCodeAutoComposedField: 'Cancel',
  saveCodeAutoComposedField: 'Save',
};

export const BRANCH_CONTENT_ERROR_MESSAGES = {
  nameRequired: 'Field required',
  orderedRequired: 'Field required',
  blockNameRequired: 'Field required',
  blockTypeRequired: 'Field required',
  blockOrderedRequired: 'Field required',
  fieldMinRequired: 'Field required',
  fieldMaxRequired: 'Field required',
  codeTypeRequired: 'Field required',
  codeNodeLevelRequired: 'Field required',
  codeNodeLevelFieldRequired: 'Field required',
};

export const BRANCH_CONTENT_SELECT_DATA = {
  blockType: [
    {
      label: 'Field',
      value: 'field',
    },
    {
      label: 'Code',
      value: 'code',
    },
    {
      label: 'Text area',
      value: 'textarea',
    },
    {
      label: 'List',
      value: 'list',
    },
    {
      label: 'Group',
      value: 'group',
    },
  ],
  blockOrdered: [
    {
      label: 'Not ordered',
      value: 'not-ordered',
    },
    {
      label: 'Only bullets',
      value: 'bullets',
    },
    {
      label: 'Numbering Style 1 (1,2,3,...)',
      value: 'style-1',
    },
    {
      label: 'Numbering Style 2 (A,B,C,...)',
      value: 'style-2',
    },
  ],
  groupTypeOfContents: [
    {
      label: 'Field',
      value: 'field',
    },
    {
      label: 'Code',
      value: 'code',
    },
    {
      label: 'Text area',
      value: 'textarea',
    },
    {
      label: 'List',
      value: 'list',
    },
  ],
  codeType: [
    {
      label: 'Manual',
      value: 'manual',
    },
    {
      label: 'Autocomposed',
      value: 'autocomposed',
    },
  ],
  parentNodeLevels: [
    {
      label: 'Program',
      value: '--id--',
    },
  ],
  nodeLevelsFields: {
    '--id--': [
      {
        label: 'Field',
        value: '--id--',
      },
    ],
  },
};
