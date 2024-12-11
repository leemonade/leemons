import { useMemo } from 'react';

import useInstances from '@assignables/requests/hooks/queries/useInstances';
import useRole from '@assignables/requests/hooks/queries/useRole';
import useSearchOngoingActivities from '@assignables/requests/hooks/queries/useSearchOngoingActivities';
import { ImageLoader } from '@bubbles-ui/components';

import { useManualActivities } from '@scores/requests/hooks/queries/useManualActivities';
import useWeights from '@scores/requests/hooks/queries/useWeights';

const MODULES_ROLE = 'learningpaths.module';

function useManualActivitiesAsInstances({ class: klass }) {
  const { data: manualActivities, isLoading: manualActivitiesLoading } = useManualActivities({
    classId: klass,
    enabled: !!klass,
  });

  const instances = manualActivities?.map((activity) => ({
    id: activity.id,
    assignable: {
      asset: {
        name: activity.name,
      },
    },
  }));

  return {
    isLoading: manualActivitiesLoading,
    data: instances,
  };
}

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

  const { data: manualActivitiesInstances, isLoading: manualActivitiesInstancesLoading } =
    useManualActivitiesAsInstances({ class: klass });

  const instances = (moduleInstances ?? [])?.concat(manualActivitiesInstances ?? []);

  const data = useMemo(() => {
    if (!instances || !modules?.count) return [];

    return instances?.map((module) => {
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
  }, [weights, instances, modules?.count, role]);

  return {
    isLoading:
      roleLoading ||
      weightsLoading ||
      modulesLoading ||
      manualActivitiesInstancesLoading ||
      (moduleInstancesLoading && !!instances?.length),
    data,
  };
}
