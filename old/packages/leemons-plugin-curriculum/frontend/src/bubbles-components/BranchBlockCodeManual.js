import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Box, Group, NumberInput, Checkbox } from '@bubbles-ui/components';

function BranchBlockCodeManual({
  messages,
  errorMessages,
  form: {
    control,
    formState: { errors },
    watch,
  },
}) {
  return (
    <Group grow align="start">
      <Box>
        <Controller
          name="limitCharacters"
          control={control}
          defaultValue={false}
          render={({ field }) => <Checkbox label={messages.fieldLimitCharactersLabel} {...field} />}
        />
      </Box>
      {watch('limitCharacters') ? (
        <Box>
          <Group grow align="start">
            <Box>
              <Controller
                name="min"
                control={control}
                rules={{
                  required: errorMessages.fieldMinRequired,
                }}
                render={({ field }) => (
                  <NumberInput
                    label={messages.fieldMinLabel}
                    placeholder={messages.fieldMinPlaceholder}
                    error={errors.min?.message}
                    required
                    {...field}
                  />
                )}
              />
            </Box>
            <Box>
              <Controller
                name="max"
                control={control}
                rules={{
                  required: errorMessages.fieldMaxRequired,
                }}
                render={({ field }) => (
                  <NumberInput
                    label={messages.fieldMaxLabel}
                    placeholder={messages.fieldMaxPlaceholder}
                    error={errors.max?.message}
                    required
                    {...field}
                  />
                )}
              />
            </Box>
          </Group>
        </Box>
      ) : null}
    </Group>
  );
}

BranchBlockCodeManual.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  form: PropTypes.object,
};

export default BranchBlockCodeManual;
