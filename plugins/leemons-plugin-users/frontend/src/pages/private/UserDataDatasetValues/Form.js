import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { getValidateSchema } from '@bubbles-ui/leemons';
import { useFormWithTheme } from '@common/hooks/useFormWithTheme';

function Form({ data, hideReadOnly, formActions }) {
  const { jsonSchema, jsonUI, value } = data.data;

  const datasetProps = useMemo(() => ({ formData: value }), [JSON.stringify(value)]);
  const {schema, ui} = useMemo(() => {
    if(!hideReadOnly) {
      return {schema: jsonSchema, ui: jsonUI};
    }

    const ui = {...jsonUI};
    const readOnlyKeys = Object.keys(ui).filter((key) => ui[key]['ui:readonly']);
    const properties =  Object.keys(jsonSchema.properties).filter((key) => !readOnlyKeys.includes(key));
    const schema = {
      ...jsonSchema,
      // Remove all the readOnlyKeys on jsonSchema.properties
      properties: properties.reduce((acc, key) => {
        acc[key] = jsonSchema.properties[key];
        return acc;
      }, {}),
    };

    // Remove all the readOnlyKeys on jsonUI[key]
    readOnlyKeys.forEach((key) => {
      delete ui[key];
    });

    return {schema, ui};
  }, [JSON.stringify(jsonSchema), JSON.stringify(jsonUI), hideReadOnly]);

  const validateSchema = useMemo(() => getValidateSchema(schema), [schema]);

  const [form, actions] = useFormWithTheme(schema, ui, undefined, datasetProps, {
    customValidateSchema: validateSchema,
  });

  console.log('datasetProps:', datasetProps);

  formActions(actions);

  return <Box>{form}</Box>;
}

Form.propTypes = {
  data: PropTypes.object,
  hideReadOnly: PropTypes.bool,
  formActions: PropTypes.func,
};

export default Form;
