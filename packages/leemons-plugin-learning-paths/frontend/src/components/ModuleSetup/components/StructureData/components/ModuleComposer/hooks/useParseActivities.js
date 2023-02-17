import React, { useMemo } from 'react';

import { ResourceRenderer } from '../components/ResourceRenderer';
import { TypeRenderer } from '../components/TypeRenderer';

export default function useParseActivities({ activities, localizations }) {
  return useMemo(
    () =>
      activities?.map(({ activity, id, default: defaultValues, original }, i) => ({
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
        original,
      })),
    [activities, localizations]
  );
}
