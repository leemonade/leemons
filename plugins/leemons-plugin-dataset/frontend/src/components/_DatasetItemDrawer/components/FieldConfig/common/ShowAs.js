import React, { useContext } from 'react';
import { get } from 'lodash';
import { Controller } from 'react-hook-form';
import { Col, Grid, Text, Select } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../../context/DatasetItemDrawerContext';

const ShowAs = ({ label, required, data, placeholder }) => {
  const {
    contextRef: { colSpans, gridColumn },
    form: {
      control,
      formState: { errors },
    },
  } = useContext(DatasetItemDrawerContext);

  return (
    <Grid columns={gridColumn} align="center">
      <Col span={colSpans[0]}>
        <Text strong color="primary" role="productive">
          {label}
        </Text>
      </Col>

      <Col span={colSpans[1]}>
        <Controller
          name="config.uiType"
          control={control}
          rules={{
            required: required,
          }}
          render={({ field }) => (
            <Select
              {...field}
              required
              error={get(errors, 'config.uiType')}
              data={data}
              placeholder={placeholder}
            />
          )}
        />
      </Col>
    </Grid>
  );
};

export { ShowAs };
