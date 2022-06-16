import React, { useMemo } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { unflatten } from '@common';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ContextContainer,
  DatePicker,
  Grid,
  InputWrapper,
  Radio,
  RadioGroup,
  Switch,
  Text,
  Tooltip,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { TextEditorInput } from '@bubbles-ui/editors';

// TODO: Move to assignables
import ConditionalInput from '@tasks/components/Inputs/ConditionalInput';
import TimeUnitsInput from '@tasks/components/Inputs/TimeUnitsInput';
import prefixPN from '../../helpers/prefixPN';
import AssignStudents from './AssignStudents';

function GradeVariation({
  onChange,
  value,
  variations = ['calificable', 'punctuation-evaluable', 'evaluable', 'no-evaluable'],
  labels,
}) {
  const data = useMemo(
    () =>
      [
        {
          label: labels?.calificable?.label,
          description: labels?.calificable?.description,
          value: 'calificable',
          variation: {
            gradable: true,
            requiresScoring: true,
            allowFeedback: true,
          },
        },
        {
          label: labels?.punctuationEvaluable?.label,
          description: labels?.punctuationEvaluable?.description,
          value: 'punctuation-evaluable',
          variation: {
            gradable: false,
            requiresScoring: true,
            allowFeedback: true,
          },
        },
        {
          label: labels?.evaluable?.label,
          description: labels?.evaluable?.description,
          value: 'evaluable',
          variation: {
            gradable: false,
            requiresScoring: false,
            allowFeedback: true,
          },
        },
        {
          label: labels?.notEvaluable?.label,
          description: labels?.notEvaluable?.description,
          value: 'no-evaluable',
          variation: {
            gradable: false,
            requiresScoring: false,
            allowFeedback: false,
          },
        },
      ].filter((variation) => variations.includes(variation.value)),
    [labels, ...variations]
  );

  const selectedValue = useMemo(() => {
    if (value) {
      const found = data.find(({ variation: v }) => _.isEqual(v, value));

      if (found) {
        return found.value;
      }
    }

    onChange(data[0].variation);
    return data[0].value;
  }, [JSON.stringify(value)]);

  if (data?.length <= 1) {
    return null;
  }

  return (
    <RadioGroup
      label={labels?.title}
      direction="column"
      data={data.map(({ label, description, value: v }) => ({
        label: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <Text color="primary">{label}</Text>
            <Text color="secondary">{description}</Text>
          </Box>
        ),
        description,
        value: v,
      }))}
      value={selectedValue}
      onChange={(newValue) => {
        const newVariation = data.find(({ value: v }) => newValue === v)?.variation;

        onChange(newVariation);
      }}
    />
  );
}

export default function Form({
  defaultValues = {},
  onSubmit: parentSubmit,
  assignable,
  sendButton,
  variations,
}) {
  const [, translations] = useTranslateLoader(prefixPN('assignment_form'));
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...defaultValues,
      gradeVariation: {
        gradable: defaultValues?.gradable,
        requiresScoring: defaultValues?.requiresScoring,
        allowFeedback: defaultValues?.allowFeedback,
      },
    },
  });

  const {
    labels,
    placeholders,
    descriptions,
    assignTo,
    modes,
    gradeVariation: gradeVariationLabels,
  } = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins.assignables.assignment_form;
      const _modes = Object.entries(data.modes || {}).map(([key, value]) => ({
        value: key,
        label: value,
      }));

      const _assignTo = [
        {
          label: data.assignTo.class,
          value: 'class',
        },
        {
          label: data.assignTo.student,
          value: 'student',
        },
      ];

      return {
        labels: data.labels,
        gradeVariation: data.gradeVariations,
        placeholders: data.placeholders,
        descriptions: data.descriptions,
        modes: _modes,
        assignTo: _assignTo,
      };
    }

    return {
      labels: {},
      placeholders: {},
      descriptions: {},
      modes: {},
      assignTo: [],
    };
  }, [translations]);

  const onSubmit = ({ gradeVariation, ...data }) => {
    if (typeof parentSubmit === 'function') {
      parentSubmit({ ...data, ...gradeVariation });
    }
  };

  function setAllDay(e) {
    if (e) e.setHours(23, 59, 59);
    setValue('dates.deadline', e);
  }

  const isAllDay = watch('isAllDay');
  const deadline = watch('dates.deadline');

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <ContextContainer divided>
        <Controller
          control={control}
          name="assignees"
          rules={{ required: labels?.required }}
          render={({ field }) => (
            <AssignStudents
              {...field}
              error={errors?.assignees}
              profile="student"
              assignable={assignable}
              labels={labels}
              modes={modes}
              assignTo={assignTo}
            />
          )}
        />
        <Controller
          control={control}
          name="gradeVariation"
          render={({ field }) => (
            <GradeVariation
              {...field}
              error={errors?.gradeVariation}
              variations={variations}
              labels={gradeVariationLabels}
            />
          )}
        />

        <Controller
          control={control}
          name="alwaysAvailable"
          render={({ field: alwaysOpenField }) => (
            <ConditionalInput
              {...alwaysOpenField}
              label={labels?.alwaysOpenToogle}
              showOnTrue={false}
              render={() => (
                <>
                  <Grid>
                    <Grid.Col span={6}>
                      {/* <ContextContainer direction="row"> */}
                      <Controller
                        control={control}
                        name="dates.start"
                        rules={{ required: labels?.required }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            withTime
                            minDate={new Date()}
                            error={errors?.dates?.start}
                            label={labels?.startDate}
                            placeholder={placeholders?.date}
                          />
                        )}
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Controller
                        control={control}
                        name="dates.deadline"
                        rules={{ required: labels?.required }}
                        render={({ field }) => {
                          const startDate = watch('dates.start');
                          return (
                            <DatePicker
                              {...field}
                              onChange={(e) => {
                                if (isAllDay) {
                                  setAllDay(e);
                                } else {
                                  field.onChange(e);
                                }
                              }}
                              withTime={!isAllDay}
                              error={errors?.dates?.deadline}
                              label={labels?.deadline}
                              minDate={startDate}
                              placeholder={placeholders?.date}
                            />
                          );
                        }}
                      />
                    </Grid.Col>
                    {/* </ContextContainer> */}
                  </Grid>
                  <Grid>
                    <Grid.Col span={6}>
                      <ConditionalInput
                        label={labels?.visualizationDateToogle}
                        help={descriptions?.visualizationDate}
                        render={() => (
                          <ContextContainer direction="row" alignItems="end">
                            <Controller
                              control={control}
                              name="dates.visualization"
                              shouldUnregister={true}
                              rules={{ required: labels?.required }}
                              render={({ field }) => {
                                const startDate = watch('dates.start');
                                return (
                                  <DatePicker
                                    {...field}
                                    withTime
                                    minDate={new Date()}
                                    maxDate={startDate}
                                    error={errors?.dates?.visualization}
                                    label={labels?.visualizationDate}
                                    placeholder={placeholders?.date}
                                  />
                                );
                              }}
                            />
                          </ContextContainer>
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Box sx={(theme) => ({ marginBottom: theme.spacing[4] })}>
                        <Controller
                          control={control}
                          name="isAllDay"
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(e);
                                if (e && deadline) {
                                  setAllDay(deadline);
                                }
                              }}
                              helpPosition="bottom"
                              label={labels?.isAllDay}
                              help={descriptions?.isAllDay}
                            />
                          )}
                        />
                      </Box>
                      <ConditionalInput
                        label={`${labels?.closeDateToogle}\n `}
                        help={descriptions?.closeDateToogle}
                        render={() => (
                          <ContextContainer direction="row" alignItems="end">
                            <Controller
                              control={control}
                              name="dates.close"
                              shouldUnregister={true}
                              rules={{ required: labels?.required }}
                              render={({ field }) => {
                                const deadline = watch('dates.deadline');
                                return (
                                  <DatePicker
                                    {...field}
                                    withTime
                                    minDate={deadline}
                                    error={errors?.dates?.close}
                                    label={labels?.closeDate}
                                    placeholder={placeholders?.date}
                                  />
                                );
                              }}
                            />
                          </ContextContainer>
                        )}
                      />
                    </Grid.Col>
                  </Grid>
                </>
              )}
            />
          )}
        />

        <ConditionalInput
          label={labels?.limitedExecutionToogle}
          help={descriptions?.limitedExecution}
          render={() => (
            <Controller
              control={control}
              name="duration"
              shouldUnregister={true}
              rules={{ required: labels?.required }}
              render={({ field }) => (
                <TimeUnitsInput
                  error={errors?.duration}
                  label={labels?.limitedExecution}
                  {...field}
                />
              )}
            />
          )}
        />
        <ConditionalInput
          label={labels?.messageToStudentsToogle}
          help={descriptions?.messageToStudents}
          render={() => (
            <Controller
              control={control}
              name="messageToAssignees"
              shouldUnregister={true}
              rules={{ required: labels?.required }}
              render={({ field }) => (
                <TextEditorInput
                  error={errors?.messageToAssignees}
                  label={labels?.messageToStudents}
                  {...field}
                />
              )}
            />
          )}
        />

        <Controller
          control={control}
          name="curriculum.toogle"
          render={({ field: showField }) => (
            <ConditionalInput
              {...showField}
              label={labels?.showCurriculumToogle}
              render={() => (
                <>
                  <Controller
                    control={control}
                    name="curriculum.content"
                    shouldUnregister={true}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} label={labels?.content} />
                    )}
                  />
                  <Controller
                    control={control}
                    name="curriculum.assessmentCriteria"
                    shouldUnregister={true}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} label={labels?.assessmentCriteria} />
                    )}
                  />
                  <Controller
                    control={control}
                    name="curriculum.objectives"
                    shouldUnregister={true}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} label={labels?.objectives} />
                    )}
                  />
                </>
              )}
            />
          )}
        />

        <Box>{sendButton || <Button type="submit">{labels?.submit}</Button>}</Box>
      </ContextContainer>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  assignable: PropTypes.object,
  defaultValues: PropTypes.object,
  sendButton: PropTypes.any,
};
