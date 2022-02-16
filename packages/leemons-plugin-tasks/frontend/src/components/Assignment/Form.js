import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { unflatten } from '@common';
import { useForm, Controller } from 'react-hook-form';
import { Button, ContextContainer } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { TextEditor } from '@bubbles-ui/editors';
import { prefixPN } from '../../helpers/prefixPN';
import AssignUsers from './AssignUsers';
import ConditionalInput from '../Inputs/ConditionalInput';
import DateTime from '../Inputs/DateTime';
import TimeUnitsInput from '../Inputs/TimeUnitsInput';

export default function Form({ onSubmit: parentSubmit }) {
  const [, translations] = useTranslateLoader(prefixPN('assignment_form'));
  const [labels, setLabels] = useState({});
  const [placeholders, setPlaceholders] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [modes, setModes] = useState({});
  const [assignTo, setAssignTo] = useState([]);

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

  const { handleSubmit, control } = useForm({
    defaultValues: {},
  });

  const onSubmit = (data) => {
    if (typeof parentSubmit === 'function') {
      parentSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="assignees"
        render={({ field }) => (
          <AssignUsers {...field} labels={labels} modes={modes} assignTo={assignTo} />
        )}
      />

      <ContextContainer direction="row">
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DateTime {...field} label={labels?.startDate} placeholder={placeholders?.date} />
          )}
        />

        <Controller
          control={control}
          name="deadline"
          render={({ field }) => (
            <DateTime {...field} label={labels?.deadline} placeholder={placeholders?.date} />
          )}
        />

        <ConditionalInput
          label={labels?.visualizationDate}
          render={() => (
            <ContextContainer direction="row" alignItems="end">
              <Controller
                control={control}
                name="visualizationDate"
                render={({ field }) => <DateTime {...field} placeholder={placeholders?.date} />}
              />
            </ContextContainer>
          )}
        />

        <ContextContainer>
          <ConditionalInput
            label={labels?.limitedExecution}
            render={() => (
              <Controller
                control={control}
                name="executionTime"
                render={({ field }) => <TimeUnitsInput {...field} />}
              />
            )}
          />
        </ContextContainer>
      </ContextContainer>

      <ContextContainer>
        <ConditionalInput
          label={labels?.messageToStudents}
          help={descriptions?.messageToStudents}
          render={() => (
            <Controller
              control={control}
              name="message"
              render={({ field }) => <TextEditor {...field} />}
            />
          )}
        />
      </ContextContainer>

      <Button type="submit">{labels?.submit}</Button>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func,
};
