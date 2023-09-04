import React, { useContext } from 'react';
import { get } from 'lodash';
import { Controller } from 'react-hook-form';
import { Box, Col, Grid, Text, NumberInput } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../../context/DatasetItemDrawerContext';

const MinMax = ({ label, minLabel, maxLabel, min, max, children }) => {
  const {
    contextRef: { colSpans, gridColumn },
    form: {
      control,
      formState: { errors },
    },
  } = useContext(DatasetItemDrawerContext);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <Grid columns={gridColumn} align="center">
        <Col span={colSpans[0]}>
          <Text strong color="primary" role="productive">
            {label}
          </Text>
        </Col>

        <Col span={colSpans[1]}>
          <Grid columns={100} align="center">
            <Col span={50}>
              <Grid columns={100} align="center">
                <Col span={30}>
                  <Text color="primary" role="productive">
                    {minLabel}
                  </Text>
                </Col>
                <Col span={70}>
                  <Controller
                    name={min}
                    control={control}
                    render={({ field }) => <NumberInput error={get(errors, min)} {...field} />}
                  />
                </Col>
              </Grid>
            </Col>
            <Col span={50}>
              <Grid columns={100} align="center">
                <Col span={30}>
                  <Text color="primary" role="productive">
                    {maxLabel}
                  </Text>
                </Col>
                <Col span={70}>
                  <Controller
                    name={max}
                    control={control}
                    render={({ field }) => <NumberInput error={get(errors, max)} {...field} />}
                  />
                </Col>
              </Grid>
            </Col>
          </Grid>
        </Col>
        <Col span={colSpans[2]}>{children}</Col>
      </Grid>
    </Box>
  );
};

export { MinMax };
