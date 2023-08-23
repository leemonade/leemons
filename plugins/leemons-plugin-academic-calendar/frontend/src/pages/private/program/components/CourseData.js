import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, createStyles, DatePicker, Stack } from '@bubbles-ui/components';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useStore } from '@common';
import { Controller, useForm } from 'react-hook-form';
import { get } from 'lodash';
import OtherEvents from '@academic-calendar/pages/private/program/components/OtherEvents';
import Substages from './Substages';

const useStyle = createStyles((theme) => ({
  root: {
    padding: theme.spacing[5],
    maxWidth: 700,
    width: '100%',
  },
}));

export default function CourseData({
  locale,
  startLabel,
  endLabel,
  value,
  program,
  onForm = () => {},
  onChange = () => {},
  t,
}) {
  const { classes } = useStyle();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const [store, render] = useStore({
    program,
  });

  const form = useForm({ defaultValues: value });
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  const disabled = !startDate || !endDate;
  const formErrors = form.formState.errors;

  React.useEffect(() => {
    onForm(form);
    return onForm;
  }, [form]);

  React.useEffect(() => {
    const subscription = form.watch((data) => {
      onChange(data);
    });

    return () => subscription.unsubscribe();
  });

  return (
    <ContextContainer sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <Stack spacing="md">
        <Controller
          name={`startDate`}
          control={form.control}
          rules={{ required: t('fieldRequired') }}
          render={({ field }) => (
            <DatePicker
              {...field}
              locale={locale}
              label={startLabel || t('initOfCourse')}
              maxDate={form.watch(`endDate`)}
              required
              error={get(formErrors, `startDate`)}
              onChange={(value) => {
                if (!value) {
                  form.setValue('endDate', null);
                }
                field.onChange(value);
              }}
            />
          )}
        />
        <Controller
          name={`endDate`}
          control={form.control}
          rules={{ required: t('fieldRequired') }}
          render={({ field }) => (
            <DatePicker
              {...field}
              clearable={false}
              value={field.value || form.watch(`startDate`)}
              locale={locale}
              label={endLabel || t('endOfCourse')}
              minDate={form.watch(`startDate`)}
              disabled={!form.watch(`startDate`)}
              required
              error={get(formErrors, `endDate`)}
            />
          )}
        />
      </Stack>
      {program.substages && program.substages.length > 0 ? (
        <Controller
          name={`substages`}
          control={form.control}
          render={({ field }) => (
            <Substages
              locale={locale}
              start={startDate}
              end={endDate}
              disabled={disabled}
              {...field}
              program={program}
              t={t}
            />
          )}
        />
      ) : null}
      <Controller
        name={`events`}
        control={form.control}
        render={({ field }) => (
          <OtherEvents
            locale={locale}
            start={startDate}
            end={endDate}
            disabled={disabled}
            {...field}
            program={program}
            t={t}
          />
        )}
      />
    </ContextContainer>
  );
}

CourseData.propTypes = {
  locale: PropTypes.string,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  program: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onForm: PropTypes.func,
  t: PropTypes.func,
};
