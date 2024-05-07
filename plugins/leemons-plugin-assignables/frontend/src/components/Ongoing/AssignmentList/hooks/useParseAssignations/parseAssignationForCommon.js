import React, { useMemo } from 'react';

import { Box, createStyles, ImageLoader, Text, TextClamp } from '@bubbles-ui/components';
import { ChevronDownIcon, ChevronUpIcon } from '@bubbles-ui/icons/outline';
import { LocaleDate, unflatten } from '@common';

import dayjs from 'dayjs';
import { get, mapValues, pick, noop } from 'lodash';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import { ClassroomItemDisplay } from '@academic-portfolio/components';

const useActivityItemStyles = createStyles((theme, { isModuleActivity }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.other.global.spacing.gap.md,
    alignItems: 'center',
    paddingLeft: isModuleActivity ? 40 : 0,
  },
  activityType: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.md,

    width: 20,
    height: 20,
  },
  activityTypeIcon: {
    position: 'relative',
    width: 18,
    height: 18,
    color: theme.other.global.content.color.icon.default,
  },
  cover: {
    border: `1px solid ${theme.other.global.border.color.line.muted}`,
    borderRadius: theme.other.global.border.radius.sm,
  },
  coverFallback: {
    width: 40,
    height: 40,
    background: theme.other.global.background.color.surface.subtle,
  },
  role: {
    fontSize: 10,
    fontWeight: 600,
  },
}));

export function ActivityItem({ instance, onModuleClick = noop, modulesOpened = [], flattened }) {
  const assignable = instance?.assignable;
  const role = assignable?.role;
  const activityColor = assignable.asset.color;
  const activityTypeIcon = assignable.roleDetails.icon;

  const isOpened = useMemo(
    () => modulesOpened?.includes(instance?.id),
    [modulesOpened, instance?.id]
  );

  const rolesLocalizations = useRolesLocalizations([role]);

  const preparedAsset = prepareAsset(assignable?.asset);

  const { classes, theme } = useActivityItemStyles({
    activityColor,
    isModuleActivity: !flattened && instance?.metadata?.module?.type === 'activity',
  });

  return (
    <Box className={classes.root}>
      <Box
        className={classes.activityType}
        onClick={(e) => {
          if (onModuleClick && role === 'learningpaths.module') {
            onModuleClick(instance?.id);
            e.stopPropagation();
          }
        }}
      >
        <Box className={classes.activityTypeIcon}>
          {role === 'learningpaths.module' && isOpened && (
            <ChevronUpIcon color={theme.other.button.content.color.secondary.default} />
          )}
          {role === 'learningpaths.module' && !isOpened && (
            <ChevronDownIcon color={theme.other.button.content.color.secondary.default} />
          )}
          {role !== 'learningpaths.module' && (
            <ImageLoader src={activityTypeIcon} width={18} height={18} />
          )}
        </Box>
      </Box>
      <Box className={classes.cover}>
        {preparedAsset?.cover ? (
          <ImageLoader src={preparedAsset?.cover} width={40} height={40} />
        ) : (
          <Box className={classes.coverFallback} />
        )}
      </Box>
      <Box>
        {role === 'learningpaths.module' && (
          <Box className={classes.role}>
            <TextClamp lines={1}>
              <Text transform="uppercase">{rolesLocalizations?.[role]?.singular}</Text>
            </TextClamp>
          </Box>
        )}
        <TextClamp lines={1}>
          <Text>{assignable?.asset?.name}</Text>
        </TextClamp>
      </Box>
    </Box>
  );
}

function useStatusLocalizations() {
  const [, translations] = useTranslateLoader(prefixPN('activity_status'));

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return get(res, prefixPN('activity_status'));
    }

    return {};
  }, [translations]);
}

function Status({ instance }) {
  const localizations = useStatusLocalizations();
  const { alwaysAvailable: isAlwaysAvailable } = instance;

  const now = dayjs();

  const startDate = React.useMemo(
    () => dayjs(instance.dates.start || null),
    [instance.dates.start]
  );
  const deadline = React.useMemo(
    () => dayjs(instance.dates.deadline || null),
    [instance.dates.deadline]
  );
  const closedDate = React.useMemo(
    () => dayjs(instance.dates.closed || null),
    [instance.dates.closed]
  );

  const isStarted = React.useMemo(
    () => !isAlwaysAvailable && startDate.isValid() && !now.isBefore(startDate),
    [isAlwaysAvailable, now, startDate]
  );
  const isDeadline = React.useMemo(
    () => !isAlwaysAvailable && deadline.isValid() && !now.isBefore(deadline),
    [isAlwaysAvailable, now, deadline]
  );
  const isClosed = React.useMemo(
    () => closedDate.isValid() && !now.isBefore(closedDate),
    [now, closedDate]
  );

  const isOpen = (isAlwaysAvailable || !isDeadline) && !isClosed;

  if (!isAlwaysAvailable && !isStarted) {
    return <Text color="primary">{localizations?.assigned}</Text>;
  }

  if (isOpen) {
    return <Text color="primary">{localizations?.opened}</Text>;
  }

  return <Text color="primary">{localizations?.closed}</Text>;
}

function parseDates(dates, keysToParse) {
  let datesToParse = dates;

  if (keysToParse?.length) {
    datesToParse = pick(dates, keysToParse);
  }

  return mapValues(datesToParse, (date) => (
    <LocaleDate date={date} options={{ dateStyle: 'short', timeStyle: 'short' }} />
  ));
}

export async function parseAssignationForCommonView(
  instance,
  labels,
  { subjectFullLength, onModuleClick, modulesOpened }
) {
  const parsedDates = parseDates(instance.dates, ['start', 'deadline']);

  return {
    id: instance.id,
    parentModule: instance.metadata?.module?.id ?? null,
    trStyle: instance.metadata?.module?.id ? { backgroundColor: '#F8F9FB' } : null,
    activity: (
      <ActivityItem
        instance={instance}
        onModuleClick={onModuleClick}
        modulesOpened={modulesOpened}
      />
    ),
    subject: (
      <ClassroomItemDisplay
        classroomIds={instance.classes}
        showSubject={!!subjectFullLength}
        compact
      />
    ),
    parsedDates: {
      deadline: '-',
      start: '-',
      ...parsedDates,
    },
    status: <Status instance={instance} />,
  };
}

export default parseAssignationForCommonView;
