import React, { useContext } from 'react';
import { Controller } from 'react-hook-form';
import { Box, Col, Grid, Text, DatePicker } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../context/DatasetItemDrawerContext';

const DateField = () => {
  const {
    contextRef: { messages, colSpans, gridColumn },
    form: {
      control,
      watch,
      formState: { errors },
    },
  } = useContext(DatasetItemDrawerContext);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <Grid columns={gridColumn} align="center">
        <Col span={colSpans[0]}>
          <Text strong color="primary" role="productive">
            {messages.fieldDateLabel}
          </Text>
        </Col>

        <Col span={colSpans[1] + colSpans[2]}>
          <Grid columns={100} align="center">
            <Col span={50}>
              <Grid columns={100} align="center">
                <Col span={20}>
                  <Text color="primary" role="productive">
                    {messages.fieldDateMinLabel}
                  </Text>
                </Col>
                <Col span={80}>
                  <Controller
                    name="config.minDate"
                    control={control}
                    render={({ field }) => <DatePicker {...field} />}
                  />
                </Col>
              </Grid>
            </Col>
            <Col span={50}>
              <Grid columns={100} align="center">
                <Col span={20}>
                  <Text color="primary" role="productive">
                    {messages.fieldDateMaxLabel}
                  </Text>
                </Col>
                <Col span={80}>
                  <Controller
                    name="config.maxDate"
                    control={control}
                    render={({ field }) => <DatePicker {...field} />}
                  />
                </Col>
              </Grid>
            </Col>
          </Grid>
        </Col>
      </Grid>
    </Box>
  );
};

export { DateField };
