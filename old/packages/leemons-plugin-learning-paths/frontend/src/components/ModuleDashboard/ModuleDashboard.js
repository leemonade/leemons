import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Box, HtmlText, Loader, Text, createStyles } from '@bubbles-ui/components';
import { capitalize, get, map, sortBy } from 'lodash';

import { useIsStudent } from '@academic-portfolio/hooks';
import useAssignationsByProfile from '@assignables/hooks/assignations/useAssignationsByProfile';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import { unflatten } from '@common';
import { addErrorAlert } from '@layout/alert';
import { prefixPN } from '@learning-paths/helpers';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { ActivityContainer } from '@bubbles-ui/leemons';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import useClassData from '@assignables/hooks/useClassDataQuery';
import { getMultiClassData } from '@assignables/helpers/getClassData';
import Sidebar from '@tasks/components/Student/TaskDetail/components/Sidebar/Sidebar';
import { DashboardCard } from './components/DashboardCard';
import { useHeaderDataForPreview, useModuleDataForPreview } from './helpers/previewHooks';

export function useModuleDashboardLocalizations() {
  // key is string
  const key = prefixPN('dashboard');
  const [, translations] = useTranslateLoader(key);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return get(res, key);
    }

    return {};
  });
}

export const useModuleDashboardStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      minHeight: '100vh',
      background: globalTheme.background.color.surface.subtle,
    },
    rootContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.padding.xlg,

      paddingTop: globalTheme.spacing.padding.xlg,
      paddingBottom: globalTheme.spacing.padding.xlg,
      paddingLeft: globalTheme.spacing.padding['3xlg'],
      paddingRight: globalTheme.spacing.padding['3xlg'],
    },
    sectionHeader: {
      ...globalTheme.content.typo.heading.sm,
      color: globalTheme.content.color.text.default,
    },
    activitiesList: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.xlg,
      flexWrap: 'wrap',
    },
    body: {
      display: 'flex',
    },
  };
});

export function useModuleData(id) {
  const {
    data: module,
    isLoading: isLoadingModule,
    error: moduleError,
    isError: isModuleError,
  } = useInstances({ id });

  const activitiesIds = useMemo(
    () => map(module?.metadata?.module?.activities, 'id'),
    [module?.metadata?.module?.activities]
  );

  const {
    data: activitiesByProfile,
    isLoading: isLoadingActivities,
    error: activitiesError,
    isError: isActivitiesError,
  } = useAssignationsByProfile(activitiesIds, { enabled: !!activitiesIds?.length });

  const isStudent = useIsStudent();

  const { assignations, activities } = useMemo(() => {
    if (isStudent) {
      return {
        assignations: activitiesByProfile,
        activities: map(activitiesByProfile, 'instance'),
      };
    }

    return { assignations: [], activities: activitiesByProfile };
  }, [activitiesByProfile, isStudent]);

  const activitiesById = useMemo(() => {
    const object = {};

    activities?.forEach((activity) => {
      object[activity.id] = activity;
    });

    return object;
  }, [activities]);

  const assignationsById = useMemo(() => {
    const object = {};

    assignations?.forEach((assignation) => {
      object[assignation.instance.id] = assignation;
    });

    return object;
  }, [assignations]);

  const errors = useMemo(
    () => [moduleError, activitiesError].filter(Boolean),
    [moduleError, activitiesError]
  );

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

  return {
    module,
    activitiesById,
    assignationsById,
    activities: module?.metadata?.module?.activities ?? [],

    isLoading: isLoadingActivities || isLoadingModule,
    isError: isModuleError || isActivitiesError,
    errors,
  };
}

function useHeaderData(module) {
  const { assignable, dates, alwaysAvailable } = module ?? {};
  const { asset, roleDetails, role } = assignable ?? {};
  const { name } = asset ?? {};

  const preparedAsset = prepareAsset(asset ?? {});
  const roleLocalizations = useRolesLocalizations([role]);

  const { data: classesData } = useClassData(module, {}, { multiSubject: true });
  const { icon, color } = getMultiClassData({});

  return {
    header: {
      title: name,

      icon: classesData?.length > 1 ? icon : classesData?.[0]?.icon,
      color: classesData?.length > 1 ? color : classesData?.[0]?.color,
      image: preparedAsset?.cover ?? null,
      subjects: classesData,
      activityType: {
        icon: roleDetails?.icon,
        type: capitalize(get(roleLocalizations, `${role}.singular`)),
      },
      activityDates: alwaysAvailable
        ? null
        : {
          startLabel: 'Desde',
          endLabel: 'Hasta',
          hourLabel: 'Hora',
          startDate: new Date(dates?.start),
          endDate: new Date(dates?.deadline),
        },
    },
  };
}

function useBlockedActivities({ activities, assignationsById }) {
  const isStudent = useIsStudent();

  return useMemo(() => {
    if (!isStudent) {
      return [];
    }

    const blockedActivities = [];

    for (let i = 0, { length } = activities, blocking = false; i < length; i++) {
      const { id, requirement } = activities[i];
      const assignation = assignationsById[id];

      if (blocking) {
        blockedActivities[id] = true;
      } else if (requirement === 'blocking' && !assignation?.finished) {
        blocking = true;
      }
    }

    return blockedActivities;
  }, [activities, assignationsById, isStudent]);
}

export const useModuleDashboardBodyStyles = createStyles((theme, { marginTop }) => ({
  sidebarContainer: {
    minWidth: 280,
    maxWidth: 280,
  },
  sidebar: {
    width: 280,
    position: 'absolute',
    height: `calc(100% - ${marginTop})`,
    right: 0,
    top: marginTop,
  },
}));

export function ModuleDashboardBody({
  classes,
  localizations,
  activities,
  activitiesById,
  assignationsById,
  module,
  marginTop,
  preview,
}) {
  const { classes: sidebarClasses } = useModuleDashboardBodyStyles({ marginTop });

  const blockedActivities = useBlockedActivities({ activities, activitiesById, assignationsById });

  return (
    <Box className={classes.body}>
      <Box className={classes.rootContainer}>
        <Text className={classes.sectionHeader}>{localizations?.activities}</Text>
        {!!module?.metadata?.statement && <HtmlText>{module?.metadata?.statement}</HtmlText>}
        <Box className={classes.activitiesList}>
          {sortBy(
            activities?.map((activity) => ({
              comp: (
                <DashboardCard
                  isBlocked={!!blockedActivities[activity?.id]}
                  localizations={localizations}
                  activity={activitiesById[activity?.id]}
                  assignation={assignationsById[activity?.id]}
                  key={activity?.id}
                  preview={preview}
                />
              ),
              created_at: activitiesById[activity?.id].created_at,
            })),
            'created_at'
          ).map((a) => a.comp)}
        </Box>
      </Box>
      <Box className={sidebarClasses.sidebarContainer}>
        <Box className={sidebarClasses.sidebar}>
          <Sidebar assignation={{ instance: module }} labels={localizations} show />
        </Box>
      </Box>
    </Box>
  );
}

ModuleDashboardBody.propTypes = {
  classes: PropTypes.arrayOf(PropTypes.object),
  localizations: PropTypes.object,
  activities: PropTypes.arrayOf(PropTypes.object),
  activitiesById: PropTypes.object,
  assignationsById: PropTypes.object,
  module: PropTypes.object,
  marginTop: PropTypes.number,
  preview: PropTypes.bool,
};

export function ModuleDashboard({ id, preview }) {
  const { module, activities, activitiesById, assignationsById, isLoading } = preview
    ? useModuleDataForPreview(id)
    : useModuleData(id);
  const localizations = useModuleDashboardLocalizations();
  const headersData = preview ? useHeaderDataForPreview(module) : useHeaderData(module);

  const { classes } = useModuleDashboardStyles();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box className={classes.root}>
      <ActivityContainer {...headersData} collapseOnScroll>
        <ModuleDashboardBody
          activities={activities}
          activitiesById={activitiesById}
          assignationsById={assignationsById}
          classes={classes}
          localizations={localizations}
          module={module}
          preview={preview}
        />
      </ActivityContainer>
    </Box>
  );
}

ModuleDashboard.propTypes = {
  id: PropTypes.string,
  preview: PropTypes.bool,
};
