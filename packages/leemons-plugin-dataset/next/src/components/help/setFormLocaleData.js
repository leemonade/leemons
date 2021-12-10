import * as _ from 'lodash';

const setFormLocaleData = ({ form, locale, schema, ui }) => {
  form.setValue(`locales.${locale}.schema.title`, _.get(schema, 'title', ''));
  form.setValue(`locales.${locale}.schema.description`, _.get(schema, 'description', ''));
  form.setValue(
    `locales.${locale}.schema.selectPlaceholder`,
    _.get(schema, 'selectPlaceholder', '')
  );
  form.setValue(`locales.${locale}.schema.optionLabel`, _.get(schema, 'optionLabel', ''));
  form.setValue(`locales.${locale}.schema.yesOptionLabel`, _.get(schema, 'yesOptionLabel', ''));
  form.setValue(`locales.${locale}.schema.noOptionLabel`, _.get(schema, 'noOptionLabel', ''));
  form.setValue(
    `locales.${locale}.schema.frontConfig.checkboxLabels`,
    _.get(schema, 'frontConfig.checkboxLabels', [])
  );

  form.setValue(`locales.${locale}.ui.ui:help`, _.get(ui, 'ui:help', ''));
};

export default setFormLocaleData;
