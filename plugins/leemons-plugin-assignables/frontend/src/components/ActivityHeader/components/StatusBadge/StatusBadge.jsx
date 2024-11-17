import { Badge, Text } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';

import StatusBadgesStyles from './StatusBadges.styles';

const possibleStatus = {
  archived: 'archived',
  closed: 'closed',
  programmed: 'programmed',
  open: 'open',
};

const useStatus = ({ instance }) => {
  const { start, deadline, archived, closed } = instance?.dates ?? {};
  const { alwaysAvailable } = instance ?? {};

  return useMemo(() => {
    const now = dayjs();
    const deadlinePassed = alwaysAvailable
      ? false
      : deadline && !dayjs(deadline ?? null).isAfter(now);
    const isClosed = (closed && !now.isBefore(dayjs(closed ?? null))) || deadlinePassed;
    const isArchived = archived && !now.isBefore(dayjs(archived ?? null));
    const isOpen = alwaysAvailable || (start && !dayjs(start ?? null).isAfter(now));
    const isProgrammed = !isOpen;

    if (isArchived) return possibleStatus.archived;
    if (isClosed) return possibleStatus.closed;
    if (isProgrammed) return possibleStatus.programmed;
    if (isOpen) return possibleStatus.open;

    return null;
  }, [start, deadline, archived, closed, alwaysAvailable]);
};

const useBadgeStyle = ({ status }) =>
  useMemo(() => {
    if (status === possibleStatus.archived) {
      return {
        badge: 'archivedActivityBadge',
        text: 'archivedActivityBadgeText',
        label: 'archived',
      };
    }
    if (status === possibleStatus.closed) {
      return { badge: 'badge', text: 'badgeText', label: 'closed' };
    }

    if (status === possibleStatus.programmed) {
      return { badge: 'badge', text: 'badgeText', label: 'assigned' };
    }

    return { badge: 'openActivityBadge', text: 'openActivityBadgeText', label: 'opened' };
  }, [status]);

const StatusBadge = ({ instance }) => {
  const [t] = useTranslateLoader(prefixPN('activity_status'));

  const status = useStatus({ instance });
  const style = useBadgeStyle({ status });
  const { classes } = StatusBadgesStyles();

  return (
    <Badge className={classes[style.badge]} closable={false} size="xs">
      <Text className={classes[style.text]}>{t(style.label).toUpperCase()}</Text>
    </Badge>
  );
};

StatusBadge.propTypes = { instance: PropTypes.object };

export default StatusBadge;
