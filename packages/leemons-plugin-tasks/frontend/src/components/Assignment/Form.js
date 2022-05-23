import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { unflatten } from '@common';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, ContextContainer, DatePicker, Grid, Switch } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { TextEditorInput } from '@bubbles-ui/editors';

import { prefixPN } from '../../helpers/prefixPN';
import AssignStudents from './AssignStudents';
import ConditionalInput from '../Inputs/ConditionalInput';
import TimeUnitsInput from '../Inputs/TimeUnitsInput';

export default function Form({ defaultValues = {}, onSubmit: parentSubmit, task, sendButton }) {
  const [, translations] = useTranslateLoader(prefixPN('assignment_form'));
  const [labels, setLabels] = useState({});
  const [placeholders, setPlaceholders] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [modes, setModes] = useState({});
  const [assignTo, setAssignTo] = useState([]);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins.tasks.assignment_form;

      setModes(
        Object.entries(data.modes || {}).map(([key, value]) => ({
          value: key,
          label: value,
        }))
      );

      setAssignTo([
        {
          label: data.assignTo.class,
          value: 'class',
        },
        {
          label: data.assignTo.student,
          value: 'student',
        },
      ]);

      setLabels(data.labels);
      setPlaceholders(data.placeholders);
      setDescriptions(data.descriptions);
    }
  }, [translations]);

  const onSubmit = (data) => {
    if (typeof parentSubmit === 'function') {
      parentSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <ContextContainer divided>
        <Controller
          control={control}
          name="assignees"
          rules={{ required: true }}
          render={({ field }) => (
            <AssignStudents
              {...field}
              error={errors.assignees}
              profile="student"
              task={task}
              labels={labels}
              modes={modes}
              assignTo={assignTo}
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
                <Grid>
                  <Grid.Col span={6}>
                    {/* <ContextContainer direction="row"> */}
                    <Controller
                      control={control}
                      name="dates.start"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          withTime
                          minDate={new Date()}
                          error={errors.startDate}
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
                      rules={{ required: true }}
                      render={({ field }) => {
                        const startDate = watch('dates.start');
                        return (
                          <DatePicker
                            {...field}
                            withTime
                            error={errors.deadline}
                            label={labels?.deadline}
                            minDate={startDate}
                            placeholder={placeholders?.date}
                          />
                        );
                      }}
                    />
                  </Grid.Col>
                  {/* </ContextContainer> */}
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
                            rules={{ required: true }}
                            render={({ field }) => {
                              const startDate = watch('dates.start');
                              return (
                                <DatePicker
                                  {...field}
                                  withTime
                                  minDate={new Date()}
                                  maxDate={startDate}
                                  error={errors.visualizationDate}
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
                    <ConditionalInput
                      label={`${labels?.closeDateToogle}\n `}
                      help={descriptions?.closeDateToogle}
                      render={() => (
                        <ContextContainer direction="row" alignItems="end">
                          <Controller
                            control={control}
                            name="dates.close"
                            shouldUnregister={true}
                            rules={{ required: true }}
                            render={({ field }) => {
                              const deadline = watch('dates.deadline');
                              return (
                                <DatePicker
                                  {...field}
                                  withTime
                                  minDate={deadline}
                                  error={errors.closeDate}
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
              rules={{ required: true }}
              render={({ field }) => (
                <TimeUnitsInput
                  error={errors.executionTime}
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
              rules={{ required: true }}
              render={({ field }) => (
                <TextEditorInput
                  error={errors.message}
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
                    name="curriculum.objectives"
                    shouldUnregister={true}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} label={labels?.objectives} />
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
  task: PropTypes.object,
  defaultValues: PropTypes.object,
  sendButton: PropTypes.any,
};
