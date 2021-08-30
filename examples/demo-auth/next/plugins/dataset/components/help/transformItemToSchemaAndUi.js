import * as _ from 'lodash';
import datasetDataTypes from '../../helpers/datasetDataTypes';

const transformItemToSchemaAndUi = (item, locale) => {
  let schema = { frontConfig: _.cloneDeep(item.frontConfig) };
  let ui = {};

  if (item) {
    const { frontConfig, locales } = item;
    if (frontConfig) {
      // Text Field
      if (frontConfig.type === datasetDataTypes.textField.type) {
        schema.type = 'string';
        if (frontConfig.masked) {
          ui['ui:widget'] = 'password';
        }
        if (frontConfig.onlyNumbers) {
          schema.format = 'numbers';
        }
      }
      // Rich Text
      if (frontConfig.type === datasetDataTypes.richText.type) {
        schema.type = 'string';
        ui['ui:widget'] = 'textarea';
      }

      // Text Field / Rich Text
      if (
        frontConfig.type === datasetDataTypes.textField.type ||
        frontConfig.type === datasetDataTypes.richText.type
      ) {
        if (frontConfig.minLength) {
          schema.minLength = parseInt(frontConfig.minLength);
          schema.frontConfig.minLength = parseInt(frontConfig.minLength);
        }
        if (frontConfig.maxLength) {
          schema.maxLength = parseInt(frontConfig.maxLength);
          schema.frontConfig.maxLength = parseInt(frontConfig.maxLength);
        }
      }

      // Number
      if (frontConfig.type === datasetDataTypes.number.type) {
        schema.type = 'number';
      }

      // Phone
      if (frontConfig.type === datasetDataTypes.phone.type) {
        schema.type = 'string';
        schema.format = 'phone';
      }

      // Email
      if (frontConfig.type === datasetDataTypes.email.type) {
        schema.type = 'string';
        schema.format = 'email';
      }

      // URL
      if (frontConfig.type === datasetDataTypes.link.type) {
        schema.type = 'string';
        schema.format = 'uri';
      }

      // Archive
      /*
      if (frontConfig.type === datasetDataTypes.archive.type) {
        schema.type = 'string';
        schema.format = 'data-url';
      }
      */

      // Boolean
      if (frontConfig.type === datasetDataTypes.boolean.type) {
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
      if (frontConfig.type === datasetDataTypes.date.type) {
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
      if (frontConfig.type === datasetDataTypes.multioption.type) {
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

      // Multioption / Select
      if (
        frontConfig.type === datasetDataTypes.select.type ||
        frontConfig.type === datasetDataTypes.multioption.type
      ) {
        if (locale && locales && locales[locale] && locales[locale].schema.frontConfig) {
          const schemaKeys = _.map(schema.frontConfig.checkboxValues, 'key');
          _.forEachRight(locales[locale].schema.frontConfig.checkboxLabels, ({ key }, index) => {
            if (schemaKeys.indexOf(key) < 0) {
              locales[locale].schema.frontConfig.checkboxLabels.splice(index, 1);
            }
          });
        }
      }
    }

    if (locale && locales && locales[locale]) {
      schema = _.merge(_.cloneDeep(schema), _.cloneDeep(locales[locale].schema));
      ui = { ...ui, ...locales[locale].ui };
    }

    if (frontConfig) {
      // Boolean
      if (
        frontConfig.type === datasetDataTypes.boolean.type &&
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
      if (frontConfig.type === datasetDataTypes.multioption.type) {
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
          const checkLocalesByKey = _.keyBy(
            locales[locale].schema.frontConfig.checkboxLabels,
            'key'
          );
          _.forEach(schema.frontConfig.checkboxValues, ({ key, value }) => {
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
      if (frontConfig.type === datasetDataTypes.select.type) {
        schema.type = 'string';
        schema.enum = [];
        schema.enumNames = [];
        if (locale && locales && locales[locale] && locales[locale].schema.frontConfig) {
          const checkLocalesByKey = _.keyBy(
            locales[locale].schema.frontConfig.checkboxLabels,
            'key'
          );
          _.forEach(schema.frontConfig.checkboxValues, ({ key, value }) => {
            schema.enum.push(value);
            schema.enumNames.push(checkLocalesByKey[key] ? checkLocalesByKey[key].label : ' ');
          });
        }
      }
    }
  }

  return { schema, ui };
};

export default transformItemToSchemaAndUi;
