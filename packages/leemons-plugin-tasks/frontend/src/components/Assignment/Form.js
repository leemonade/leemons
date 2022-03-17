import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { unflatten } from '@common';
import { useForm, Controller } from 'react-hook-form';
import { Button, ContextContainer, DatePicker, Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { TextEditor } from '@bubbles-ui/editors';
import { assign } from 'lodash';
import { prefixPN } from '../../helpers/prefixPN';
import AssignUsers from './AssignUsers';
import ConditionalInput from '../Inputs/ConditionalInput';
import TimeUnitsInput from '../Inputs/TimeUnitsInput';
import SelectTeachers from './SelectTeachers';

export default function Form({ onSubmit: parentSubmit }) {
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
            <AssignUsers
              {...field}
              error={errors.assignees}
              profile="student"
              labels={labels}
              modes={modes}
              assignTo={assignTo}
            />
          )}
        />
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

        <ConditionalInput
          label={labels?.visualizationDateToogle}
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
          label={labels?.limitedExecutionToogle}
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
                <TextEditor error={errors.message} label={labels?.messageToStudents} {...field} />
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
};
