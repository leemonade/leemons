import React from 'react';
import PropTypes from 'prop-types';
import { createStyles, Box, Select } from '@bubbles-ui/components';
import ConditionalInput from '@tasks/components/Inputs/ConditionalInput';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Container } from '../Container';
import { useCurriculumFields } from './useCurriculumFields';
import { CurriculumFieldsPicker } from './CurriculumFieldsPicker';

export const evaluationTypes = {
  calificable: {
    gradable: true,
    requiresScoring: true,
    allowFeedback: true,
  },
  punctuable: {
    gradable: false,
    requiresScoring: true,
    allowFeedback: true,
  },
  feedbackOnly: {
    gradable: false,
    requiresScoring: false,
    allowFeedback: true,
  },
  nonEvaluable: {
    gradable: false,
    requiresScoring: false,
    allowFeedback: false,
  },
};

function useOnChange({ control, onChange }) {
  const { type, showCurriculum, curriculum } = useWatch({ control });

  React.useEffect(() => {
    if (typeof onChange !== 'function') {
      return;
    }

    onChange({
      evaluation: evaluationTypes[type],
      curriculum: showCurriculum ? curriculum ?? [] : [],
      raw: { type, showCurriculum, curriculum },
    });
  }, [type, showCurriculum, curriculum]);
}

export const useEvaluationTypeStyles = createStyles((theme) => ({
  root: {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.padding.xlg,
  },
}));

export function EvaluationType({
  localizations,
  assignable,
  hidden,
  value,
  onChange,
  evaluationTypes: evaluationTypesToUse,
  hideSectionHeaders,
  hideDivider,
}) {
  const types = React.useMemo(() => {
    const evaluationTypes = [
      {
        value: 'calificable',
        label: localizations?.typeInput?.options?.calificable,
      },
      {
        value: 'punctuable',
        label: localizations?.typeInput?.options?.punctuable,
      },
      {
        value: 'feedbackOnly',
        label: localizations?.typeInput?.options?.feedbackOnly,
      },
      {
        value: 'nonEvaluable',
        label: localizations?.typeInput?.options?.nonEvaluable,
      },
    ];

    if (!evaluationTypesToUse?.length) {
      return evaluationTypes;
    }

    return evaluationTypes.filter(({ value: v }) => evaluationTypesToUse.includes(v));
  }, [localizations?.typeInput?.options, JSON.stringify(evaluationTypesToUse)]);

  const { control } = useForm({
    defaultValues: {
      type: evaluationTypesToUse?.[0] || 'calificable',
      ...value?.raw,
    },
  });

  const curriculumFields = useCurriculumFields({ assignable });

  useOnChange({ control, onChange });

  const { classes } = useEvaluationTypeStyles();
  return (
    <Container
      title={localizations?.title}
      description={localizations?.description}
      hidden={hidden}
      hideSectionHeaders={hideSectionHeaders}
      hideDivider={hideDivider}
    >
      <Box className={classes.root}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label={localizations?.typeInput?.label}
              placeholder={localizations?.typeInput?.placeholder}
              data={types}
            />
          )}
        />
        {!!curriculumFields?.length && (
          <Controller
            name="showCurriculum"
            control={control}
            shouldUnregister
            render={({ field }) => (
              <ConditionalInput
                {...field}
                checked={!!field.value}
                label={localizations?.showCurriculum}
                render={() => (
                  <Controller
                    name="curriculum"
                    control={control}
                    render={({ field: curriculumField }) => (
                      <CurriculumFieldsPicker
                        {...curriculumField}
                        curriculumFields={curriculumFields}
                      />
                    )}
                  />
                )}
              />
            )}
          />
        )}
      </Box>
    </Container>
  );
}

EvaluationType.propTypes = {
  localizations: PropTypes.object,
  assignable: PropTypes.object,
  hidden: PropTypes.bool,
  value: PropTypes.object,
  onChange: PropTypes.func,
  evaluationTypes: PropTypes.arrayOf('string'),
  hideSectionHeaders: PropTypes.bool,
  hideDivider: PropTypes.bool,
};
