import ColorBall from '@academic-calendar/components/ColorBall';
import { saveRegionalConfig } from '@academic-calendar/request/regional-config';
import {
  Box,
  Button,
  ContextContainer,
  DatePicker,
  Paragraph,
  Select,
  Stack,
  TableInput,
  TextInput,
  Title,
  createStyles,
} from '@bubbles-ui/components';
import { useLocale, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

const useStyle = createStyles((theme) => ({
  root: {
    padding: theme.spacing[5],
    // maxWidth: 700,
    width: '100%',
  },
}));

function StartDate(props) {
  const endName = props.name.replace('startDate', 'endDate');
  return (
    <DatePicker
      {...props}
      // eslint-disable-next-line react/prop-types
      maxDate={props.form.getValues(endName)}
      onChange={(value) => {
        if (!value) {
          props.form.setValue(endName, null);
        }
        if (!props.form.getValues('endDate')) props.form.setValue(endName, value);
        props.onChange(value);
      }}
    />
  );
}

function EndDate(props) {
  // eslint-disable-next-line react/prop-types
  const startValue = props.form.getValues(props.name.replace('endDate', 'startDate'));
  return (
    <DatePicker
      {...props}
      clearable={false}
      disabled={!startValue}
      minDate={startValue}
      value={props.value || startValue}
    />
  );
}

// eslint-disable-next-line import/prefer-default-export
export function RegionalConfigDetail({ config, t, calendars, center, onSave }) {
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const locale = useLocale();
  const [store, render] = useStore();
  const { classes } = useStyle();
  const isNew = !config.id;

  const regionalCalendars = React.useMemo(() => {
    const result = [];
    _.forEach(calendars, (calendar) => {
      if (calendar.regionalEvents?.length) {
        result.push({
          label: calendar.name,
          value: calendar.id,
        });
      }
    });
    return result;
  }, [calendars]);

  const tableConfig = React.useMemo(
    () => ({
      columns: [
        {
          Header: `${t('name')}*`,
          accessor: 'name',
          input: {
            node: <TextInput required />,
            rules: { required: t('requiredField') },
          },
        },
        {
          Header: `${t('init')}*`,
          accessor: 'startDate',
          input: {
            node: <StartDate locale={locale} required />,
            rules: { required: t('requiredField') },
          },
          valueRender: (value) => <>{new Date(value).toLocaleDateString()}</>,
        },
        {
          Header: `${t('end')}*`,
          accessor: 'endDate',
          input: {
            node: <EndDate locale={locale} required />,
            rules: { required: t('requiredField') },
          },
          valueRender: (value) => <>{new Date(value).toLocaleDateString()}</>,
        },
      ],
      labels: {
        add: t('add'),
        remove: t('remove'),
        edit: t('edit'),
        accept: t('accept'),
        cancel: t('cancel'),
      },
    }),
    [locale]
  );

  function getConfigDefaultValue() {
    return {
      ...config,
      regionalEvents:
        _.map(config.regionalEvents, (e) => ({
          ...e,
          startDate: new Date(e.startDate),
          endDate: e.endDate ? new Date(e.endDate) : null,
        })) || [],
      daysOffEvents:
        _.map(config.daysOffEvents, (e) => ({
          ...e,
          startDate: new Date(e.startDate),
          endDate: e.endDate ? new Date(e.endDate) : null,
        })) || [],
      localEvents:
        _.map(config.localEvents, (e) => ({
          ...e,
          startDate: new Date(e.startDate),
          endDate: e.endDate ? new Date(e.endDate) : null,
        })) || [],
    };
  }

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: getConfigDefaultValue(),
  });

  function save() {
    handleSubmit(async (data) => {
      try {
        store.saving = true;
        render();

        await saveRegionalConfig({
          ...data,
          center,
        });

        addSuccessAlert(t('saved'));
        onSave();
      } catch (err) {
        addErrorAlert(getErrorMessage(err));
      }
      store.saving = false;
      render();
    })();
  }

  React.useEffect(() => {
    reset(getConfigDefaultValue());
  }, [config]);

  const regionalEventsRel = watch('regionalEventsRel');
  const regionalEvents = watch('regionalEvents');

  return (
    <ContextContainer divided className={classes.root}>
      <ContextContainer>
        <Title order={3}>{isNew ? t('newRegionalCalendar') : t('edit')}</Title>
        <Controller
          control={control}
          name="name"
          rules={{ required: t('nameRequired') }}
          render={({ field }) => (
            <TextInput {...field} error={errors.name} required label={t('name')} />
          )}
        />
        <Box>
          <Title order={3}>
            <ColorBall
              sx={(theme) => ({ marginRight: theme.spacing[4] })}
              colors={['#DEEDE4', '#D5E4DB']}
              withBorder
            />
            {t('regionalEvents')}
          </Title>
          <Paragraph>{t('regionalEventsDescription')}</Paragraph>
        </Box>
        {!regionalEvents.length && regionalCalendars.length ? (
          <Controller
            control={control}
            name="regionalEventsRel"
            render={({ field }) => (
              <Select
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  setValue('regionalEvents', []);
                }}
                data={regionalCalendars}
                clearable
                placeholder={t('useEventsFromPlaceholder')}
                label={t('useEventsFrom')}
              />
            )}
          />
        ) : null}

        {!regionalEventsRel ? (
          <Controller
            control={control}
            name="regionalEvents"
            render={({ field }) => (
              <TableInput
                {...tableConfig}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setValue('regionalEventsRel', null);
                }}
                data={field.value}
                editable
                resetOnAdd
                sortable={false}
              />
            )}
          />
        ) : null}

        <Title order={3}>
          <ColorBall
            sx={(theme) => ({ marginRight: theme.spacing[4] })}
            colors={['#E4DDF7', '#DBD4ED']}
            rotate={90}
            withBorder
          />
          {t('localEvents')}
        </Title>
        <Controller
          control={control}
          name="localEvents"
          render={({ field }) => (
            <TableInput
              {...tableConfig}
              {...field}
              data={field.value}
              editable
              resetOnAdd
              sortable={false}
            />
          )}
        />
        <Box>
          <Title order={3}>
            <ColorBall
              sx={(theme) => ({ marginRight: theme.spacing[4] })}
              colors={['#F6E1F3', '#ECD8E9']}
              rotate={-45}
              withBorder
            />
            {t('daysOffEvents')}
          </Title>
          <Paragraph>{t('daysOffEventsDescription')}</Paragraph>
        </Box>
        <Controller
          control={control}
          name="daysOffEvents"
          render={({ field }) => (
            <TableInput
              {...tableConfig}
              {...field}
              data={field.value}
              editable
              resetOnAdd
              sortable={false}
            />
          )}
        />
      </ContextContainer>
      <Stack fullWidth justifyContent="end">
        <Button onClick={save} loading={store.saving}>
          {t('save')}
        </Button>
      </Stack>
    </ContextContainer>
  );
}

RegionalConfigDetail.propTypes = {
  config: PropTypes.object,
  t: PropTypes.func,
  calendars: PropTypes.array,
  onSave: PropTypes.func,
  center: PropTypes.string,
};
