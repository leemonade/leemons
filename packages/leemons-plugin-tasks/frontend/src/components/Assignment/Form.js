import React, { useEffect, useState } from 'react';
import { unflatten } from '@common';
import { useForm, Controller } from 'react-hook-form';
import {
  Select,
  DatePicker,
  TimeInput,
  Button,
  Checkbox,
  ContextContainer,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { TextEditor } from '@bubbles-ui/editors';
import { prefixPN } from '../../helpers/prefixPN';

export default function Form() {
  const [, translations] = useTranslateLoader(prefixPN('assignment_form'));
  const [labels, setLabels] = useState({});
  const [placeholders, setPlaceholders] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [modes, setModes] = useState({});
  const [timeUnits, setTimeUnits] = useState({});

  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins.tasks.assignment_form;

      setLabels(data.labels);
      setPlaceholders(data.placeholders);
      setDescriptions(data.descriptions);
      setModes(data.modes);
      setTimeUnits(data.timeUnits);
    }
  }, [translations]);

  const { handleSubmit, errors, control } = useForm({
    defaultValues: {},
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const data = [
    {
      value: '1',
      label: 'Option 1',
    },
    {
      value: '2',
      label: 'Option 2',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContextContainer direction="row">
        <Controller
          control={control}
          name="assign"
          render={({ field }) => (
            <Select fullWidth label={labels?.assignTo} {...field} data={data} />
          )}
        />
        <Controller
          control={control}
          name="class"
          render={({ field }) => (
            <Select fullWidth label={labels?.classroomToAssign} {...field} data={data} />
          )}
        />
        <Controller
          control={control}
          name="mode"
          render={({ field }) => <Select fullWidth label={labels?.mode} {...field} data={data} />}
        />
      </ContextContainer>

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
              data={data}
            />
          )}
        />
        <Controller
          control={control}
          name="time"
          render={({ field }) => (
            <TimeInput placeholder={placeholders?.time} fullWidth {...field} data={data} />
          )}
        />
      </ContextContainer>

      <ContextContainer direction="row">
        <ContextContainer>
          <Controller
            control={control}
            name="availableCheck"
            render={({ field }) => <Checkbox label={labels?.availableInAdvance} {...field} />}
          />
          <ContextContainer direction="row" alignItems="end">
            <Controller
              control={control}
              name="deadline"
              render={({ field }) => (
                <DatePicker placeholder={placeholders?.date} fullWidth {...field} data={data} />
              )}
            />
            <Controller
              control={control}
              name="time"
              render={({ field }) => (
                <TimeInput placeholder={placeholders?.time} fullWidth {...field} data={data} />
              )}
            />
          </ContextContainer>
        </ContextContainer>

        <ContextContainer>
          <Controller
            control={control}
            name="limitedExecutionCheck"
            render={({ field }) => <Checkbox label={labels?.limitedExecution} {...field} />}
          />
          <ContextContainer direction="row" alignItems="end">
            <Controller
              control={control}
              name="deadline"
              render={({ field }) => (
                <DatePicker placeholder={placeholders?.date} fullWidth {...field} data={data} />
              )}
            />
            <Controller
              control={control}
              name="time"
              render={({ field }) => (
                <TimeInput placeholder={placeholders?.time} fullWidth {...field} data={data} />
              )}
            />
          </ContextContainer>
        </ContextContainer>
      </ContextContainer>

      <ContextContainer>
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
