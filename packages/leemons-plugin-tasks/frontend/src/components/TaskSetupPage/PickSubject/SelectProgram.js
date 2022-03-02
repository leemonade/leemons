import React, { useEffect, useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { ContextContainer, Box } from '@bubbles-ui/components';
import { SelectProgram as APSelectProgram } from '@academic-portfolio/components';
import { SelectCenter } from '@users/components';

export default function SelectProgram({ errorMessages, labels, placeholders }) {
  const isFirstRender = useRef(true);
  const { control, watch } = useFormContext();

  const centerId = watch('center');

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <ContextContainer direction="row">
      {/* Center Selector - MUST COME FROM A PREVIOUS SCREEN */}
      <Box skipFlex>
        <Controller
          control={control}
          name="center"
          rules={{ required: errorMessages.center?.required }}
          render={({ field }) => (
            <SelectCenter
              {...field}
              label={labels?.center}
              placeholder={placeholders?.center}
              firstSelected
            />
          )}
        />
      </Box>
      {/* Program selector */}
      <Controller
        control={control}
        name="program"
        rules={{ required: errorMessages.program?.required }}
        render={({ field }) => (
          <APSelectProgram
            {...field}
            ensureIntegrity
            center={centerId}
            label={labels?.program}
            placeholder={placeholders?.program}
          />
        )}
      />
    </ContextContainer>
  );
}

SelectProgram.propTypes = {
  onChange: PropTypes.func,
  labels: PropTypes.object,
  placeholders: PropTypes.object,
  errorMessages: PropTypes.object,
};
