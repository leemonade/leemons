import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box, Button, Col, Divider, Drawer, Grid } from '@bubbles-ui/components';
import { Name } from './components/Name';
import { Preview } from './components/Preview';
import { Centers } from './components/Centers';
import { FieldType } from './components/FieldType';
import { Permissions } from './components/Permissions';
import { FieldConfig } from './components/FieldConfig';
import { FieldConfigLocale } from './components/FieldConfigLocale';
import DatasetItemDrawerContext from './context/DatasetItemDrawerContext';
import { DatasetItemDrawerStyles } from './DatasetItemDrawer.styles';

export const DATASET_DATA_TYPES = {
  textField: {
    type: 'text_field'
  },
  richText: {
    type: 'rich_text'
  },
  number: {
    type: 'number'
  },
  date: {
    type: 'date'
  },
  email: {
    type: 'email'
  },
  phone: {
    type: 'phone'
  },
  link: {
    type: 'link'
  },
  /*
  archive: {
    type: 'archive',
  },
   */
  multioption: {
    type: 'multioption'
  },
  boolean: {
    type: 'boolean'
  },
  select: {
    type: 'select'
  },
  user: {
    type: 'user'
  }
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
    previewLabel: 'Preview'
  },
  errorMessages: {
    nameRequired: 'Field required',
    fieldTypeRequired: 'Field required',
    multioptionShowAsRequired: 'Field required',
    booleanShowAsRequired: 'Field required',
    booleanInitialStateRequired: 'Field required',
    localeLabelRequired: 'Field required',
    optionFieldRequired: 'Field required'
  },
  locales: [],
  selectOptions: {
    userProfiles: [],
    userCenters: [],
    centers: [],
    fieldBooleanInitialState: [
      {
        label: 'Unselected',
        value: '-'
      },
      {
        label: 'Si',
        value: 'si'
      },
      {
        label: 'No',
        value: 'no'
      }
    ],
    fieldMultioptionShowAs: [
      {
        label: 'Dropdown',
        value: 'dropdown'
      },
      {
        label: 'Checkboxs',
        value: 'checkboxs'
      },
      {
        label: 'Radio',
        value: 'radio'
      }
    ],
    fieldBooleanShowAs: [
      {
        label: 'Checkbox',
        value: 'checkbox'
      },
      {
        label: 'Radio',
        value: 'radio'
      },
      {
        label: 'Switcher',
        value: 'switcher'
      }
    ],
    fieldTypes: [
      {
        label: 'Field',
        value: DATASET_DATA_TYPES.textField.type
      },
      {
        label: 'Textarea',
        value: DATASET_DATA_TYPES.richText.type
      },
      {
        label: 'Number',
        value: DATASET_DATA_TYPES.number.type
      },
      {
        label: 'Date',
        value: DATASET_DATA_TYPES.date.type
      },
      {
        label: 'Email',
        value: DATASET_DATA_TYPES.email.type
      },
      {
        label: 'Phone',
        value: DATASET_DATA_TYPES.phone.type
      },
      {
        label: 'Link',
        value: DATASET_DATA_TYPES.link.type
      },
      {
        label: 'Multioption',
        value: DATASET_DATA_TYPES.multioption.type
      },
      {
        label: 'Boolean',
        value: DATASET_DATA_TYPES.boolean.type
      },
      {
        label: 'Select',
        value: DATASET_DATA_TYPES.select.type
      },
      {
        label: 'User',
        value: DATASET_DATA_TYPES.user.type
      }
    ]
  },
  opened: false,
  position: 'right',
  size: 1187,
  onClose: () => {
  }
};
export const DATASET_ITEM_DRAWER_PROP_TYPES = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  locales: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      code: PropTypes.string
    })
  ),
  defaultLocale: PropTypes.string,
  formWithTheme: PropTypes.func,
  selectOptions: PropTypes.shape({
    centers: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any
      })
    ),
    fieldTypes: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any
      })
    ),
    fieldMultioptionShowAs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any
      })
    ),
    fieldBooleanShowAs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any
      })
    ),
    fieldBooleanInitialState: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any
      })
    ),
    userCenters: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any
      })
    ),
    userProfiles: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any
      })
    )
  }),
  opened: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.number,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  defaultValues: PropTypes.object,
  isSaving: PropTypes.bool,
  loading: PropTypes.bool
};

const DatasetItemDrawer = ({
                             loading,
                             position,
                             opened,
                             onClose,
                             onSave,
                             size,
                             defaultValues,
                             messages,
                             errorMessages,
                             selectOptions,
                             locales,
                             defaultLocale,
                             profiles,
                             isSaving,
                             formWithTheme,
                             formT
                           }) => {
  const { classes, cx } = DatasetItemDrawerStyles({});
  const form = useForm({ defaultValues });
  const contextRef = useRef({
    classes,
    gridColumn: 1000,
    colSpans: [250, 375, 375],
    colOptionsSpans: [250, 450],
    translateOptionsModalOpened: {}
  });
  const [r, setR] = useState(0);

  function render() {
    setR(new Date().getTime());
  }

  function save() {
    form.handleSubmit((data) => {
      onSave(data);
    })();
  }

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    contextRef.current.messages = messages;
    contextRef.current.errorMessages = errorMessages;
    contextRef.current.selectOptions = selectOptions;
    contextRef.current.locales = locales;
    contextRef.current.defaultLocale = defaultLocale;
    contextRef.current.profiles = profiles;
    contextRef.current.formWithTheme = formWithTheme;
    if (!contextRef.current.selectedLocale) {
      contextRef.current.selectedLocale = defaultLocale;
    }
    render();
  }, [messages, errorMessages, selectOptions, locales, defaultLocale, profiles, formWithTheme]);

  return (
    <Drawer position={position} opened={opened} size={size} onClose={onClose} empty>
      {loading ? (
        'Loading'
      ) : (
        <DatasetItemDrawerContext.Provider
          value={{ contextRef: contextRef.current, classes, form, render }}
        >
          <Grid className={classes.grid} grow columns={100}>
            <Col span={35} className={classes.leftColContainer}>
              <Preview />
            </Col>

            <Col span={65} className={classes.rightColContainer}>
              <Box className={classes.rightColContent}>
                {/* Name */}
                <Name />
                {/* Centers */}
                <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                  <Centers />
                </Box>
                <Box className={classes.divider}>
                  <Divider />
                </Box>
                {/* Field type/config */}
                <FieldType />
                <FieldConfig />
                <FieldConfigLocale />
                {/* Permissions */}
                <Permissions />
              </Box>
              <Box className={classes.saveSection}>
                <Button loading={isSaving} onClick={save}>
                  {messages.saveButtonLabel}
                </Button>
              </Box>
            </Col>
          </Grid>
        </DatasetItemDrawerContext.Provider>
      )}
    </Drawer>
  );
};

DatasetItemDrawer.defaultProps = DATASET_ITEM_DRAWER_DEFAULT_PROPS;

DatasetItemDrawer.propTypes = DATASET_ITEM_DRAWER_PROP_TYPES;

export { DatasetItemDrawer };
