import React from 'react';
import { find, get, isArray, isFunction, isNil, keyBy, map } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import {
  ActionButton,
  Badge,
  Box,
  Button,
  Col,
  Divider,
  Drawer,
  Grid,
  RadioGroup,
  Select,
  Switch,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { PluginCalendarIcon, UsersIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { Dates } from './components/Dates';
import { CalendarEventModalStyles } from './CalendarEventModal.styles';

export const CALENDAR_EVENT_MODAL_DEFAULT_PROPS = {
  opened: false,
  readOnly: false,
  onClose: () => {},
  onRemove: () => {},
  onSubmit: () => {},
  selectData: {
    repeat: [
      { label: "Don't repeat", value: 'dont_repeat' },
      { label: 'Every day', value: 'every_day' },
      { label: 'Every week', value: 'every_week' },
      { label: 'Every month', value: 'every_month' },
      { label: 'Every year', value: 'every_year' },
    ],
    calendars: [],
    eventTypes: [],
  },
  messages: {
    fromLabel: 'From',
    toLabel: 'To',
    repeatLabel: 'Repeat',
    allDayLabel: 'All day',
    titlePlaceholder: 'Event title',
    cancelButtonLabel: 'Cancel',
    saveButtonLabel: 'Save',
    updateButtonLabel: 'Update',
    calendarPlaceholder: 'Select calendar',
    calendarLabel: 'Choose calendar where to display',
    showInCalendar: 'Show in calendar',
  },
  errorMessages: {
    titleRequired: 'Field is required',
    startDateRequired: 'Field is required',
    startTimeRequired: 'Field is required',
    endDateRequired: 'Field is required',
    endTimeRequired: 'Field is required',
    calendarRequired: 'Field is required',
    typeRequired: 'Field is required',
  },
};
export const CALENDAR_EVENT_MODAL_PROP_TYPES = {};

function MyController(props) {
  return <Controller {...props} name={`data.${props.name}`} />;
}

const CalendarEventModal = (props) => {
  const [canEdit, setCanEdit] = React.useState(false);
  const { classes, cx } = CalendarEventModalStyles({});

  const {
    opened,
    onClose,
    onRemove,
    selectData,
    forceType,
    messages,
    errorMessages,
    components,
    isNew,
    isOwner,
    fromCalendar,
    onSubmit,
    defaultValues,
    readOnly,
    locale,
    UsersComponent,
    form: _form,
  } = props;

  if (defaultValues?.type === 'plugins.calendar.task') {
    if (isNil(defaultValues?.data?.hideInCalendar)) {
      if (isNil(defaultValues.data)) defaultValues.data = {};
      defaultValues.data.hideInCalendar = true;
    }
  }

  const form = _form ? _form : useForm({ defaultValues });
  const {
    watch,
    control,
    trigger,
    register,
    setValue,
    getValues,
    unregister,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = form;

  const calendar = watch('calendar');
  const hideInCalendar = watch('data.hideInCalendar');
  const hideCalendarField = watch('data.hideCalendarField');
  const type = watch('type');
  const taskColumn = watch('data.column');
  const eventTypesByValue = keyBy(selectData.eventTypes, 'value');
  // const onlyOneDate = eventTypesByValue[type]?.onlyOneDate;
  const config = eventTypesByValue[type]?.config;

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value.type === 'plugins.calendar.task') {
        if (name === 'type') {
          setValue('data.hideInCalendar', true);
        }
        if (
          name === 'data.hideInCalendar' &&
          hideInCalendar &&
          calendar !== selectData.calendars[0]?.value
        ) {
          setValue('calendar', selectData.calendars[0]?.value);
        }
      }
      /*
      if (onlyOneDate) {
        if (name === 'startDate') {
          setValue('endDate', value.startDate);
        }
        if (name === 'startTime') {
          setValue('endTime', value.startTime);
        }
      }
       */
    });
    return () => subscription.unsubscribe();
  });

  let Component = () => null;
  let hasComponent = false;

  if (type && components && components[type]) {
    Component = components[type];
    hasComponent = true;
  }

  let disabled = !isNew || readOnly;
  if (canEdit) disabled = false;

  function onEdit() {
    setCanEdit(true);
  }

  return (
    <Drawer
      size={360}
      className={classes.root}
      onClose={onClose}
      opened={opened}
      header={
        <Box className={classes.headerActions}>
          {isOwner && disabled ? <ActionButton icon={<EditWriteIcon />} onClick={onEdit} /> : null}

          {!isNew && (!fromCalendar || isOwner) ? (
            <ActionButton icon={<DeleteBinIcon />} onClick={onRemove} />
          ) : null}
        </Box>
      }
    >
      <Box
        sx={(theme) => ({
          //padding: theme.spacing[4],
          // paddingTop: theme.spacing[12],
          marginLeft: -theme.spacing[4],
          marginRight: -theme.spacing[4],
          paddingBottom: '76px',
        })}
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Controller
            name="title"
            control={control}
            rules={{
              required: errorMessages.titleRequired,
            }}
            render={({ field }) => {
              if (disabled) {
                return <Title order={3}>{field.value}</Title>;
              }
              return (
                <TextInput
                  readOnly={disabled}
                  disabled={disabled}
                  label={config?.titleLabel || messages.name}
                  placeholder={config?.titlePlaceholder || messages.titlePlaceholder}
                  error={get(errors, 'title')}
                  required={!disabled}
                  {...field}
                />
              );
            }}
          />

          {/*
          {disabled && type === 'plugins.calendar.task' && taskColumn ? (
            <Grid columns={100} gutter={0}>
              <Col span={10} className={classes.icon} />
              <Col span={90}>
                <Text>{taskColumn}</Text>
              </Col>
            </Grid>
          ) : null}
*/}

          {!forceType ? (
            <Box sx={(theme) => ({ paddingTop: theme.spacing[4] })}>
              <Controller
                name="type"
                control={control}
                rules={{
                  required: errorMessages.typeRequired,
                }}
                render={({ field }) => {
                  if (disabled) {
                    return (
                      <Badge
                        label={find(selectData.eventTypes, { value: field.value })?.label}
                        closable={false}
                      />
                    );
                  } else {
                    return (
                      <RadioGroup
                        {...field}
                        disabled={disabled}
                        variant="icon"
                        direction={selectData.eventTypes.length < 3 ? 'row' : 'column'}
                        fullWidth
                        error={get(errors, 'type')}
                        data={selectData.eventTypes}
                      />
                    );
                  }
                }}
              />
            </Box>
          ) : null}

          {!disabled && type === 'plugins.calendar.task' ? (
            <Box
              sx={(theme) => ({ marginBottom: -theme.spacing[3], paddingTop: theme.spacing[3] })}
            >
              <Grid columns={100} gutter={0}>
                <Col span={8} className={classes.icon} />
                <Col span={92}>
                  <Controller
                    name="data.hideInCalendar"
                    control={control}
                    shouldUnregister
                    render={({ field }) => (
                      <Switch
                        {...field}
                        onChange={() => field.onChange(!field.value)}
                        checked={!field.value}
                        label={messages.showInCalendar}
                      />
                    )}
                  />
                </Col>
              </Grid>
            </Box>
          ) : null}

          <Dates
            {...props}
            form={form}
            classes={classes}
            readOnly={disabled}
            locale={locale}
            disabled={disabled}
            onlyOneDate={false}
            config={config}
          />

          {UsersComponent && (!disabled || (disabled && form.getValues('users')?.length)) ? (
            <Box sx={(theme) => ({ paddingTop: theme.spacing[4] })}>
              <Grid columns={100} gutter={0}>
                <Col span={10} className={classes.icon}>
                  <UsersIcon />
                </Col>
                <Col span={90}>
                  <Controller
                    name="users"
                    control={control}
                    render={({ field }) =>
                      React.cloneElement(UsersComponent, {
                        ...field,
                        readOnly: disabled,
                        disabled,
                      })
                    }
                  />
                </Col>
              </Grid>
            </Box>
          ) : null}

          {hasComponent ? (
            <Box className={classes.divider}>
              <Divider />
            </Box>
          ) : null}

          <Component
            isEditing={true}
            allFormData={watch()}
            data={watch('data')}
            classes={classes}
            readOnly={disabled}
            disabled={disabled}
            allProps={{ ...props, form }}
            form={{
              Controller: MyController,
              control,
              register: (ref, options) => register(`data.${ref}`, options),
              setValue: (ref, value, options) => setValue(`data.${ref}`, value, options),
              getValues: (refs) => {
                if (isArray(refs)) return getValues(map(refs, (ref) => `data.${ref}`));
                return getValues(`data.${refs}`);
              },
              watch: (refs, options) => {
                if (isFunction(refs)) {
                  return watch(refs, options);
                }
                if (isArray(refs)) {
                  return watch(
                    map(refs, (ref) => `data.${ref}`),
                    options
                  );
                }
                return watch(`data.${refs}`, options);
              },
              unregister: (refs) => {
                if (isArray(refs)) return unregister(map(refs, (ref) => `data.${ref}`));
                return unregister(`data.${refs}`);
              },
              trigger: (refs) => {
                if (isArray(refs)) return trigger(map(refs, (ref) => `data.${ref}`));
                return trigger(`data.${refs}`);
              },
              formState: { errors: errors ? errors.data : {}, isSubmitted },
            }}
          />

          {(!hideCalendarField && disabled) ||
          ((isNew || (!isNew && isOwner)) &&
            (type !== 'plugins.calendar.task' ||
              (type === 'plugins.calendar.task' && !hideInCalendar))) ? (
            <>
              <Box className={classes.divider}>
                <Divider />
              </Box>

              <Box>
                <Grid columns={100} gutter={0}>
                  <Col span={10} className={classes.icon}>
                    <PluginCalendarIcon />
                  </Col>
                  <Col span={90}>
                    <Controller
                      name="calendar"
                      control={control}
                      rules={{
                        required: errorMessages.calendarRequired,
                      }}
                      render={({ field }) => (
                        <Select
                          size="sm"
                          readOnly={disabled}
                          disabled={disabled}
                          label={disabled ? messages.calendarLabelDisabled : messages.calendarLabel}
                          placeholder={messages.calendarPlaceholder}
                          {...field}
                          required={!disabled}
                          error={get(errors, 'calendar')}
                          data={selectData.calendars}
                          withinPortal={false}
                        />
                      )}
                    />
                  </Col>
                </Grid>
              </Box>
            </>
          ) : null}

          {!disabled ? (
            <Box className={classes.actionButtonsContainer}>
              <Button type="button" variant="light" compact onClick={onClose}>
                {messages.cancelButtonLabel}
              </Button>
              {isNew ? <Button type="submit">{messages.saveButtonLabel}</Button> : null}
              {!isNew && isOwner ? (
                <Button type="submit">{messages.updateButtonLabel}</Button>
              ) : null}
            </Box>
          ) : null}
        </form>
      </Box>
    </Drawer>
  );
};

CalendarEventModal.defaultProps = CALENDAR_EVENT_MODAL_DEFAULT_PROPS;
CalendarEventModal.propTypes = CALENDAR_EVENT_MODAL_PROP_TYPES;

export { CalendarEventModal };
