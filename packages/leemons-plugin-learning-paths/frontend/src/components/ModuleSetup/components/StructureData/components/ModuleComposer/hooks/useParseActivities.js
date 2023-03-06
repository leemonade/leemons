import React, { useMemo } from 'react';

import { DeleteBinIcon } from '@bubbles-ui/icons/outline';
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
        actions: <DeleteBinIcon style={{ cursor: 'pointer' }} onClick={() => onRemove(id)} />,
        original,
      })),
    [activities, localizations]
  );
}
