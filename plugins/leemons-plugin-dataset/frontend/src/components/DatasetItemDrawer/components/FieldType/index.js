import React, { useContext, useEffect } from 'react';
import { difference, forEach, get } from 'lodash';
import { Controller } from 'react-hook-form';
import { Box, Col, Grid, Select, Text } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../context/DatasetItemDrawerContext';
import { TextField } from './TextField';
import { CommonRequiredField } from './CommonRequiredField';

const fieldsByType = {
  text_field: ['config.masked', 'config.maxLength', 'config.minLength', 'config.onlyNumbers'],
  rich_text: ['config.maxLength', 'config.minLength'],
  number: [],
  date: ['config.minDate', 'config.maxDate'],
  email: [],
  phone: [],
  link: [],
  multioption: [
    'config.uiType',
    'config.minItems',
    'config.maxItems',
    'config.checkboxValues',
    `locales.{code}.schema.selectPlaceholder`,
    `locales.{code}.schema.frontConfig.checkboxLabels`,
  ],
  boolean: [
    'config.uiType',
    'config.initialStatus',
    `locales.{code}.schema.optionLabel`,
    `locales.{code}.schema.yesOptionLabel`,
    `locales.{code}.schema.noOptionLabel`,
  ],
  select: ['config.checkboxValues'],
  user: ['config.center', 'config.profile'],
};
const configFieldTypes = {
  text_field: <TextField />,
  rich_text: <CommonRequiredField />,
  number: <CommonRequiredField />,
  date: <CommonRequiredField />,
  email: <CommonRequiredField />,
  phone: <CommonRequiredField />,
  link: <CommonRequiredField />,
  multioption: <CommonRequiredField />,
  boolean: <CommonRequiredField />,
  select: <CommonRequiredField />,
  user: <CommonRequiredField />,
  default: null,
};

const FieldType = () => {
  const {
    contextRef: { messages, errorMessages, locales, selectOptions, colSpans, gridColumn },
    form: {
      watch,
      control,
      unregister,
      setValue,
      formState: { errors },
    },
  } = useContext(DatasetItemDrawerContext);

  const fieldType = watch('config.type');

  useEffect(() => {
    const subscription = watch(({ config: { type } }, { name }) => {
      if (name === 'config.type' && type !== fieldType) {
        const oldFields = fieldsByType[fieldType] || [];
        const newFields = fieldsByType[type] || [];
        const fieldsToRemove = difference(oldFields, newFields);
        forEach(fieldsToRemove, (field) => {
          if (field.indexOf('{code}')) {
            forEach(locales, ({ code }) => {
              unregister(field.replace('{code}', code));
            });
          } else {
            unregister(field);
          }
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [fieldType]);

  return (
    <Box>
      <Grid columns={gridColumn} align="center">
        <Col span={colSpans[0]}>
          <Text strong color="primary" role="productive">
            {messages.fieldTypeLabel}
          </Text>
        </Col>
        <Col span={colSpans[1]}>
          <Controller
            name="config.type"
            control={control}
            rules={{
              required: errorMessages.fieldTypeRequired,
            }}
            render={({ field }) => (
              <Select
                {...field}
                required
                error={get(errors, 'config.type')}
                data={selectOptions.fieldTypes}
                placeholder={messages.fieldTypePlaceholder}
              />
            )}
          />
        </Col>
        <Col span={colSpans[2]}>
          {configFieldTypes[fieldType] ? configFieldTypes[fieldType] : configFieldTypes.default}
        </Col>
      </Grid>
    </Box>
  );
};

export { FieldType };
