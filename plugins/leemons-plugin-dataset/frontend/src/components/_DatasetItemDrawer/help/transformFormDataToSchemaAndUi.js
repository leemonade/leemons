import { cloneDeep, forEach, merge } from 'lodash';
import { DATASET_DATA_TYPES } from '../DatasetItemDrawer';

const transformFormDataToSchemaAndUi = (_item, locale) => {
  const item = cloneDeep(_item);
  if (!item.frontConfig && !!item.config) {
    item.frontConfig = item.config;
    delete item.config;
  }
  let schema = { frontConfig: cloneDeep(item.frontConfig) };
  let ui = {};

  if (item) {
    const { frontConfig, locales } = item;
    if (frontConfig) {
      // Text Field
      if (frontConfig.type === DATASET_DATA_TYPES.textField.type) {
        schema.type = 'string';
        if (frontConfig.masked) {
          ui['ui:widget'] = 'password';
        }
        if (frontConfig.onlyNumbers) {
          schema.format = 'numbers';
        }
      }
      // Rich Text
      if (frontConfig.type === DATASET_DATA_TYPES.richText.type) {
        schema.type = 'string';
        ui['ui:widget'] = 'textarea';
      }

      // Text Field / Rich Text
      if (
        frontConfig.type === DATASET_DATA_TYPES.textField.type ||
        frontConfig.type === DATASET_DATA_TYPES.richText.type
      ) {
        if (frontConfig.minLength) {
          schema.minLength = parseInt(frontConfig.minLength, 10);
          schema.frontConfig.minLength = parseInt(frontConfig.minLength, 10);
        }
        if (frontConfig.maxLength) {
          schema.maxLength = parseInt(frontConfig.maxLength, 10);
          schema.frontConfig.maxLength = parseInt(frontConfig.maxLength, 10);
        }
      }

      // Number
      if (frontConfig.type === DATASET_DATA_TYPES.number.type) {
        schema.type = 'number';
      }

      // Phone
      if (frontConfig.type === DATASET_DATA_TYPES.phone.type) {
        schema.type = 'string';
        schema.format = 'phone';
      }

      // Email
      if (frontConfig.type === DATASET_DATA_TYPES.email.type) {
        schema.type = 'string';
        schema.format = 'email';
      }

      // URL
      if (frontConfig.type === DATASET_DATA_TYPES.link.type) {
        schema.type = 'string';
        schema.format = 'uri';
      }

      // Archive
      /*
      if (frontConfig.type === DATASET_DATA_TYPES.archive.type) {
        schema.type = 'string';
        schema.format = 'data-url';
      }
      */

      // Boolean
      if (frontConfig.type === DATASET_DATA_TYPES.boolean.type) {
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
      }

      // Date
      if (frontConfig.type === DATASET_DATA_TYPES.date.type) {
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
      }

      // Multioption
      if (frontConfig.type === DATASET_DATA_TYPES.multioption.type) {
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
      }
    }
    if (locale && locales && locales[locale]) {
      schema = merge(cloneDeep(schema), cloneDeep(locales[locale].schema));
      ui = { ...ui, ...locales[locale].ui };
    }

    if (frontConfig) {
      // Boolean
      if (
        frontConfig.type === DATASET_DATA_TYPES.boolean.type &&
        locale &&
        locales &&
        locales[locale] &&
        locales[locale].schema
      ) {
        if (frontConfig.uiType === 'radio') {
          schema.enumNames = [
            locales[locale].schema.yesOptionLabel,
            locales[locale].schema.noOptionLabel,
          ];
        }
      }
      // Multioption
      if (frontConfig.type === DATASET_DATA_TYPES.multioption.type) {
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
        if (locale && locales && locales[locale] && locales[locale].schema.frontConfig) {
          const checkLocalesByKey = locales[locale].schema.frontConfig.checkboxLabels;
          forEach(schema.frontConfig.checkboxValues, ({ key, value }) => {
            schema.items.enum.push(value);
            schema.items.enumNames.push(
              checkLocalesByKey[key] ? checkLocalesByKey[key].label : ' '
            );
          });
        }
        if (frontConfig.uiType === 'radio') {
          schema.type = 'string';
          schema.enum = schema.items.enum;
          schema.enumNames = schema.items.enumNames;
          delete schema.items;
        }
      }

      // Select
      if (frontConfig.type === DATASET_DATA_TYPES.select.type) {
        schema.type = 'string';
        schema.enum = [];
        schema.enumNames = [];
        if (locale && locales && locales[locale] && locales[locale].schema.frontConfig) {
          const checkLocalesByKey = locales[locale].schema.frontConfig.checkboxLabels;
          forEach(schema.frontConfig.checkboxValues, ({ key, value }) => {
            schema.enum.push(value);
            schema.enumNames.push(checkLocalesByKey[key] ? checkLocalesByKey[key].label : ' ');
          });
        }
      }

      // User
      if (frontConfig.type === DATASET_DATA_TYPES.user.type) {
        schema.type = 'string';
      }
    }
  }

  return { schema, ui };
};

export { transformFormDataToSchemaAndUi };
