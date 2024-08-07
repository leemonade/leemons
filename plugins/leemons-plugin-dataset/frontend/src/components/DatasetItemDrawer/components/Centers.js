import React, { useContext } from 'react';
import { get } from 'lodash';
import { Controller } from 'react-hook-form';
import { Box, Col, Grid, Text, MultiSelect } from '@bubbles-ui/components';
import { DatasetItemDrawerContext } from '../context/DatasetItemDrawerContext';

const CONFIG_CENTERS = 'config.centers';

const Centers = () => {
  const {
    contextRef: { messages, errorMessages, selectOptions, colSpans, gridColumn },
    form: {
      setValue,
      control,
      formState: { errors },
    },
  } = useContext(DatasetItemDrawerContext);

  function onChange(newValue) {
    const index = newValue.indexOf('*');
    if (index > 0) {
      setValue(CONFIG_CENTERS, ['*']);
      setValue('config.isAllCenterMode', true);
    } else {
      if (index === 0) newValue.splice(index, 1);
      setValue(CONFIG_CENTERS, newValue);
      setValue('config.isAllCenterMode', false);
    }
  }

  return (
    <Box>
      <Grid columns={gridColumn} align="center">
        <Col span={colSpans[0]}>
          <Text strong color="primary" role="productive">
            {messages.centerLabel}
          </Text>
        </Col>
        <Col span={colSpans[1]}>
          <Controller
            name={CONFIG_CENTERS}
            control={control}
            rules={{
              required: errorMessages.nameRequired,
            }}
            render={({ field }) => (
              <MultiSelect
                {...field}
                required
                error={get(errors, CONFIG_CENTERS)}
                data={selectOptions.centers}
                onChange={onChange}
              />
            )}
          />
        </Col>
      </Grid>
    </Box>
  );
};

export { Centers };
