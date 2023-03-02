import React, { useMemo } from 'react';

import { DeleteBinIcon } from '@bubbles-ui/icons/outline';
import { ResourceRenderer } from '../components/ResourceRenderer';
import { TypeRenderer } from '../components/TypeRenderer';

export default function useParseActivities({ activities, localizations, onRemove }) {
  return useMemo(
    () =>
      activities?.map(({ activity, id, default: defaultValues, original }, i) => ({
        id,
        resource: (
          <ResourceRenderer
            key={`${id}-resource`}
            activity={activity}
            localizations={localizations}
          />
        ),
        type: (
          <TypeRenderer
            key={`${id}-type`}
            activity={activity}
            id={id}
            defaultValue={defaultValues?.type}
            position={i}
            localizations={localizations?.types}
          />
        ),
        actions: <DeleteBinIcon style={{ cursor: 'pointer' }} onClick={() => onRemove(id)} />,
        original,
      })),
    [activities, localizations]
  );
}
