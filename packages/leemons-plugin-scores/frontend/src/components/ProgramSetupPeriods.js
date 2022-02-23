import React from 'react';
import { forEach } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import {
  Box,
  Button,
  CheckBoxGroup,
  ContextContainer,
  RadioGroup,
  Stack,
} from '@bubbles-ui/components';

export default function ProgramSetupPeriods({
  onNext,
  sharedData,
  setSharedData,
  labels,
  frequencyLabels,
  program,
}) {
  const defaultValues = {
    periodProgram: false,
    periodCourse: false,
    periodSubstage: false,
    periodFinal: null,
    ...sharedData,
  };

  function getFormDefaultValues() {
    const periods = [];
    if (defaultValues.periodProgram) {
      periods.push('periodProgram');
    }
    if (defaultValues.periodCourse) {
      periods.push('periodCourse');
    }
    if (defaultValues.periodSubstage) {
      periods.push('periodSubstage');
    }
    return {
      periods,
    };
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: getFormDefaultValues() });

  React.useEffect(() => {
    reset(getFormDefaultValues());
  }, [JSON.stringify(sharedData)]);

  const handleOnNext = (e) => {
    const data = { ...sharedData, ...e };
    defaultValues.periodFinal = data.periodFinal;
    forEach(data.periods, (p) => {
      defaultValues[p] = true;
    });
    setSharedData(defaultValues);
    onNext(defaultValues);
  };
  const datas = React.useMemo(() => {
    const response = {
      periods: [{ label: labels.periodProgramLabel, value: 'periodProgram' }],
      finalPeriods: [{ label: labels.finalPeriodProgramLabel, value: 'program' }],
    };
    if (program) {
      if (program.maxNumberOfCourses > 0) {
        response.periods.push({
          label: labels.periodCourseLabel.replace('{i}', program.maxNumberOfCourses),
          value: 'periodCourse',
        });
        response.finalPeriods.push({
          label: labels.finalPeriodCourseLabel,
          value: 'course',
        });
      }
      if (program.haveSubstagesPerCourse) {
        response.periods.push({
          label: labels.periodSubstageLabel
            .replace('{i}', program.numberOfSubstages)
            .replace('{x}', frequencyLabels[program.substagesFrequency]),
          value: 'periodSubstage',
        });
        response.finalPeriods.push({
          label: labels.finalPeriodSubstage,
          value: 'substage',
        });
      }
    }
    return response;
  }, [program]);

  return (
    <form onSubmit={handleSubmit(handleOnNext)}>
      <ContextContainer padded="vertical">
        <Box>
          <Controller
            control={control}
            name="periods"
            rules={{
              required: labels.periodsRequired,
              minLength: {
                value: 1,
                message: labels.periodsRequired,
              },
            }}
            render={({ field }) => (
              <CheckBoxGroup
                {...field}
                label={labels.title}
                description={labels.description}
                direction="column"
                data={datas.periods}
                error={errors.periods}
              />
            )}
          />
        </Box>
        <Box>
          <Controller
            control={control}
            name="periodFinal"
            rules={{
              required: labels.finalPeriodsRequired,
            }}
            render={({ field }) => (
              <RadioGroup
                {...field}
                label={labels.finalPeriodTitle}
                direction="column"
                data={datas.finalPeriods}
                error={errors.periodFinal}
              />
            )}
          />
        </Box>
        <Stack fullWidth justifyContent="end">
          <Button type="submit" rightIcon={<ChevRightIcon height={20} width={20} />}>
            {labels.next}
          </Button>
        </Stack>
      </ContextContainer>
    </form>
  );
}

ProgramSetupPeriods.propTypes = {
  onNext: PropTypes.func.isRequired,
  sharedData: PropTypes.object.isRequired,
  setSharedData: PropTypes.func.isRequired,
  labels: PropTypes.object.isRequired,
  program: PropTypes.object.isRequired,
  frequencyLabels: PropTypes.object.isRequired,
};

ProgramSetupPeriods.defaultProps = {
  setSharedData: () => {},
  onNext: () => {},
};
