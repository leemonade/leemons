import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { ContextContainer, Box } from '@bubbles-ui/components';
import { SelectProgram as APSelectProgram } from '@academic-portfolio/components';
import { SelectCenter } from '@users/components';

export default function SelectProgram({ errorMessages, labels, placeholders, required }) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const centerId = watch('center');

  return (
    <ContextContainer direction="row">
      {/* Center Selector - MUST COME FROM A PREVIOUS SCREEN */}
      <Box>
        <Controller
          control={control}
          name="center"
          rules={{ required: required && errorMessages?.center?.required }}
          render={({ field }) => (
            <SelectCenter
              {...field}
              label={labels?.center}
              placeholder={placeholders?.center}
              error={errors?.center}
            />
          )}
        />
      </Box>
      {/* Program selector */}
      {
        <Controller
          control={control}
          name="program"
          rules={{ required: required && errorMessages?.program?.required }}
          render={({ field }) => (
            <APSelectProgram
              {...field}
              ensureIntegrity
              center={centerId}
              label={labels?.program}
              placeholder={placeholders?.program}
              error={errors?.program}
            />
          )}
        />
      }
    </ContextContainer>
  );
}

SelectProgram.propTypes = {
  onChange: PropTypes.func,
  labels: PropTypes.object,
  placeholders: PropTypes.object,
  errorMessages: PropTypes.object,
  required: PropTypes.bool,
};
