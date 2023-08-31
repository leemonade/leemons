import React, { useContext, useMemo } from 'react';
import { cloneDeep, findIndex, get } from 'lodash';
import { Controller } from 'react-hook-form';
import { Box, Col, Grid, Text, Select } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../context/DatasetItemDrawerContext';
import { ShowAs } from './common/ShowAs';

const BooleanField = () => {
  const {
    contextRef: { messages, errorMessages, selectOptions, gridColumn, colSpans },
    form: {
      control,
      watch,
      formState: { errors },
    },
  } = useContext(DatasetItemDrawerContext);

  const uiType = watch('config.uiType');

  const initialStateData = useMemo(() => {
    let result = [];
    if (uiType) {
      result = cloneDeep(selectOptions.fieldBooleanInitialState);
      if (uiType !== 'radio') {
        const index = findIndex(result, { value: '-' });
        if (index > -1) {
          result.splice(index, 1);
        }
      }
    }
    return result;
  }, [uiType]);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <ShowAs
        label={messages.booleanShowAsLabel}
        required={errorMessages.booleanShowAsRequired}
        data={selectOptions.fieldBooleanShowAs}
        placeholder={messages.fieldBooleanShowAsPlaceholder}
      />
      <Grid columns={gridColumn} align="center">
        <Col span={colSpans[0]}>
          <Text strong color="primary" role="productive">
            {messages.booleanInitialStateLabel}
          </Text>
        </Col>

        <Col span={colSpans[1]}>
          <Controller
            name="config.initialStatus"
            control={control}
            rules={{
              required: errorMessages.booleanInitialStateRequired,
            }}
            render={({ field }) => (
              <Select
                {...field}
                required
                error={get(errors, 'config.initialStatus')}
                data={initialStateData}
                placeholder={messages.booleanInitialStateLabelPlaceholder}
              />
            )}
          />
        </Col>
      </Grid>
    </Box>
  );
};

export { BooleanField };
