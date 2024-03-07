import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Box, Button, Table, ContextContainer } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';

import { get, head, map, uniq } from 'lodash';

import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import { useCache } from '@common';
import { useQueries } from '@tanstack/react-query';
import getAssignablesRequest from '@assignables/requests/assignables/getAssignables';
import { assignablesGetKey } from '@assignables/requests/hooks/keys/assignables';
import { useParseActivities } from './hooks';

export function useColumns({ localizations }) {
  return useMemo(
    () => [
      {
        Header: localizations?.resource ?? '',
        accessor: 'resource',
      },
      {
        Header: localizations?.actions ?? '',
        accessor: 'actions',
      },
    ],
    [localizations]
  );
}

function useAssignables(ids) {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: assignablesGetKey({ id, withFiles: false, deleted: false }),
      queryFn: () => getAssignablesRequest(id).then(head),
      staleTime: 20000,
    })),
  });

  return map(queries, 'data').filter(Boolean);
}

function useSelectedActivities() {
  const [sharedData] = useModuleSetupContext();

  const cache = useCache();
  const activitiesPicked = get(sharedData, 'state.activities', []);

  const activitiesIds = useMemo(() => {
    const ids = uniq(map(activitiesPicked, 'activity'));

    return cache('activitiesIds', ids);
  }, [activitiesPicked]);

  const activities = useAssignables(activitiesIds);

  const activitiesById = useMemo(
    () => Object.fromEntries(activities.map((activity) => [activity.id, activity])),
    [activities]
  );

  return cache(
    'activities',
    useMemo(
      () =>
        activitiesPicked
          .map((activity) => ({
            ...activity,
            activity: activitiesById[activity.activity],
            original: activity,
          }))
          .filter((activity) => !!activity.activity),
      [activitiesById, activitiesPicked]
    )
  );
}

export function ModuleComposer({ localizations, onSelectAsset, onRemoveAsset, onActivityChange }) {
  const columns = useColumns({
    localizations: localizations?.steps?.resources?.moduleComposer?.columns,
  });

  const activities = useSelectedActivities();
  const parsedActivities = useParseActivities({
    activities,
    localizations: localizations?.moduleComposer,
    onRemove: onRemoveAsset,
  });

  return (
    <ContextContainer title={localizations?.moduleComposer?.title}>
      <Box sx={() => ({ width: '50%', minWidth: 550 })}>
        <Table
          columns={columns}
          data={parsedActivities}
          sortable={parsedActivities?.length > 1}
          labels={{ add: '' }}
          headerStyles={{ display: 'none' }}
          onChangeData={({ newData }) => onActivityChange(map(newData, 'original'))}
        />
      </Box>
      <Box>
        <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onSelectAsset}>
          {localizations?.buttons?.new}
        </Button>
      </Box>
    </ContextContainer>
  );
}

ModuleComposer.propTypes = {
  activities: PropTypes.array,
  localizations: PropTypes.object,
  onRemoveAsset: PropTypes.func,
  onSelectAsset: PropTypes.func,
  onActivityChange: PropTypes.func,
};
