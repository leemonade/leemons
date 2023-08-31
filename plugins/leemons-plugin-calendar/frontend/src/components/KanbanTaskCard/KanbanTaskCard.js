import React from 'react';

import {
  Avatar,
  Box,
  ImageLoader,
  Paper,
  Paragraph,
  Text,
  TextClamp,
} from '@bubbles-ui/components';
import dayjs from 'dayjs';
import { filter, find } from 'lodash';
import { useMemo } from 'react';
//TODO: import LibraryCardDeadline from plugin @leebrary
// import { LibraryCardDeadline } from '../../../../leebrary/src/components/LibraryCardDeadline';
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
  const calendar = find(config.calendars, { id: value.calendar });
  if (!calendar) return null;

  const isFromInstance = !!value?.data?.instanceId;

  const image = value.image;

  const { classes, cx } = KanbanTaskCardStyles({
    bgColor: value.disableDrag ? value.bgColor || calendar.bgColor : null,
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
      return parseInt((completed / total) * 100);
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

  return (
    <Paper
      shadow="none"
      className={classes.root}
      style={{ cursor: value.disableDrag ? 'pointer' : 'grab' }}
      onClick={() => onClick(value)}
    >
      <Box className={classes.topSection}>
        <Box className={classes.title}>{value.title}</Box>

        {value.deadline ||
        value.endDate ||
        value?.data?.description ||
        (!isFromInstance && calendar.isUserCalendar) ? (
          <Box className={classes.line}></Box>
        ) : null}

        {value.data && value.data.description ? (
          <Box className={classes.description}>
            <TextClamp lines={1} showTooltip>
              <Text role="productive">{value.data.description}</Text>
            </TextClamp>
          </Box>
        ) : null}

        {value.deadline && isFromInstance ? (
          <Box sx={(theme) => ({ margin: `-0.5rem` })}>
            {/* <LibraryCardDeadline {...value.deadline} /> */}
          </Box>
        ) : value.endDate ? (
          <Text size="xs">
            {labels.delivery} {dayjs(value.endDate).format('DD/MM/YYYY HH:mm')}
          </Text>
        ) : null}
      </Box>
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
          {percentaje !== null ? (
            <Box>
              <ProgressBar value={percentaje} />
            </Box>
          ) : null}
        </Box>
      </Box>
    </Paper>
  );
};

KanbanTaskCard.defaultProps = KANBAN_TASK_CARD_DEFAULT_PROPS;
KanbanTaskCard.propTypes = KANBAN_TASK_CARD_PROP_TYPES;

export { KanbanTaskCard };
