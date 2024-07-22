import React, { useContext, useMemo } from 'react';
import { isFunction } from 'lodash';
import { Box, Paper, Title } from '@bubbles-ui/components';
import { useFormWithTheme } from '@common/hooks/useFormWithTheme';
import { DatasetItemDrawerContext } from '../context/DatasetItemDrawerContext';
import { transformFormDataToSchemaAndUi } from '../help/transformFormDataToSchemaAndUi';

export const Preview = () => {
  const pName = '------------';
  const {
    contextRef: { selectedLocale, formWithTheme, messages },
    classes,
    form: { getValues, watch },
  } = useContext(DatasetItemDrawerContext);

  const state = useMemo(() => {
    const item = transformFormDataToSchemaAndUi(getValues(), selectedLocale);
    const schema = {
      type: 'object',
      properties: {
        [pName]: item.schema,
      },
      required: [],
    };
    if (item.schema?.frontConfig?.required) {
      schema.required.push(pName);
    }
    const ui = {
      [pName]: item.ui,
    };
    return {
      schema,
      ui,
    };
  }, [watch(), selectedLocale]);

  const data = null;
  const props = useMemo(() => ({ formData: data }), [data]);
  const func = isFunction(formWithTheme) ? formWithTheme : useFormWithTheme;
  const [form] = func(state.schema, state.ui, undefined, props);

  return (
    <>
      <Box
        sx={(theme) => ({
          textAlign: 'center',
          marginBottom: theme.spacing[13],
          marginTop: theme.spacing[5],
        })}
      >
        <Title className={classes.previewTitle} order={6}>
          {messages.previewLabel}
        </Title>
      </Box>
      <Box
        sx={(theme) => ({
          width: '100%',
          padding: theme.spacing[5],
        })}
      >
        <Paper className={classes.preview}>{form}</Paper>
      </Box>
    </>
  );
};

export default Preview;
