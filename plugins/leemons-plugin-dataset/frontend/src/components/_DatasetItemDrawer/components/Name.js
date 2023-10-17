import React, { useContext } from 'react';
import { get } from 'lodash';
import { Controller } from 'react-hook-form';
import { Box, TextInput } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../context/DatasetItemDrawerContext';

const Name = () => {
  const {
    contextRef: { messages, errorMessages },
    form: {
      control,
      formState: { errors },
    },
  } = useContext(DatasetItemDrawerContext);

  return (
    <Box>
      <Controller
        name="config.name"
        control={control}
        rules={{
          required: errorMessages.nameRequired,
        }}
        render={({ field }) => (
          <TextInput
            placeholder={messages.namePlaceholder}
            error={get(errors, 'config.name')}
            required
            {...field}
          />
        )}
      />
    </Box>
  );
};

export { Name };
