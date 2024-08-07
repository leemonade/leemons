import React from 'react';
import PropTypes from 'prop-types';
import { createStyles, Box, Select, Title } from '@bubbles-ui/components';
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
  }, [type, showCurriculum, curriculum, onChange]);
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
          render={({ field }) => (
            <Box className={classes.selectType}>
              <Select
                {...field}
                label={localizations?.typeInput?.label}
                placeholder={localizations?.typeInput?.placeholder}
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
