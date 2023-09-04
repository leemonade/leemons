import React, { useContext } from 'react';
import { Controller } from 'react-hook-form';
import { Box, Col, Grid, Text, MultiSelect } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../context/DatasetItemDrawerContext';

const UserField = () => {
  const {
    contextRef: { messages, selectOptions, gridColumn, colSpans },
    form: { control, unregister },
  } = useContext(DatasetItemDrawerContext);

  function onChange(newValue, onchange) {
    const index = newValue.indexOf('*');
    if (index > 0) {
      onchange([]);
    } else {
      if (index === 0) newValue.splice(index, 1);
      onchange(newValue);
    }
  }

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <Grid columns={gridColumn} align="center">
        <Col span={colSpans[0]}>
          <Text strong color="primary" role="productive">
            {messages.userCentersLabel}
          </Text>
          <br />
          <Text role="productive">{messages.userCentersDescription}</Text>
        </Col>

        <Col span={colSpans[1]}>
          <Controller
            name="config.center"
            control={control}
            render={({ field: { value, ...field } }) => (
              <MultiSelect
                {...field}
                value={!value || value.length === 0 ? ['*'] : value}
                required
                data={selectOptions.userCenters}
                onChange={(e) => onChange(e, field.onChange)}
              />
            )}
          />
        </Col>
      </Grid>

      <Grid columns={gridColumn} align="center">
        <Col span={colSpans[0]}>
          <Text strong color="primary" role="productive">
            {messages.userProfileLabel}
          </Text>
          <br />
          <Text role="productive">{messages.userProfileDescription}</Text>
        </Col>

        <Col span={colSpans[1]}>
          <Controller
            name="config.profile"
            control={control}
            render={({ field: { value, ...field } }) => (
              <MultiSelect
                {...field}
                value={!value || value.length === 0 ? ['*'] : value}
                required
                data={selectOptions.userProfiles}
                onChange={(e) => onChange(e, field.onChange)}
              />
            )}
          />
        </Col>
      </Grid>
    </Box>
  );
};

export { UserField };
