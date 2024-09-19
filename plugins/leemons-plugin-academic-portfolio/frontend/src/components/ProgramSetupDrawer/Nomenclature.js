import React, { useMemo } from 'react';
import { Controller, useWatch } from 'react-hook-form';

import { ContextContainer, TextInput, Stack } from '@bubbles-ui/components';
import { useLocale } from '@common/LocaleDate';
import AddCustomTranslationDrawer from '@multilanguage/components/AddCustomTranslationDrawer';
import { useQueryClient } from '@tanstack/react-query';
import { cloneDeep, isEmpty, noop } from 'lodash';
import PropTypes from 'prop-types';

import getTranslationKeyPrefixes from '@academic-portfolio/helpers/getTranslationKeyPrefixes';
import useSetProgramCustomTranslationKeys from '@academic-portfolio/hooks/mutations/useSetProgramCustomTranslationKeys';
import useProgramNomenclature from '@academic-portfolio/hooks/queries/useProgramNomenclature';

const blockPath = 'nomenclature.block';
const subjectPath = 'nomenclature.subject';

const Nomenclature = ({ labels, onSaveTranslations = noop, programId, form }) => {
  const userLocale = useLocale();
  const queryClient = useQueryClient();
  const {
    mutate: setProgramCustomTranslationKeys,
    isLoading: isSetProgramCustomTranslationKeysLoading,
  } = useSetProgramCustomTranslationKeys({
    successMessage: labels?.success?.set,
    successFollowUp: () => {
      const programDetailKey = [
        'programDetail',
        {
          program: programId,
          withClasses: false,
          showArchived: false,
          withStudentsAndTeachers: true,
        },
      ];
      queryClient.invalidateQueries(programDetailKey);
    },
  });

  const { data: nomenclatureData } = useProgramNomenclature({
    programId,
    allLocales: true,
    enabled: !!programId,
  });

  const {
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const formValues = useWatch({ control, name: 'nomenclature' });

  const getDuplicatedKeyError = (value, fieldName) => {
    if (!value?.trim()) return false;
    const values = getValues([blockPath, subjectPath]);
    const normalizedValue = value.trim().toLowerCase();

    return Object.entries(values).some(
      ([key, val]) => key !== fieldName && val && val.trim().toLowerCase() === normalizedValue
    )
      ? labels?.errors?.duplicatedKey ?? 'Error'
      : false;
  };

  // CUSTOM KEYS ------------------------------------------------------------------------- ||

  const customKeys = useMemo(() => {
    if (isEmpty(formValues)) return {};
    return Object.fromEntries(Object.entries(formValues).filter(([_, value]) => value));
  }, [formValues]);

  // HANDLERS ------------------------------------------------------------------------- ||

  const handleOnSaveTranslations = (translations) => {
    const needsUpdate = JSON.stringify(translations) !== JSON.stringify(nomenclatureData);

    // Handle translations to languages different than the user's locale directly here for an existing program
    // User locale changes are handled in ProgramSetupDrawer.js similarly as when a program is created
    if (programId && needsUpdate && !isEmpty(translations)) {
      setProgramCustomTranslationKeys({
        programId,
        prefix: getTranslationKeyPrefixes().PROGRAM,
        localizations: translations,
      });
    } else {
      onSaveTranslations(translations);
    }
  };

  // RENDER ------------------------------------------------------------------------- ||

  if (!form) return null;

  return (
    <ContextContainer title={labels?.title} id="container">
      <Stack sx={{ width: '33%' }} spacing={3} direction="column">
        <Controller
          name={blockPath}
          control={control}
          render={({ field }) => (
            <TextInput
              label={labels?.blockInputLabel}
              error={errors.nomenclature?.block?.message}
              {...field}
              onChange={(value) => {
                if (value) {
                  const validationError = getDuplicatedKeyError(value, blockPath);
                  if (validationError) setError(blockPath, { message: validationError });
                  else clearErrors(blockPath);
                } else {
                  clearErrors(blockPath);
                }

                field.onChange(value);
              }}
            />
          )}
        />

        <Controller
          name={subjectPath}
          control={control}
          render={({ field }) => (
            <TextInput
              label={labels?.subjectInputLabel}
              error={errors.nomenclature?.subject?.message}
              {...field}
              onChange={(value) => {
                if (value) {
                  const validationError = getDuplicatedKeyError(value, subjectPath);
                  if (validationError) setError(subjectPath, { message: validationError });
                  else clearErrors(subjectPath);
                } else {
                  clearErrors(subjectPath);
                }

                field.onChange(value);
              }}
            />
          )}
        />

        <AddCustomTranslationDrawer
          size="xl"
          keys={customKeys}
          onSave={handleOnSaveTranslations}
          disabled={errors.nomenclature?.block || errors.nomenclature?.subject}
          data={{ ...cloneDeep(nomenclatureData), [userLocale]: customKeys }}
          loading={isSetProgramCustomTranslationKeysLoading}
        />
      </Stack>
    </ContextContainer>
  );
};

Nomenclature.propTypes = {
  programId: PropTypes.string,
  labels: PropTypes.object,
  onSaveTranslations: PropTypes.func,
  form: PropTypes.object,
};

export default Nomenclature;
