import React, { useMemo } from 'react';

import { ImageLoader } from '@bubbles-ui/components';

import useWeights from '@scores/requests/hooks/queries/useWeights';
import useSearchOngoingActivities from '@assignables/requests/hooks/queries/useSearchOngoingActivities';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import useRole from '@assignables/requests/hooks/queries/useRole';

const MODULES_ROLE = 'learningpaths.module';

export default function useModulesData({ class: klass }) {
  const { data: role, isLoading: roleLoading } = useRole({ role: MODULES_ROLE });
  const { data: weights, isLoading: weightsLoading } = useWeights({
    classId: klass,
    enabled: !!klass,
  });

  const { data: modules, isLoading: modulesLoading } = useSearchOngoingActivities({
    role: MODULES_ROLE,
    classes: JSON.stringify([klass]),
    limit: Infinity,
    enabled: !!klass,
  });
  const { data: moduleInstances, isLoading: moduleInstancesLoading } = useInstances({
    ids: modules?.items,
    enabled: !!modules?.items?.length,
  });

  const data = useMemo(() => {
    if (!moduleInstances || !modules?.count) return [];

    return moduleInstances?.map((module) => {
      const weight = weights?.weights?.find((w) => w.id === module.id);

      return {
        id: module.id,
        name: module.assignable.asset.name,
        icon: !!role && <ImageLoader src={role?.icon} />,
        weight: weight?.weight ?? 0,
        isLocked: !!weight && weight.isLocked,
        isNew: weights?.weights && !weight,
      };
    });
  }, [weights, moduleInstances, modules?.count, role]);

  return {
    isLoading:
      roleLoading ||
      weightsLoading ||
      modulesLoading ||
      (moduleInstancesLoading && !!modules?.items?.length),
    data,
  };
}
