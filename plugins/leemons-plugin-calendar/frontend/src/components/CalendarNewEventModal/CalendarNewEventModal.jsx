import React, { useEffect } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  ColorInput,
  DatePicker,
  Drawer,
  RadioGroup,
  ContextContainer,
} from '@bubbles-ui/components';
import { noop } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { CalendarNewEventModalStyles } from './CalendarNewEventModal.styles';
import {
  CALENDAR_NEW_EVENT_MODAL_COLORS as MODAL_COLORS,
  CALENDAR_NEW_EVENT_MODAL_DEFAULT_PROPS,
  CALENDAR_NEW_EVENT_MODAL_PROP_TYPES,
} from './CalendarNewEventModal.constants';
import { ColorPicker } from './ColorPicker/ColorPicker';

const CalendarNewEventModal = ({
  locale,
  opened,
  labels,
  values,
  placeholders,
  errorMessages,
  suggestions,
  minDate,
  maxDate,
  onSubmit = noop,
  onClose = noop,
}) => {
  const defaultValues = {
    periodName: values.periodName || '',
    dayType: values.dayType || 'schoolDays',
    withoutOrdinaryDays: values.withoutOrdinaryDays || false,
    startDate: values.startDate || null,
    endDate: values.endDate || null,
    color: values.color || '',
  };

  const {
    form,
    watch,
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const isSchoolDay = watch('dayType') === 'schoolDays';
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const onSubmitHandler = (val) => {
    const event = { ...val };
    if (event.dayType !== 'schoolDays') {
      delete event.withoutOrdinaryDays;
      delete event.color;
    }
    onSubmit(event);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [JSON.stringify(values)]);

  useEffect(() => {
    if (opened) reset(defaultValues);
  }, [opened]);

  let _maxDate = maxDate;
  let _minDate = minDate;
  if (!_maxDate || _maxDate > endDate) {
    _maxDate = endDate || maxDate;
  }
  if (!_minDate || _minDate < startDate) {
    _minDate = startDate;
  }

  const { classes } = CalendarNewEventModalStyles({ isSchoolDay }, { name: 'CalendarModal' });
  return (
    <Drawer opened={opened} size="xl" onClose={onClose}>
      <Drawer.Header title={'New Event'} />
      <Drawer.Content>
        <form form={form} className={classes.root}>
          <Controller
            form={form}
            control={control}
            name="periodName"
            rules={{
              required: errorMessages.periodName,
            }}
            render={({ field }) => (
              <Autocomplete
                className={classes.nameInput}
                label={labels.periodName}
                placeholder={placeholders.periodName}
                data={suggestions}
                required
                error={errors.periodName}
                {...field}
              />
            )}
          />
          <Controller
            form={form}
            control={control}
            name="dayType"
            rules={{
              required: errorMessages.dayType,
            }}
            render={({ field }) => (
              <RadioGroup
                data={[
                  { value: 'schoolDays', label: labels.schoolDays },
                  { value: 'nonSchoolDays', label: labels.nonSchoolDays },
                ]}
                error={errors.dayType}
                rounded
                required
                className={classes.dayType}
                noRootPadding
                {...field}
              />
            )}
          />
          {isSchoolDay && (
            <Controller
              form={form}
              control={control}
              name="withoutOrdinaryDays"
              render={({ field }) => (
                <Checkbox
                  label={labels.withoutOrdinaryDays}
                  className={classes.withoutOrdinaryDays}
                  {...field}
                  checked={field.value}
                />
              )}
            />
          )}
          <ContextContainer direction="row">
            {isSchoolDay && (
              <Controller
                form={form}
                control={control}
                name="color"
                rules={{
                  required: errorMessages.color,
                  validate: (v) =>
                    MODAL_COLORS.includes(v.toUpperCase()) ? true : errorMessages.invalidColor,
                }}
                render={({ field }) => (
                  <ColorInput
                    label={labels.color}
                    placeholder={placeholders.color}
                    error={errors.color}
                    required
                    lightOnly
                    headerStyle={{ marginTop: 16 }}
                    compact={false}
                    colorPickerComponent={ColorPicker}
                    {...field}
                  />
                )}
              />
            )}
            <Controller
              form={form}
              control={control}
              name="startDate"
              rules={{
                required: errorMessages.startDate,
              }}
              render={({ field }) => (
                <DatePicker
                  locale={locale}
                  label={labels.startDate}
                  placeholder={placeholders.startDate}
                  error={errors.startDate}
                  headerStyle={{ marginTop: isSchoolDay ? 8 : 16, flex: 1 }}
                  required
                  minDate={minDate}
                  maxDate={_maxDate}
                  {...field}
                  onChange={(value) => {
                    if (!value) {
                      setValue('endDate', null);
                    }
                    if (!getValues('endDate')) setValue('endDate', value);
                    field.onChange(value);
                  }}
                  style={{ flex: 1 }}
                />
              )}
            />
            <Controller
              form={form}
              control={control}
              name="endDate"
              rules={{
                required: errorMessages.startDate,
              }}
              render={({ field }) => (
                <DatePicker
                  locale={locale}
                  label={labels.endDate}
                  placeholder={placeholders.endDate}
                  error={errors.endDate}
                  minDate={_minDate}
                  maxDate={maxDate}
                  clearable={false}
                  required
                  disabled={!startDate}
                  headerStyle={{ marginTop: isSchoolDay ? 8 : 16, flex: 1 }}
                  {...field}
                  value={endDate || startDate}
                  style={{ flex: 1 }}
                />
              )}
            />
          </ContextContainer>
        </form>
      </Drawer.Content>
      <Drawer.Footer>
        <Box className={classes.buttonWrapper}>
          <Button type="button" variant="outline" compact onClick={onClose}>
            {labels.cancel}
          </Button>
          <Button type="submit" onClick={handleSubmit(onSubmitHandler)}>
            {labels.add}
          </Button>
        </Box>
      </Drawer.Footer>
    </Drawer>
  );
};

CalendarNewEventModal.defaultProps = CALENDAR_NEW_EVENT_MODAL_DEFAULT_PROPS;
CalendarNewEventModal.propTypes = CALENDAR_NEW_EVENT_MODAL_PROP_TYPES;

export { CalendarNewEventModal };
