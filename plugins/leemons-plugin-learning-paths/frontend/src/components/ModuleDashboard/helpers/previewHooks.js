import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { useSubjectDetails } from '@academic-portfolio/hooks';
import { getMultiClassData } from '@assignables/helpers/getClassData';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import useAssignables from '@assignables/requests/hooks/queries/useAssignables';
import { addErrorAlert } from '@layout/alert';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { capitalize, get, keyBy, map, mapValues } from 'lodash';
import { useEffect, useMemo } from 'react';

export function useModuleDataForPreview(id) {
  const {
    data: module,
    isLoading: isLoadingModule,
    error: moduleError,
    isError: isModuleError,
  } = useAssignables({ id, enabled: !!id });

  const activitiesIds = useMemo(
    () => map(module?.submission?.activities, 'activity'),
    [module?.submission?.activities]
  );

  const {
    data: activities,
    isLoading: isLoadingActivities,
    isError: isActivitiesError,
    error: activitiesError,
  } = useAssignables({
    ids: activitiesIds,
    enabled: !!activitiesIds?.length,
    select: (data) => keyBy(data, 'id'),
  });

  useEffect(() => {
    if (moduleError) {
      addErrorAlert(moduleError);
    }
  }, [moduleError]);

  useEffect(() => {
    if (activitiesError) {
      addErrorAlert(activitiesError);
    }
  }, [activitiesError]);

  const errors = useMemo(
    () => [moduleError, activitiesError].filter(Boolean),
    [moduleError, activitiesError]
  );

  const activitiesById = useMemo(
    () =>
      mapValues(activities, (activity) => ({
        assignable: activity,
        dates: {},
        alwaysAvailable: true,
      })),
    [activities]
  );

  return {
    module: { assignable: module },
    activitiesById,
    activities:
      module?.submission?.activities?.map((activity) => ({ id: activity.activity })) ?? [],
    assignationsById: {},

    isLoading: isLoadingActivities || isLoadingModule,
    isError: isModuleError || isActivitiesError,
    errors,
  };
}

function useSubjectsData(module) {
  const { assignable } = module || {};
  const subjects = map(assignable?.subjects, 'subject') ?? [];
  const { data: subjectsDetails } = useSubjectDetails(subjects);

  return subjectsDetails?.map((subject) => ({
    id: subject.id,
    name: subject.name,
    subjectName: subject.name,
    icon: getClassIcon({ subject }),
    color: subject.color,
    customGroup: false,
  }));
}

export function useHeaderDataForPreview(module) {
  const { assignable } = module ?? {};
  const { asset, roleDetails, role } = assignable ?? {};
  const { name } = asset ?? {};

  const preparedAsset = prepareAsset(asset ?? {});
  const roleLocalizations = useRolesLocalizations([role]);

  const subjectsData = useSubjectsData(module);
  const { icon, color } = getMultiClassData({});

  return {
    header: {
      title: name,

      icon: subjectsData?.length > 1 ? icon : subjectsData?.[0]?.icon ?? icon,
      color: subjectsData?.length > 1 ? color : subjectsData?.[0]?.color ?? color,
      image: preparedAsset?.cover ?? null,
      subjects: subjectsData,
      activityType: {
        icon: roleDetails?.icon,
        type: capitalize(get(roleLocalizations, `${role}.singular`)),
      },
      activityDates: null,
    },
  };
}
