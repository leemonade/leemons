import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Box, Checkbox, Group } from '@bubbles-ui/components';

function BranchBlockField({
  messages,
  errorMessages,
  form: {
    control,
    formState: { errors },
    watch,
    unregister,
  },
}) {
  useEffect(() => {
    const subscription = watch(({ limitCharacters }, { name }) => {
      if (name === 'limitCharacters') {
        if (!limitCharacters) {
          unregister('min');
          unregister('max');
        }
      }
    });
    return () => subscription.unsubscribe();
  });

  return (
    <Group grow align="start">
      <Box>
        <Controller
          name="limitCharacters"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Checkbox checked={field.value} label={messages.fieldLimitCharactersLabel} {...field} />
          )}
        />
      </Box>
      {watch('limitCharacters') ? (
        <Box>
          <Group grow align="start">
            <Box></Box>
            <Box></Box>
          </Group>
        </Box>
      ) : null}
    </Group>
  );
}

BranchBlockField.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  form: PropTypes.object,
};

export default BranchBlockField;
