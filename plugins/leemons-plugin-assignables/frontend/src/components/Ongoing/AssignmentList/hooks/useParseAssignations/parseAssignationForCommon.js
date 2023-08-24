import React from 'react';

import { Box, createStyles, ImageLoader, Text, TextClamp } from '@bubbles-ui/components';
import { LocaleDate, unflatten } from '@common';

import dayjs from 'dayjs';
import { get, mapValues, pick } from 'lodash';
import getClassData from '@assignables/helpers/getClassData';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { useIsTeacher } from '@academic-portfolio/hooks';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';

const useActivityItemStyles = createStyles((theme, { activityColor }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing[5],
    alignItems: 'center',
  },
  activityType: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    background: activityColor || theme.other.global.background.color.surface.emphasis,
    borderRadius: theme.radius.md,

    bottom: theme.spacing[1],
    left: theme.spacing[1],
    width: 20,
    height: 20,
  },
  activityTypeIcon: {
    width: 12,
    height: 12,
    filter: 'brightness(0) invert(1)',
  },
  cover: {
    position: 'relative',
    border: `1px solid ${theme.other.global.border.color.line.muted}`,
    borderRadius: theme.other.global.border.radius.sm,
  },
  coverFallback: {
    width: 40,
    height: 40,
    background: theme.other.global.background.color.surface.subtle,
  },
}));

function ActivityItem({ instance }) {
  const assignable = instance?.assignable;
  const activityColor = assignable.asset.color;
  const activityTypeIcon = assignable.roleDetails.icon;

  const preparedAsset = prepareAsset(assignable?.asset);

  const { classes } = useActivityItemStyles({ activityColor });

  return (
    <Box className={classes.root}>
      <Box className={classes.cover}>
        {preparedAsset?.cover ? (
          <ImageLoader src={preparedAsset?.cover} width={40} height={40} />
        ) : (
          <Box className={classes.coverFallback} />
        )}
        <Box className={classes.activityType}>
          <Box className={classes.activityTypeIcon}>
            <ImageLoader src={activityTypeIcon} width={12} height={12} />
          </Box>
        </Box>
      </Box>
      <TextClamp lines={1}>
        <Text>{assignable?.asset?.name}</Text>
      </TextClamp>
    </Box>
  );
}

const useSubjectItemStyles = createStyles((theme, { iconColor }) => {
  const iconWrapperWidth = theme.spacing[5];
  const iconWidth = iconWrapperWidth / 2;
  const rowsGap = theme.spacing[2];
  const secondRowMargin = iconWrapperWidth + rowsGap;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    row: {
      display: 'flex',
      gap: rowsGap,
    },
    secondRow: {
      marginLeft: secondRowMargin,
    },
    internalId: {
      whiteSpace: 'nowrap',
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: iconWrapperWidth,
      height: iconWrapperWidth,
      borderRadius: theme.other.global.border.radius.rounded,
      backgroundColor: iconColor,
    },
    svg: {
      width: iconWidth,
      height: iconWidth,
      borderRadius: 0,
      filter: 'brightness(0) invert(1)',
    },
    subjectName: {
      maxHeight: '1rem',
    },
  };
});

function SubjectItem({ classData, studentsLength, fullLength }) {
  const { classes, cx } = useSubjectItemStyles({ iconColor: classData.color });

  const isTeacher = useIsTeacher();
  return (
    <Box className={classes.root}>
      <Box className={classes.row}>
        <Box className={classes.icon}>
          <Box className={classes.svg}>
            {!!classData?.icon && <ImageLoader src={classData?.icon} width={12} height={12} />}
          </Box>
        </Box>
        <TextClamp lines={1} strong>
          <Text strong className={classes.subjectName}>
            {classData.subjectName}
          </Text>
        </TextClamp>
        {!!classData.internalId && (
          <Text strong className={classes.internalId}>
            - {classData.internalId}
          </Text>
        )}
      </Box>
      <Box className={cx(classes.row, classes.secondRow)}>
        <Text>{classData.groupName}</Text>
        {!!(isTeacher && typeof studentsLength === 'number') && <Text>({studentsLength})</Text>}
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
    return <Text>{localizations?.assigned}</Text>;
  }

  if (isOpen) {
    return <Text>{localizations?.opened}</Text>;
  }

  return <Text>{localizations?.closed}</Text>;
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

export async function parseAssignationForCommonView(instance, labels, { subjectFullLength }) {
  const parsedDates = parseDates(instance.dates, ['start', 'deadline']);
  const classData = await getClassData(instance.classes, {
    multiSubject: labels.multiSubject,
    groupName: instance?.metadata?.groupName,
  });

  return {
    id: instance.id,
    activity: <ActivityItem instance={instance} />,
    subject: (
      <SubjectItem
        classData={classData}
        studentsLength={instance.students?.length}
        fullLength={subjectFullLength}
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
