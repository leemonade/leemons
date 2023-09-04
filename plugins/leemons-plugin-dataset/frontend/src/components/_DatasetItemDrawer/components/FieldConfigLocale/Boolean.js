import React, { useContext } from 'react';
import { get } from 'lodash';
import { Controller } from 'react-hook-form';
import { Box, Col, Grid, Text, TextInput } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../context/DatasetItemDrawerContext';
import FieldConfigLocaleContext from './context/FieldConfigLocale';

const Boolean = () => {
  const {
    contextRef: { messages, errorMessages, selectOptions, gridColumn, colSpans },
    form: {
      control,
      watch,
      formState: { errors },
    },
  } = useContext(DatasetItemDrawerContext);

  const {
    currentLocale: { code },
  } = useContext(FieldConfigLocaleContext);

  const uiType = watch('config.uiType');

  let item = null;

  if (uiType !== 'radio') {
    item = (
      <Grid columns={gridColumn} align="center">
        <Col span={colSpans[0]}>
          <Text strong color="primary" role="productive">
            {messages.localeBooleanOptionLabel}
          </Text>
          <br />
          <Text role="productive">{messages.localeBooleanOptionDescription}</Text>
        </Col>

        <Col span={colSpans[1] + colSpans[2]}>
          <Controller
            name={`locales.${code}.schema.optionLabel`}
            control={control}
            render={({ field }) => (
              <TextInput error={get(errors, `locales.${code}.schema.optionLabel`)} {...field} />
            )}
          />
        </Col>
      </Grid>
    );
  } else {
    item = (
      <>
        <Grid columns={gridColumn} align="center">
          <Col span={colSpans[0]}>
            <Text strong color="primary" role="productive">
              {messages.localeBooleanYesLabel}
            </Text>
          </Col>

          <Col span={colSpans[1] + colSpans[2]}>
            <Controller
              name={`locales.${code}.schema.yesOptionLabel`}
              control={control}
              render={({ field }) => (
                <TextInput
                  error={get(errors, `locales.${code}.schema.yesOptionLabel`)}
                  {...field}
                />
              )}
            />
          </Col>
        </Grid>
        <Grid columns={gridColumn} align="center">
          <Col span={colSpans[0]}>
            <Text strong color="primary" role="productive">
              {messages.localeBooleanNoLabel}
            </Text>
          </Col>

          <Col span={colSpans[1] + colSpans[2]}>
            <Controller
              name={`locales.${code}.schema.noOptionLabel`}
              control={control}
              render={({ field }) => (
                <TextInput
                  error={get(errors, `locales.${code}.schema.yesOptionLabel`)}
                  {...field}
                />
              )}
            />
          </Col>
        </Grid>
      </>
    );
  }

  return <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>{item}</Box>;
};

export { Boolean };
