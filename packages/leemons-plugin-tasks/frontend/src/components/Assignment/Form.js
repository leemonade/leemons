import React, { useEffect, useState } from 'react';
import { unflatten } from '@common';
import { useForm, Controller } from 'react-hook-form';
import {
  Select,
  DatePicker,
  TimeInput,
  Button,
  Checkbox,
  NumberInput,
  ContextContainer,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { TextEditor } from '@bubbles-ui/editors';
import { prefixPN } from '../../helpers/prefixPN';
import AssignUsers from './AssignUsers';
import ConditionalInput from '../ConditionalInput';

export default function Form() {
  const [, translations] = useTranslateLoader(prefixPN('assignment_form'));
  const [labels, setLabels] = useState({});
  const [placeholders, setPlaceholders] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [modes, setModes] = useState({});
  const [timeUnits, setTimeUnits] = useState({});
  const [assignTo, setAssignTo] = useState({});

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

      setTimeUnits(
        Object.entries(data.timeUnits || {}).map(([key, value]) => ({
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

  const { handleSubmit, errors, control } = useForm({
    defaultValues: {},
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AssignUsers labels={labels} modes={modes} assignTo={assignTo} />

      <ContextContainer direction="row" alignItems="end">
        <Controller
          control={control}
          name="deadline"
          render={({ field }) => (
            <DatePicker
              label={labels?.deadline}
              placeholder={placeholders?.date}
              fullWidth
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="time"
          render={({ field }) => (
            <TimeInput placeholder={placeholders?.time} fullWidth {...field} />
          )}
        />
      </ContextContainer>

      <ContextContainer direction="row">
        <ConditionalInput
          label={labels?.availableInAdvance}
          render={() => (
            <ContextContainer direction="row" alignItems="end">
              <Controller
                control={control}
                name="deadline"
                render={({ field }) => (
                  <DatePicker placeholder={placeholders?.date} fullWidth {...field} />
                )}
              />
              <Controller
                control={control}
                name="time"
                render={({ field }) => (
                  <TimeInput placeholder={placeholders?.time} fullWidth {...field} />
                )}
              />
            </ContextContainer>
          )}
        />
        {/* <Controller
            control={control}
            name="availableCheck"
            render={({ field }) => <Checkbox label={labels?.availableInAdvance} {...field} />}
          /> */}

        <ContextContainer>
          <ConditionalInput
            label={labels?.limitedExecution}
            render={() => (
              <ContextContainer direction="row" alignItems="end">
                <Controller
                  control={control}
                  name="deadline"
                  render={({ field }) => <NumberInput fullWidth {...field} />}
                />
                <Controller
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <Select
                      placeholder={placeholders?.units}
                      fullWidth
                      {...field}
                      data={timeUnits}
                    />
                  )}
                />
              </ContextContainer>
            )}
          />
        </ContextContainer>
      </ContextContainer>

      <ContextContainer>
        <ConditionalInput
          label={labels?.messageToStudents}
          help={descriptions?.messageToStudents}
          render={() => <TextEditor />}
        />
        <ConditionalInput
          label={labels?.messageToStudents}
          help={descriptions?.messageToStudents}
          render={() => <NumberInput label="Hola" />}
        />

        <Controller
          control={control}
          name="limitedExecutionCheck"
          render={({ field }) => (
            <Checkbox
              label={labels?.messageToStudents}
              description={descriptions?.messageToStudents}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="limitedExecutionCheck"
          render={({ field }) => <TextEditor {...field} />}
        />
      </ContextContainer>

      <Button type="submit">{labels?.submit}</Button>
    </form>
  );
}
