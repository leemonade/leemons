import { useMemo } from 'react';

import { ActionButton, Stack } from '@bubbles-ui/components';
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
        actions: (
          <Stack fullWidth justifyContent="flex-end">
            <ActionButton
              onClick={() => onRemove(id)}
              icon={<DeleteBinIcon width={18} height={18} />}
            />
          </Stack>
        ),
        original,
      })),
    [activities, localizations]
  );
}
