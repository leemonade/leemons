import React, { useContext } from 'react';
import { get } from 'lodash';
import { Controller } from 'react-hook-form';
import { Box, Col, Grid, Text, TextInput } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../../context/DatasetItemDrawerContext';
import FieldConfigLocaleContext from '../context/FieldConfigLocale';

const Label = () => {
  const {
    contextRef: { messages, errorMessages, gridColumn, colSpans },
    form: {
      control,
      formState: { errors },
    },
  } = useContext(DatasetItemDrawerContext);
  const {
    currentLocale: { code },
    currentLocaleIsDefaultLocale,
  } = useContext(FieldConfigLocaleContext);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <Grid columns={gridColumn} align="center">
        <Col span={colSpans[0]}>
          <Text strong color="primary" role="productive">
            {messages.localeLabelLabel}
          </Text>
          <br />
          <Text role="productive">{messages.localeLabelDescription}</Text>
        </Col>

        <Col span={colSpans[1] + colSpans[2]}>
          <Controller
            name={`locales.${code}.schema.title`}
            control={control}
            rules={
              currentLocaleIsDefaultLocale
                ? {
                    required: errorMessages.localeLabelRequired,
                  }
                : {}
            }
            render={({ field }) => (
              <TextInput
                required={currentLocaleIsDefaultLocale}
                error={get(errors, `locales.${code}.schema.title`)}
                {...field}
              />
            )}
          />
        </Col>
      </Grid>
    </Box>
  );
};

export { Label };
