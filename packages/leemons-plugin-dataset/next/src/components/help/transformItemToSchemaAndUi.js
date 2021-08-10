import datasetDataTypes from '../../helpers/datasetDataTypes';

const transformItemToSchemaAndUi = (item, locale) => {
  let schema = { frontConfig: item.frontConfig };
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
          schema.type = 'number';
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
    }

    if (locale && locales && locales[locale]) {
      schema = { ...schema, ...locales[locale].schema };
      ui = { ...ui, ...locales[locale].ui };
    }
  }

  return { schema, ui };
};

export default transformItemToSchemaAndUi;
