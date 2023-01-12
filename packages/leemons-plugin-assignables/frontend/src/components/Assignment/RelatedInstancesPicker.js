import React from 'react';
import _ from 'lodash';
import { LocaleDate, useCache } from '@common';
import { Controller, useFormContext, useForm, useWatch } from 'react-hook-form';
import { Box, createStyles, ImageLoader, Select, Switch, Text } from '@bubbles-ui/components';
import ConditionalInput from '@tasks/components/Inputs/ConditionalInput';
import useSearchAssignableInstances from '@assignables/hooks/assignableInstance/useSearchAssignableInstancesQuery';
import useClassData from '@assignables/hooks/useClassDataQuery';
import useInstances from '@assignables/requests/hooks/queries/useInstances';

function useActivities() {
  const { data: assignableInstancesIds } = useSearchAssignableInstances(
    { closed: false, archived: false, evaluated: false },
    {}
  );

  const { data: assignableInstances } = useInstances({
    ids: assignableInstancesIds,
    details: true,
    placeholderData: [],
  });

  return assignableInstances;
}

function useClasses({ activities, labels }) {
  const cache = useCache();

  const assignablesClassesQuery = useClassData(activities, labels);

  const assignableClassesAreLoading = React.useMemo(
    () =>
      assignablesClassesQuery?.length && assignablesClassesQuery.some((query) => query.isLoading),
    [assignablesClassesQuery]
  );

  const classes = cache(
    'classes',
    React.useMemo(() => {
      if (assignableClassesAreLoading) {
        return [];
      }

      return _.map(assignablesClassesQuery, 'data').reduce(
        (acc, klass) => ({
          ...acc,
          [klass.id]: klass,
        }),
        {}
      );
    }, [assignablesClassesQuery])
  );

  return classes;
}

function useData({ labels }) {
  const cache = useCache();
  const activities = useActivities();
  const classes = useClasses({ labels, activities });

  return cache(
    'data',
    React.useMemo(
      () =>
        activities.map((instance) => {
          let klass;

          if (!klass) {
            if (instance.classes.length > 1) {
              klass = classes?.multiSubject;
            } else {
              klass = classes?.[instance.classes[0]];
            }
          }
          return {
            value: instance.id,
            instance,
            class: klass,
            label: `${instance?.assignable?.asset?.name} (${klass?.name})`,
          };
        }),
      [activities, classes]
    )
  );
}

const useActivityItemStyles = createStyles((theme, { klass }) => ({
  root: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    paddingBottom: theme.spacing[1],
    paddingTop: theme.spacing[1],
    paddingLeft: theme.spacing[2],
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 26,
    minHeight: 26,
    maxWidth: 26,
    maxHeight: 26,
    borderRadius: '50%',
    backgroundColor: klass?.color,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  firstLine: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  datesContainer: {
    display: 'flex',
    gap: theme.spacing[1],
  },
  date: {
    fontSize: theme.fontSizes[1],
  },
}));

function ActivityItem({ instance, class: klass, ...props }) {
  const { classes } = useActivityItemStyles({ klass });

  const startDate = instance?.dates?.start;
  const deadline = instance?.dates?.deadline;

  return (
    <Box {...props} className={classes.root}>
      <Box className={classes.iconContainer}>
        <ImageLoader
          sx={() => ({
            borderRadius: 0,
            filter: 'brightness(0) invert(1)',
          })}
          forceImage
          width={16}
          height={16}
          src={klass?.icon}
        />
      </Box>
      <Box className={classes.textContainer}>
        <Box className={classes.firstLine}>
          <Text color="primary">{instance?.assignable?.asset?.name}</Text>
          <Box className={classes.datesContainer}>
            {!!startDate && (
              <Text color="soft" className={classes.date}>
                <LocaleDate date={startDate} />
              </Text>
            )}
            {!!startDate && !!deadline && <Text color="soft">-</Text>}
            {!!deadline && (
              <Text color="soft" className={classes.date}>
                <LocaleDate date={deadline} />
              </Text>
            )}
          </Box>
        </Box>

        <Text color="secondary">{klass.name}</Text>
      </Box>
    </Box>
  );
}

function useEmitValues({ control }) {
  const { setValue } = useFormContext();

  const { before, required } = useWatch({ control });
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (before?.length) {
      setValue('relatedAssignableInstances.before', [
        {
          id: before[0],
          required,
        },
      ]);
    } else {
      setValue('relatedAssignableInstances.before', []);
    }
  }, [before, required]);
}

export default function RelatedInstancesPicker({ labels }) {
  const { getValues } = useFormContext();
  const initialValue = React.useMemo(() => !!getValues('relations.before'), []);
  const { control } = useForm({
    defaultValues: {
      before: getValues('relatedAssignableInstances.before')?.[0]?.id,
      required: getValues('relatedAssignableInstances.before')?.[0]?.required,
    },
  });

  useEmitValues({ control });

  const data = useData({ labels });

  return (
    <ConditionalInput
      label={labels?.relations?.toggle}
      initialValue={initialValue}
      render={() => (
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing[2],
          })}
        >
          <Controller
            control={control}
            name="before"
            shouldUnregister
            rules={{ required: labels?.required }}
            render={({ field, formState: { errors } }) => (
              <Select
                {...field}
                sx={() => ({ maxWidth: 500 })}
                error={errors?.relations?.before}
                data={data}
                disabled={!data?.length}
                label={labels?.relations?.before}
                itemComponent={(item) => <ActivityItem {...item} />}
                valueComponent={(item) => <ActivityItem {...item} />}
                searchable
              />
            )}
          />
          <Controller
            control={control}
            name={'required'}
            render={({ field }) => <Switch {...field} label={labels?.relations?.required} />}
          />
        </Box>
      )}
    />
  );
}
