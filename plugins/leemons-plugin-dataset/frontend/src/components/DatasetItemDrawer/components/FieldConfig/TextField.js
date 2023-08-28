import React, { useContext } from 'react';
import { Controller } from 'react-hook-form';
import { Box, Checkbox } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../context/DatasetItemDrawerContext';
import { MinMax } from './common/MinMax';

const TextField = () => {
  const {
    contextRef: { messages },
    form: {
      control,
      formState: { errors },
    },
  } = useContext(DatasetItemDrawerContext);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <MinMax
        label={messages.fieldLengthLabel}
        minLabel={messages.fieldLengthMinLabel}
        maxLabel={messages.fieldLengthMaxLabel}
        min="config.minLength"
        max="config.maxLength"
      >
        <Controller
          name="config.onlyNumbers"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              label={messages.fieldLengthOnlyNumbersLabel}
              {...field}
            />
          )}
        />
      </MinMax>
    </Box>
  );
};

export { TextField };
