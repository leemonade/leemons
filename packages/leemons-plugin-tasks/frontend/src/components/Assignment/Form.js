import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { unflatten } from '@common';
import { useForm, Controller } from 'react-hook-form';
import { Button, ContextContainer, DatePicker, Box, Switch } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { TextEditorInput } from '@bubbles-ui/editors';

import { prefixPN } from '../../helpers/prefixPN';
import AssignStudents from './AssignStudents';
import ConditionalInput from '../Inputs/ConditionalInput';
import TimeUnitsInput from '../Inputs/TimeUnitsInput';
import SelectTeachers from './SelectTeachers';

export default function Form({ onSubmit: parentSubmit, task }) {
  const [, translations] = useTranslateLoader(prefixPN('assignment_form'));
  const [labels, setLabels] = useState({});
  const [placeholders, setPlaceholders] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [modes, setModes] = useState({});
  const [assignTo, setAssignTo] = useState([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {},
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
      <ContextContainer>
        <Controller
          control={control}
          name="teachers"
          rules={{ required: true }}
          render={({ field }) => <SelectTeachers {...field} role="teacher" />}
        />
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
          name="alwaysOpen"
          render={({ field: alwaysOpenField }) => (
            <ConditionalInput
              {...alwaysOpenField}
              label={labels?.alwaysOpenToogle}
              showOnTrue={false}
              render={() => (
                <>
                  <ContextContainer direction="row">
                    <Controller
                      control={control}
                      name="startDate"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          withTime
                          error={errors.startDate}
                          label={labels?.startDate}
                          placeholder={placeholders?.date}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="deadline"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          withTime
                          error={errors.deadline}
                          label={labels?.deadline}
                          placeholder={placeholders?.date}
                        />
                      )}
                    />
                  </ContextContainer>
                  <Box>
                    <ContextContainer direction="row">
                      <ConditionalInput
                        label={labels?.visualizationDateToogle}
                        help={descriptions?.visualizationDate}
                        render={() => (
                          <ContextContainer direction="row" alignItems="end">
                            <Controller
                              control={control}
                              name="visualizationDate"
                              shouldUnregister={true}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  withTime
                                  error={errors.visualizationDate}
                                  label={labels?.visualizationDate}
                                  placeholder={placeholders?.date}
                                />
                              )}
                            />
                          </ContextContainer>
                        )}
                      />
                      <ConditionalInput
                        label={labels?.closeDateToogle}
                        help={descriptions?.closeDateToogle}
                        render={() => (
                          <ContextContainer direction="row" alignItems="end">
                            <Controller
                              control={control}
                              name="closeDate"
                              shouldUnregister={true}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  withTime
                                  error={errors.closeDate}
                                  label={labels?.closeDate}
                                  placeholder={placeholders?.date}
                                />
                              )}
                            />
                          </ContextContainer>
                        )}
                      />
                    </ContextContainer>
                  </Box>
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
              name="executionTime"
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
              name="message"
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
          name="showCurriculum.toogle"
          render={({ field: showField }) => (
            <ConditionalInput
              {...showField}
              label={labels?.showCurriculumToogle}
              render={() => (
                <>
                  <Controller
                    control={control}
                    name="showCurriculum.content"
                    shouldUnregister={true}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} label={labels?.content} />
                    )}
                  />
                  <Controller
                    control={control}
                    name="showCurriculum.objectives"
                    shouldUnregister={true}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} label={labels?.objectives} />
                    )}
                  />
                  <Controller
                    control={control}
                    name="showCurriculum.assessmentCriteria"
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

        <Box>
          <Button type="submit">{labels?.submit}</Button>
        </Box>
      </ContextContainer>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  task: PropTypes.object,
};
