import PropTypes from 'prop-types';

const FIELD_REQUIRED = 'Field required';

export const DATASET_DATA_TYPES = {
  textField: {
    type: 'text_field',
  },
  richText: {
    type: 'rich_text',
  },
  number: {
    type: 'number',
  },
  date: {
    type: 'date',
  },
  email: {
    type: 'email',
  },
  phone: {
    type: 'phone',
  },
  link: {
    type: 'link',
  },
  /*
  archive: {
    type: 'archive',
  },
   */
  multioption: {
    type: 'multioption',
  },
  boolean: {
    type: 'boolean',
  },
  select: {
    type: 'select',
  },
  user: {
    type: 'user',
  },
};

export const DATASET_ITEM_DRAWER_DEFAULT_PROPS = {
  messages: {
    saveButtonLabel: 'Save',
    namePlaceholder: 'New field',
    centerLabel: 'Center',
    fieldTypeLabel: 'Field Type',
    fieldTypePlaceholder: 'Select field type',
    textFieldRequiredLabel: 'Required',
    textFieldMaskedLabel: 'Masked',
    fieldLengthLabel: 'Field Length',
    fieldLengthMinLabel: 'Min',
    fieldLengthMaxLabel: 'Max',
    fieldLengthOnlyNumbersLabel: 'Only numbers',
    fieldDateLabel: 'Limited to',
    fieldDateMinLabel: 'From',
    fieldDateMaxLabel: 'to',
    multioptionShowAsLabel: 'Show as',
    fieldMultioptionLimitsLabel: 'Number of options',
    fieldMultioptionLimitsMinLabel: 'Min',
    fieldMultioptionLimitsMaxLabel: 'Max',
    fieldMultioptionShowAsPlaceholder: 'Select show as',
    fieldMultioptionOptionsLabel: 'Create options',
    fieldMultioptionAddOptionsLabel: 'Add option',
    booleanShowAsLabel: 'Show as',
    fieldBooleanShowAsPlaceholder: 'Select show as',
    booleanInitialStateLabel: 'Initial state',
    booleanInitialStateLabelPlaceholder: 'Select initial state',
    fieldSelectOptionsLabel: 'Create options',
    fieldSelectAddOptionsLabel: 'Add option',
    userCentersLabel: 'Center/s',
    userCentersDescription: 'Displays only the users of the selected center(s)',
    userProfileLabel: 'Profile/s',
    userProfileDescription: 'Displays only users of the selected profile type(s)',
    fieldConfigLocaleTitle: 'Configuration & languages',
    localeLabelLabel: 'Label',
    localeLabelDescription: 'Visible name on the file.',
    localeDescriptionLabel: 'Description',
    localeDescriptionDescription: 'Field description.',
    localeHelpLabel: 'Help text',
    localeHelpDescription: 'Use this text to orient the user to the expected content.',
    localeMultioptionSelectPlaceholderLabel: 'First option',
    translateOptionsHelpLabel: 'Untranslated content will appear in the default language',
    translateOptionsButtonLabel: 'Option translations',
    translateOptionsModalTitle: 'Options translation',
    translateOptionsModalDescription: 'Add here the translations of the options into English',
    translateOptionsValueColLabel: 'Value',
    translateOptionsTranslationColLabel: 'Translation to {code}',
    localeBooleanOptionLabel: 'Option label',
    localeBooleanOptionDescription: 'Text nex to the checkbox',
    localeBooleanYesLabel: '"Yes" Label',
    localeBooleanNoLabel: '"No" Label',
    fieldPermissionsTitle: 'Profiles permissions',
    permissionsProfileLabel: 'Profile',
    permissionsViewLabel: 'View',
    permissionsEditLabel: 'Edit',
    translateOptionsContinueButtonLabel: 'Continue',
    previewLabel: 'Preview',
  },
  errorMessages: {
    nameRequired: FIELD_REQUIRED,
    fieldTypeRequired: FIELD_REQUIRED,
    multioptionShowAsRequired: FIELD_REQUIRED,
    booleanShowAsRequired: FIELD_REQUIRED,
    booleanInitialStateRequired: FIELD_REQUIRED,
    localeLabelRequired: FIELD_REQUIRED,
    optionFieldRequired: FIELD_REQUIRED,
  },
  locales: [],
  selectOptions: {
    userProfiles: [],
    userCenters: [],
    centers: [],
    fieldBooleanInitialState: [
      {
        label: 'Unselected',
        value: '-',
      },
      {
        label: 'Si',
        value: 'si',
      },
      {
        label: 'No',
        value: 'no',
      },
    ],
    fieldMultioptionShowAs: [
      {
        label: 'Dropdown',
        value: 'dropdown',
      },
      {
        label: 'Checkboxs',
        value: 'checkboxs',
      },
      {
        label: 'Radio',
        value: 'radio',
      },
    ],
    fieldBooleanShowAs: [
      {
        label: 'Checkbox',
        value: 'checkbox',
      },
      {
        label: 'Radio',
        value: 'radio',
      },
      {
        label: 'Switcher',
        value: 'switcher',
      },
    ],
    fieldTypes: [
      {
        label: 'Field',
        value: DATASET_DATA_TYPES.textField.type,
      },
      {
        label: 'Textarea',
        value: DATASET_DATA_TYPES.richText.type,
      },
      {
        label: 'Number',
        value: DATASET_DATA_TYPES.number.type,
      },
      {
        label: 'Date',
        value: DATASET_DATA_TYPES.date.type,
      },
      {
        label: 'Email',
        value: DATASET_DATA_TYPES.email.type,
      },
      {
        label: 'Phone',
        value: DATASET_DATA_TYPES.phone.type,
      },
      {
        label: 'Link',
        value: DATASET_DATA_TYPES.link.type,
      },
      {
        label: 'Multioption',
        value: DATASET_DATA_TYPES.multioption.type,
      },
      {
        label: 'Boolean',
        value: DATASET_DATA_TYPES.boolean.type,
      },
      {
        label: 'Select',
        value: DATASET_DATA_TYPES.select.type,
      },
      {
        label: 'User',
        value: DATASET_DATA_TYPES.user.type,
      },
    ],
  },
  opened: false,
  position: 'right',
  size: 1187,
  onClose: () => {},
};
export const DATASET_ITEM_DRAWER_PROP_TYPES = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  locales: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  defaultLocale: PropTypes.string,
  formWithTheme: PropTypes.func,
  selectOptions: PropTypes.shape({
    centers: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
      })
    ),
    fieldTypes: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
      })
    ),
    fieldMultioptionShowAs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
      })
    ),
    fieldBooleanShowAs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
      })
    ),
    fieldBooleanInitialState: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
      })
    ),
    userCenters: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
      })
    ),
    userProfiles: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
      })
    ),
  }),
  opened: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.number,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  defaultValues: PropTypes.object,
  isSaving: PropTypes.bool,
  loading: PropTypes.bool,
};
