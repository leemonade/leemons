import React from 'react';
import { get } from 'lodash';
import { Controller } from 'react-hook-form';
import {
  Box,
  Col,
  ContextContainer,
  DatePicker,
  Grid,
  InputWrapper,
  Select,
  Switch,
  TimeInput,
} from '@bubbles-ui/components';
import { TimeClockCircleIcon } from '@bubbles-ui/icons/outline';

const Dates = ({
  form,
  classes,
  messages,
  errorMessages,
  config,
  selectData,
  disabled,
  locale,
  readOnly,
  onlyOneDate,
}) => {
  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const type = watch('type');
  const isAllDay = watch('isAllDay');
  const hideInCalendar = watch('data.hideInCalendar');

  let dateRequired = true;
  if (type === 'plugins.calendar.task') {
    if (hideInCalendar) dateRequired = false;
  }

  const startDate = form.getValues('startDate');

  if (disabled && !startDate) {
    return null;
  }

  return (
    <Box sx={(theme) => ({ paddingTop: theme.spacing[5] })}>
      <Grid columns={100} gutter={0}>
        <Col span={10} className={classes.icon}>
          <TimeClockCircleIcon />
        </Col>
        <Col span={90}>
          <ContextContainer>
            {/* FROM */}
            {!disabled || (disabled && startDate) ? (
              <Grid columns={100} gutter={0} className={classes.inputsDatesContainer}>
                <Col span={isAllDay || disabled ? 100 : 70}>
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{
                      validate: (e) => {
                        if (dateRequired && !e) return errorMessages.startDateRequired;
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <DatePicker
                        size="sm"
                        withTime={disabled}
                        readOnly={readOnly}
                        disabled={disabled}
                        locale={locale || navigator.language}
                        orientation={disabled ? 'horizontal' : 'vertical'}
                        error={get(errors, 'startDate')}
                        label={config?.fromLabel || messages.fromLabel}
                        required={dateRequired && !disabled}
                        {...field}
                        maxDate={form.getValues('endDate')}
                        onChange={(value) => {
                          if (!value) {
                            form.setValue('endDate', null);
                          }
                          if (!form.getValues('endDate')) form.setValue('endDate', value);
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </Col>
                {!isAllDay ? (
                  <Col span={30} sx={(theme) => ({ paddingLeft: theme.spacing[2] })}>
                    <Controller
                      name="startTime"
                      control={control}
                      rules={{
                        validate: (e) => {
                          if (dateRequired && !e) return errorMessages.startTimeRequired;
                          return true;
                        },
                      }}
                      render={({ field }) => {
                        if (disabled) return null;
                        if (!field.value) {
                          field.onChange(new Date());
                        }
                        return (
                          <TimeInput
                            readOnly={readOnly}
                            disabled={disabled}
                            error={get(errors, 'startTime')}
                            size="sm"
                            required={dateRequired && !disabled}
                            {...field}
                            value={field.value || new Date()}
                          />
                        );
                      }}
                    />
                  </Col>
                ) : null}
              </Grid>
            ) : null}

            {/* TO */}
            {(!disabled || (disabled && form.getValues('endDate'))) && !onlyOneDate ? (
              <Grid columns={100} gutter={0} className={classes.inputsDatesContainer}>
                <Col span={isAllDay || disabled ? 100 : 70}>
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{
                      validate: (e) => {
                        if (dateRequired && !e) return errorMessages.endDateRequired;
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <DatePicker
                        error={get(errors, 'endDate')}
                        size="sm"
                        withTime={disabled}
                        locale={locale || navigator.language}
                        orientation={disabled ? 'horizontal' : 'vertical'}
                        readOnly={readOnly}
                        label={messages.toLabel}
                        required={dateRequired && !disabled}
                        {...field}
                        clearable={false}
                        disabled={disabled || !form.getValues('startDate')}
                        minDate={form.getValues('startDate')}
                        value={field.value || form.getValues('startDate')}
                      />
                    )}
                  />
                </Col>
                {!isAllDay ? (
                  <Col span={30} sx={(theme) => ({ paddingLeft: theme.spacing[2] })}>
                    <Controller
                      name="endTime"
                      control={control}
                      rules={{
                        validate: (e) => {
                          if (dateRequired && !e) return errorMessages.endTimeRequired;
                          return true;
                        },
                      }}
                      render={({ field }) => {
                        if (disabled) return null;
                        if (!field.value) {
                          field.onChange(new Date());
                        }
                        return (
                          <TimeInput
                            readOnly={readOnly}
                            disabled={disabled}
                            error={get(errors, 'endTime')}
                            size="sm"
                            required={dateRequired && !disabled}
                            {...field}
                            value={field.value || new Date()}
                          />
                        );
                      }}
                    />
                  </Col>
                ) : null}
              </Grid>
            ) : null}

            {/* REPEAT */}
            {!config?.hideRepeat ? (
              <Controller
                name="repeat"
                control={control}
                rules={{
                  required: errorMessages.endTimeRequired,
                }}
                render={({ field }) => (
                  <Select
                    error={get(errors, 'repeat')}
                    size="sm"
                    disabled={disabled}
                    orientation={disabled ? 'horizontal' : 'vertical'}
                    readOnly={readOnly}
                    label={messages.repeatLabel}
                    {...field}
                    data={selectData.repeat}
                  />
                )}
              />
            ) : null}

            {/* ALL DAY */}
            {!config?.hideAllDay && (!disabled || (disabled && form.getValues('isAllDay'))) ? (
              <Controller
                name="isAllDay"
                control={control}
                render={({ field }) => {
                  if (disabled) return <InputWrapper label={messages.allDayLabel} />;
                  return (
                    <Switch
                      {...field}
                      disabled={disabled}
                      error={get(errors, 'isAllDay')}
                      label={messages.allDayLabel}
                      labelPosition="start"
                      checked={field.value}
                    />
                  );
                }}
              />
            ) : null}
          </ContextContainer>
        </Col>
      </Grid>
    </Box>
  );
};

export { Dates };
