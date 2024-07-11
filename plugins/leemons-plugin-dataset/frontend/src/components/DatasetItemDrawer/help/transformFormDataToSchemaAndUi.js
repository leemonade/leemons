/* eslint-disable no-param-reassign */
import { cloneDeep, forEach, merge } from 'lodash';
import { DATASET_DATA_TYPES } from '../DatasetItemDrawer.constants';

const handleTextLength = ({ frontConfig, schema }) => {
  if (frontConfig.minLength) {
    schema.minLength = parseInt(frontConfig.minLength, 10);
    schema.frontConfig.minLength = parseInt(frontConfig.minLength, 10);
  }
  if (frontConfig.maxLength) {
    schema.maxLength = parseInt(frontConfig.maxLength, 10);
    schema.frontConfig.maxLength = parseInt(frontConfig.maxLength, 10);
  }
};

const handleTextField = ({ frontConfig, schema, ui }) => {
  schema.type = 'string';

  if (frontConfig.masked) {
    ui['ui:widget'] = 'password';
  }

  if (frontConfig.onlyNumbers) {
    schema.format = 'numbers';
  }

  handleTextLength({ frontConfig, schema });
};

const handleRichTextField = ({ frontConfig, schema, ui }) => {
  schema.type = 'string';
  ui['ui:widget'] = 'textarea';

  handleTextLength({ frontConfig, schema });
};

const handleNumberField = ({ schema }) => {
  schema.type = 'number';
};

const handleBooleanField = ({ frontConfig, schema, ui }) => {
  schema.type = 'boolean';
  if (frontConfig.initialStatus === 'yes') schema.default = true;
  if (frontConfig.initialStatus === 'no') schema.default = false;
  if (frontConfig.uiType === 'radio') {
    ui['ui:widget'] = 'radio';
    schema.enumNames = [frontConfig.yesOptionLabel, frontConfig.noOptionLabel];
  }
  if (frontConfig.uiType === 'switcher') {
    ui['ui:widget'] = 'toggle';
  }
};

const handleDateField = ({ frontConfig, schema }) => {
  schema.type = 'string';
  schema.format = 'date';
  if (frontConfig.minDate) {
    schema.minDate = new Date(frontConfig.minDate);
    schema.frontConfig.minDate = new Date(frontConfig.minDate);
  }
  if (frontConfig.maxDate) {
    schema.maxDate = new Date(frontConfig.maxDate);
    schema.frontConfig.maxDate = new Date(frontConfig.maxDate);
  }
};

const handleMultioptionField = ({ frontConfig, schema, ui }) => {
  if (frontConfig.uiType !== 'radio') {
    if (frontConfig.minItems) {
      schema.minItems = parseInt(frontConfig.minItems);
      schema.frontConfig.minItems = parseInt(frontConfig.minItems);
    }
    if (frontConfig.maxItems) {
      schema.maxItems = parseInt(frontConfig.maxItems);
      schema.frontConfig.maxItems = parseInt(frontConfig.maxItems);
    }
    if (frontConfig.uiType === 'checkboxs') ui['ui:widget'] = 'checkboxes';
  } else {
    ui['ui:widget'] = 'radio';
  }
};

const handlePhoneField = ({ schema }) => {
  schema.type = 'string';
  schema.format = 'phone';
};

const handleEmailField = ({ schema }) => {
  schema.type = 'string';
  schema.format = 'email';
};

const handleUrlField = ({ schema }) => {
  schema.type = 'string';
  schema.format = 'uri';
};

const handleUserField = ({ schema }) => {
  schema.type = 'string';
};

const handleFileField = ({ schema }) => {
  schema.type = 'string';
  schema.format = 'data-url';
};

const updateMultioptionField = ({ schema, frontConfig, localeSchema }) => {
  schema.type = 'array';
  schema.uniqueItems = true;
  schema.items = {
    type: 'string',
    enum: [],
    enumNames: [],
  };
  if (!schema.minItems && schema.frontConfig.required) {
    schema.minItems = 1;
  }
  if (localeSchema?.frontConfig) {
    const checkLocalesByKey = localeSchema.frontConfig.checkboxLabels;
    forEach(schema.frontConfig.checkboxValues, ({ key, value }) => {
      schema.items.enum.push(value);
      schema.items.enumNames.push(checkLocalesByKey[key] ? checkLocalesByKey[key].label : ' ');
    });
  }
  if (frontConfig.uiType === 'radio') {
    schema.type = 'string';
    schema.enum = schema.items.enum;
    schema.enumNames = schema.items.enumNames;
    delete schema.items;
  }
};

const updateSelectField = ({ schema, localeSchema }) => {
  schema.type = 'string';
  schema.enum = [];
  schema.enumNames = [];
  if (localeSchema?.frontConfig) {
    const checkLocalesByKey = localeSchema.frontConfig.checkboxLabels;
    forEach(schema.frontConfig.checkboxValues, ({ key, value }) => {
      schema.enum.push(value);
      schema.enumNames.push(checkLocalesByKey[key] ? checkLocalesByKey[key].label : ' ');
    });
  }
};

const updateBooleanField = ({ schema, frontConfig, localeSchema }) => {
  if (localeSchema && frontConfig.uiType === 'radio') {
    schema.enumNames = [localeSchema.yesOptionLabel, localeSchema.noOptionLabel];
  }
};

const transformFormDataToSchemaAndUi = (_item, locale) => {
  const item = cloneDeep(_item ?? {});
  if (!item.frontConfig && !!item.config) {
    item.frontConfig = item.config;
    delete item.config;
  }
  let schema = { frontConfig: cloneDeep(item.frontConfig ?? {}) };
  let ui = {};

  const { frontConfig, locales } = item;
  if (frontConfig) {
    switch (frontConfig.type) {
      case DATASET_DATA_TYPES.textField.type:
        handleTextField({ frontConfig, schema, ui });
        break;
      case DATASET_DATA_TYPES.richText.type:
        handleRichTextField({ frontConfig, schema, ui });
        break;
      case DATASET_DATA_TYPES.number.type:
        handleNumberField({ schema });
        break;
      case DATASET_DATA_TYPES.boolean.type:
        handleBooleanField({ frontConfig, schema, ui });
        break;
      case DATASET_DATA_TYPES.date.type:
        handleDateField({ frontConfig, schema });
        break;
      case DATASET_DATA_TYPES.multioption.type:
        handleMultioptionField({ frontConfig, schema, ui });
        break;
      case DATASET_DATA_TYPES.phone.type:
        handlePhoneField({ schema });
        break;
      case DATASET_DATA_TYPES.email.type:
        handleEmailField({ schema });
        break;
      case DATASET_DATA_TYPES.link.type:
        handleUrlField({ schema });
        break;
      case DATASET_DATA_TYPES.user.type:
        handleUserField({ schema });
        break;
      // case DATASET_DATA_TYPES.archive.type:
      // handleFileField({ schema });
      //  break;
      default:
        break;
    }
  }

  if (locales?.[locale]) {
    schema = merge(cloneDeep(schema), cloneDeep(locales?.[locale]?.schema));
    ui = { ...ui, ...locales?.[locale]?.ui };
  }

  if (frontConfig) {
    const localeSchema = locales?.[locale]?.schema;

    switch (frontConfig.type) {
      case DATASET_DATA_TYPES.multioption.type:
        updateMultioptionField({
          schema,
          frontConfig,
          localeSchema,
        });
        break;
      case DATASET_DATA_TYPES.select.type:
        updateSelectField({ schema, localeSchema });
        break;
      case DATASET_DATA_TYPES.boolean.type:
        updateBooleanField({ schema, frontConfig, localeSchema });
        break;
      default:
        break;
    }
  }

  return { schema, ui };
};

export { transformFormDataToSchemaAndUi };
