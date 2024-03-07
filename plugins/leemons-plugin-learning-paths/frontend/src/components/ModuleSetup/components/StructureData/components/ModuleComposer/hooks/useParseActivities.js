import React, { useMemo } from 'react';

import { ActionButton } from '@bubbles-ui/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { ResourceRenderer } from '../components/ResourceRenderer';

export default function useParseActivities({ activities, localizations, onRemove }) {
  return useMemo(
    () =>
      activities?.map(({ activity, id, original }) => ({
        id,
        resource: (
          <ResourceRenderer
            key={`${id}-resource`}
            activity={activity}
            localizations={localizations}
          />
        ),
        actions: (
          <ActionButton
            onClick={() => onRemove(id)}
            icon={<DeleteBinIcon width={18} height={18} />}
          />
        ),
        original,
      })),
    [activities, localizations]
  );
}
