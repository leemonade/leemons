import React, { useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { ContextContainer } from '@bubbles-ui/components';
import { SelectProgram as APSelectProgram } from '@academic-portfolio/components';
import { getCentersWithToken } from '@users/session';

export default function SelectProgram({ errorMessages, labels, placeholders, required }) {
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  const centerId = useMemo(() => {
    const savedCenter = getValues('center');

    if (savedCenter) {
      return savedCenter;
    }

    const centers = getCentersWithToken();
    const { id } = centers[0];
    // EN: There should be only one center.
    // ES: Debe haber solo un centro.
    setValue('center', id);
    return id;
  }, []);

  return (
    <ContextContainer direction="row">
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
