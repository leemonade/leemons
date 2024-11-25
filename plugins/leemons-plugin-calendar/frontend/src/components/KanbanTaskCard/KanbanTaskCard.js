/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable import/prefer-default-export */
import { useMemo } from 'react';

import ClassroomItemDisplay from '@academic-portfolio/components/ClassroomItemDisplay/ClassroomItemDisplay';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { NYACardBodyStyles } from '@assignables/components/NYACard/NYCardBody/NYACardBody.styles';
import getActivityType from '@assignables/helpers/getActivityType';
import getColorByDateRange from '@assignables/helpers/getColorByDateRange';
import getDeadlineData from '@assignables/helpers/getDeadlineData';
import assignablePrefixPN from '@assignables/helpers/prefixPN';
import {
  AvatarsGroup,
  Badge,
  Box,
  ImageLoader,
  ProgressColorBar,
  Text,
  TextClamp,
} from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useSession } from '@users/session';
import _, { filter, find, map } from 'lodash';

import {
  KANBAN_TASK_CARD_PROP_TYPES,
  KANBAN_TASK_CARD_DEFAULT_PROPS,
  emptyPixel,
} from './KanbanTaskCard.constants';
import { KanbanTaskCardStyles } from './KanbanTaskCard.styles';
import prefixPN from '@calendar/helpers/prefixPN';
import getUserFullName from '@users/helpers/getUserFullName';

const getClassIds = (value, config) => {
  const classIds = [];
  if (value.uniqClasses) {
    value.uniqClasses.forEach((id) => {
      const ca = _.find(config.calendars, { id });
      if (ca) {
        classIds.push(ca.key.replace('calendar.class.', ''));
      }
    });
  }
  return classIds;
};

const getCalendar = (value, config) => find(config.calendars, { id: value.calendar });

const KanbanTaskCard = ({ value, config, onClick, labels }) => {
  const session = useSession();
  const classIds = getClassIds(value, config);
  const isTeacher = useIsTeacher();

  const { classes: classesNya } = NYACardBodyStyles({}, { name: 'NYACardBody' });
  const calendar = getCalendar(value, config);
  if (!calendar) return null;

  const isFromInstance = !!value?.data?.instanceId;

  const { image } = value;

  const { classes } = KanbanTaskCardStyles({
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

  if (isTeacher && isFromInstance && trans?.deadline) {
    trans.deadline.late = null;
  }

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
      <Text className={classesNya.deadlineDate}>{`${formattedDeadline.date}${
        formattedDeadline.status ? ' - ' : ''
      }`}</Text>
      {!!formattedDeadline.status && (
        <Text className={classesNya.deadlineDate} style={{ color: deadlineColors }}>
          {formattedDeadline.status}
        </Text>
      )}
    </Box>
  );

  const activityType = getActivityType(value?.instanceData?.instance || {});
  const isModule = value?.instanceData?.instance?.assignable?.role === 'learningpaths.module';
  return (
    <Box
      className={classes.root}
      style={{ cursor: value.disableDrag ? 'pointer' : 'grab' }}
      onClick={() => onClick(value)}
    >
      <Box className={classes.topSection}>
        {activityType && !isModule && (
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
                  fullName: getUserFullName(e, { singleSurname: true }),
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
    </Box>
  );
};

KanbanTaskCard.defaultProps = KANBAN_TASK_CARD_DEFAULT_PROPS;
KanbanTaskCard.propTypes = KANBAN_TASK_CARD_PROP_TYPES;

export { KanbanTaskCard };
