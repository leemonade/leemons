import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';

import { createStyles, Box, Select, Title } from '@bubbles-ui/components';
import ConditionalInput from '@tasks/components/Inputs/ConditionalInput';
import PropTypes from 'prop-types';


import { Container } from '../Container';

import { CurriculumFieldsPicker } from './CurriculumFieldsPicker';
import { useCurriculumFields } from './useCurriculumFields';

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

function useOnChange({ control, setValue, onChange, types }) {
  const { type, showCurriculum, curriculum } = useWatch({ control });

  React.useEffect(() => {
    if (typeof onChange !== 'function') {
      return;
    }

    if (!type) {
      setValue('type', types?.[0]?.value);
    }

    onChange({
      evaluation: evaluationTypes[type] ?? evaluationTypes[types?.[0]?.value],
      curriculum: showCurriculum ? curriculum ?? [] : [],
      raw: { type: type || types?.[0]?.value, showCurriculum, curriculum },
    });
  }, [type, showCurriculum, curriculum, onChange, types, setValue]);
}

export const useEvaluationTypeStyles = createStyles((theme) => ({
  root: {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.padding.xlg,
  },
  selectType: {
    maxWidth: 200,
    minWidth: 200,
  },
}));

export function EvaluationType({
  localizations,
  assignable,
  hidden,
  value,
  onChange,
  evaluationTypes: evaluationTypesToUse,
  isInvitedTeacher,
  hideSectionHeaders,
  hideDivider,
  onDrawer,
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

    if (isInvitedTeacher) {
      return evaluationTypes.filter(({ value: v }) => v !== 'calificable');
    }

    if (!evaluationTypesToUse?.length) {
      return evaluationTypes;
    }

    return evaluationTypes.filter(({ value: v }) => evaluationTypesToUse.includes(v));
  }, [localizations?.typeInput?.options, JSON.stringify(evaluationTypesToUse), isInvitedTeacher]);

  const { control, setValue } = useForm({
    defaultValues: {
      type: evaluationTypesToUse?.[0] || 'calificable',
      ...value?.raw,
    },
  });

  const curriculumFields = useCurriculumFields({ assignable });

  useOnChange({ control, setValue, onChange, types });

  const { classes } = useEvaluationTypeStyles();
  return (
    <Container
      title={<Title order={onDrawer ? 4 : 3}>{localizations?.title}</Title>}
      // description={!onDrawer && localizations?.description}
      hidden={hidden}
      hideSectionHeaders={hideSectionHeaders}
      hideDivider={hideDivider}
      spacingBottom={16}
    >
      <Box className={classes.root}>
        <Controller
          name="type"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <Box className={classes.selectType}>
              <Select
                {...field}
                required
                label={localizations?.typeInput?.label}
                placeholder={localizations?.typeInput?.placeholder}
                cleanOnMissingValue
                data={types}
              />
            </Box>
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
  onDrawer: PropTypes.bool,
};
EvaluationType.defaultProps = {
  onDrawer: false,
};
