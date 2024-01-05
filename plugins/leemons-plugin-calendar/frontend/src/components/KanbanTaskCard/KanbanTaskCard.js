import React, { useMemo } from 'react';
import {
  AvatarsGroup,
  Badge,
  Box,
  ImageLoader,
  ProgressColorBar,
  Text,
  TextClamp,
} from '@bubbles-ui/components';
import _, { filter, find, map } from 'lodash';
// TODO: import LibraryCardDeadline from plugin @leebrary
// import { LibraryCardDeadline } from '../../../../leebrary/src/components/LibraryCardDeadline';
import ClassroomItemDisplay from '@academic-portfolio/components/ClassroomItemDisplay/ClassroomItemDisplay';
import assignablePrefixPN from '@assignables/helpers/prefixPN';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import getDeadlineData from '@assignables/helpers/getDeadlineData';
import getColorByDateRange from '@assignables/helpers/getColorByDateRange';
import { NYACardBodyStyles } from '@assignables/components/NYACard/NYCardBody/NYACardBody.styles';
import { useSession } from '@users/session';
import getUserFullName from '@users/helpers/getUserFullName';
import getActivityType from '@assignables/helpers/getActivityType';
import { KanbanTaskCardStyles } from './KanbanTaskCard.styles';

const emptyPixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const KANBAN_TASK_CARD_DEFAULT_PROPS = {
  onClick: () => {},
};
export const KANBAN_TASK_CARD_PROP_TYPES = {};

const ProgressBar = ({ value }) => {
  const { classes, cx } = KanbanTaskCardStyles({ progress: value });
  return (
    <Box className={classes.progress}>
      {parseInt(value)}%
      <Box className={classes.progressOut}>
        <Box className={classes.progressIn} />
      </Box>
    </Box>
  );
};

const KanbanTaskCard = ({ value, config, onClick, labels, ...props }) => {
  const session = useSession();
  const classIds = [];
  if (value.uniqClasses) {
    value.uniqClasses.forEach((id) => {
      const ca = _.find(config.calendars, { id });
      if (ca) {
        classIds.push(ca.key.replace('calendar.class.', ''));
      }
    });
  }
  const { classes: classesNya } = NYACardBodyStyles({}, { name: 'NYACardBody' });
  const calendar = find(config.calendars, { id: value.calendar });
  if (!calendar) return null;

  const isFromInstance = !!value?.data?.instanceId;

  const { image } = value;

  const { classes, cx } = KanbanTaskCardStyles({
    classIds,
    bgColor: value.bgColor || calendar.bgColor,
    titleMargin:
      value.deadline ||
      value.endDate ||
      value?.data?.description ||
      (!isFromInstance && calendar.isUserCalendar),
  });

  const percentaje = useMemo(() => {
    if (value.data && value.data.subtask && value.data.subtask.length) {
      const total = value.data.subtask.length;
      const completed = filter(value.data.subtask, { checked: true }).length;
      return {
        total,
        completed,
        percentaje: parseInt((completed / total) * 100),
      };
    }
    return null;
  }, [value]);

  const avatar = {
    image: image || null,
    icon: value.icon ? (
      <Box className={classes.icon}>
        <ImageLoader
          height="14px"
          imageStyles={{
            width: 14,
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          src={value.icon}
          forceImage
        />
      </Box>
    ) : null,
    color: value.bgColor,
  };

  if (calendar.isUserCalendar) {
    avatar.fullName = calendar.fullName;
    avatar._icon = avatar.icon;
    avatar.icon = null;
  } else if (!avatar.image && !avatar.icon) {
    avatar.image = emptyPixel;
  }

  const { image: a, ...avatarNoImage } = avatar;
  if (!avatarNoImage.icon) {
    avatarNoImage.icon = avatarNoImage._icon;
  }

  const [t] = useTranslateLoader([prefixPN('kanbanCard')]);
  const [, translations] = useTranslateLoader([assignablePrefixPN('need_your_attention')]);
  const trans = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return {
        ..._.get(res, assignablePrefixPN('need_your_attention')),
      };
    }

    return {};
  }, [translations]);

  const end = value.deadline?.deadline || value.endDate;
  let endEl = null;
  const formattedDeadline = getDeadlineData(
    end ? new Date(end) : null,
    new Date(value.startDate),
    trans?.deadline || {}
  );
  const deadlineColors = getColorByDateRange(end ? new Date(end) : null, new Date(value.startDate));
  endEl = (
    <Box className={classesNya.deadline}>
      <Text className={classesNya.deadlineDate}>{`${formattedDeadline.date} - `}</Text>
      <Text className={classesNya.deadlineDate} style={{ color: deadlineColors }}>
        {formattedDeadline.status}
      </Text>
    </Box>
  );

  const activityType = getActivityType(value?.instanceData?.instance || {});

  return (
    <Box
      className={classes.root}
      style={{ cursor: value.disableDrag ? 'pointer' : 'grab' }}
      onClick={() => onClick(value)}
    >
      <Box className={classes.topSection}>
        {activityType && (
          <Badge
            sx={(theme) => ({ marginBottom: theme.spacing[3] })}
            closable={false}
            size="xs"
            className={classesNya.calificationBadge}
          >
            <Text className={classesNya.draftText}>{labels[activityType]?.toUpperCase()}</Text>
          </Badge>
        )}

        <TextClamp lines={2}>
          <Box className={classes.title}>{value.title}</Box>
        </TextClamp>

        <Box sx={(theme) => ({ marginTop: theme.spacing[4], marginBottom: theme.spacing[4] })}>
          {classIds.length ? (
            <ClassroomItemDisplay classroomIds={classIds} showSubject={true} />
          ) : (
            <Box style={{ display: 'flex' }}>
              <AvatarsGroup
                size="sm"
                data={map([...map(value?.userAgents, 'user'), session], (e) => ({
                  fullName: getUserFullName(e),
                }))}
                moreThanUsersAsMulti={2}
                numberFromClassesAndData
                customAvatarMargin={14}
                limit={2}
                zIndexInverted={true}
              />
            </Box>
          )}
        </Box>

        {endEl}

        {percentaje !== null ? (
          <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
            <ProgressColorBar
              labelLeft={
                <Box>
                  {t('progress')}: {percentaje.percentaje}%
                </Box>
              }
              labelRight={
                <Box>
                  ({percentaje.completed}/{percentaje.total}{' '}
                  {t(value?.instanceData ? 'activities' : 'subtask')})
                </Box>
              }
              size={'md'}
              value={percentaje.percentaje}
            />
          </Box>
        ) : null}
      </Box>

      {/*
      <Box className={classes.bottomSection}>
        <Box className={classes.bottomSectionBg} />
        <Box className={classes.bottomSectionContent}>

          <Box className={classes.avatar}>
            {!isFromInstance || (isFromInstance && (!avatar.image || !avatar.icon)) ? (
              <Box
                sx={(theme) => ({ display: 'inline-block', zIndex: 2, verticalAlign: 'middle' })}
              >
                <Avatar mx="auto" size="sm" {...avatar} />
              </Box>
            ) : null}

            {avatar.image && avatarNoImage.icon ? (
              <Box
                sx={(theme) => ({
                  display: 'inline-block',
                  marginLeft: -theme.spacing[2],
                  verticalAlign: 'middle',
                })}
              >
                <Avatar mx="auto" size="sm" {...avatarNoImage} />
              </Box>
            ) : null}
            {value.calendarName ? (
              <Paragraph size="xs" sx={(theme) => ({ marginLeft: theme.spacing[2], marginTop: 0 })}>
                {value.uniqClasses.length > 1 && !isFromInstance
                  ? `(${value.uniqClasses.length})`
                  : value.calendarName}
              </Paragraph>
            ) : null}
          </Box>

        </Box>
      </Box>
      */}
    </Box>
  );
};

KanbanTaskCard.defaultProps = KANBAN_TASK_CARD_DEFAULT_PROPS;
KanbanTaskCard.propTypes = KANBAN_TASK_CARD_PROP_TYPES;

export { KanbanTaskCard };
