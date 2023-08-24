export const BRANCH_CONTENT_MESSAGES = {
  numerationLabel: 'Numeration',
  useNumerationLabel: 'Numbering',
  addNumeration: 'Add numeration',
  subTypeLabel: 'Sub-type',
  evaluationCriteriaLabel: 'This block contains evaluation criteria',
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
  listTypePlaceholder: 'Select...',
  listOrderedPlaceholder: 'Select...',
  listNumberingDigitsLabel: 'Digits',
  listNumberingContinueFromPrevious: 'Continue from previous parent block',
  cancelCodeAutoComposedField: 'Cancel',
  saveCodeAutoComposedField: 'Save',
  groupOrderedPlaceholder: 'Select...',
  groupColumnTypeLabel: 'Type',
  groupColumnTypePlaceholder: 'Select...',
  groupShowAs: 'Show as',
  groupSaveConfig: 'Save config',
  groupAddElement: 'Add element',
  blockCancelConfigButtonLabel: 'Cancel',
  newBlock: 'New block',
  curricularContentLabel: 'Curricular content',
  curricularContentPlaceholder: 'Select...',
  curricularKnowledges: 'Knowledges',
  curricularQualifyingCriteria: 'Qualifying criteria',
  curricularNonQualifyingCriteria: 'Non qualifying criteria',
  tableAdd: 'Add',
  tableRemove: 'Remove',
  tableEdit: 'Edit',
  tableAccept: 'Accept',
  tableCancel: 'Cancel',
  fieldName: 'Field name',
  subBlockTitle: 'Title of the sub-blocks',
  subBlockContent: 'Content of the sub-blocks',
  removeBlock: 'Remove block',
  continueButtonLabel: 'Continue',
  subBlock: 'Sub-block',
  fieldRequired: 'Field required',
  maxLength: 'Maximum {max} characters',
  useContentRelations: 'Content relations',
  relatedTo: 'Related to',
  typeOfRelation: 'Type of relation',
  showNumeration: 'Show numbering',
  content: 'Content',
  numbering: 'Numbering',
  father: 'Father',
  label: 'Label',
};

export const BRANCH_CONTENT_ERROR_MESSAGES = {
  nameRequired: 'Field required',
  fieldNameRequired: 'Field required',
  orderedRequired: 'Field required',
  blockNameRequired: 'Field required',
  blockTypeRequired: 'Field required',
  blockOrderedRequired: 'Field required',
  fieldMinRequired: 'Field required',
  fieldMaxRequired: 'Field required',
  codeTypeRequired: 'Field required',
  listTypeRequired: 'Field required',
  listOrderedRequired: 'Field required',
  listOrderedTextRequired: 'Field required',
  listNumberingStyleRequired: 'Field required',
  codeNodeLevelRequired: 'Field required',
  codeNodeLevelFieldRequired: 'Field required',
  groupOrderedRequired: 'Field required',
  groupColumnNameRequired: 'Field required',
  groupColumnTypeRequired: 'Field required',
  groupShowAsRequired: 'Field required',
  curricularContentRequired: 'Field required',
};

export const BRANCH_CONTENT_SELECT_DATA = {
  blockType: [
    {
      label: 'Field',
      value: 'field',
    },
    /*
    {
      label: 'Code',
      value: 'code',
    },
     */
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
  listType: [
    {
      label: 'Field',
      value: 'field',
    },
    {
      label: 'Text area',
      value: 'textarea',
    },
  ],
  listOrdered: [
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
    {
      label: 'Custom numbering',
      value: 'custom',
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
  groupOrdered: [
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
    /*
    {
      label: 'Code',
      value: 'code',
    },
     */
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
