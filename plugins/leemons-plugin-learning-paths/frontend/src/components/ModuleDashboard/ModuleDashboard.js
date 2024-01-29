import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  createStyles,
  Loader,
  TabPanel,
  Tabs,
  TotalLayoutContainer,
  ContextContainer,
  Paper,
} from '@bubbles-ui/components';
import { get, head, map, sortBy, tail } from 'lodash';

import { useIsStudent } from '@academic-portfolio/hooks';
import useAssignationsByProfile from '@assignables/hooks/assignations/useAssignationsByProfile';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import { unflatten } from '@common';
import { addErrorAlert } from '@layout/alert';
import { prefixPN } from '@learning-paths/helpers';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useUpdateTimestamps } from '@tasks/components/Student/TaskDetail/__DEPRECATED__components/Steps/Steps';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import ActivityHeader from '@assignables/components/ActivityHeader';
import { AssetEmbedList } from '@leebrary/components/AssetEmbedList';
import { DashboardCard } from './components/DashboardCard';
import { useModuleDataForPreview } from './helpers/previewHooks';

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
  const isStudent = useIsStudent();
  const {
    data: module,
    isLoading: isLoadingModule,
    error: moduleError,
    isError: isModuleError,
  } = useInstances({ id });

  const activitiesIds = useMemo(() => {
    const ids = map(module?.metadata?.module?.activities, 'id');
    if (isStudent && module?.id) {
      ids.unshift(module.id);
    }

    return ids;
  }, [module?.id, module?.metadata?.module?.activities, isStudent]);

  const {
    data: activitiesByProfile,
    isLoading: isLoadingActivities,
    error: activitiesError,
    isError: isActivitiesError,
  } = useAssignationsByProfile(activitiesIds, { enabled: !!activitiesIds?.length });

  const {
    module: moduleAssignation,
    assignations,
    activities,
  } = useMemo(() => {
    if (isStudent) {
      return {
        module: head(activitiesByProfile),
        assignations: tail(activitiesByProfile),
        activities: map(tail(activitiesByProfile), 'instance'),
      };
    }

    return { module: null, assignations: [], activities: activitiesByProfile };
  }, [module?.id, activitiesByProfile, isStudent]);

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
    moduleAssignation,
    activitiesById,
    assignationsById,
    activities: module?.metadata?.module?.activities ?? [],

    isLoading: isLoadingActivities || isLoadingModule,
    isError: isModuleError || isActivitiesError,
    errors,
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

export function ModuleDashboardBody({
  classes,
  localizations,
  activities,
  activitiesById,
  assignationsById,
  module,
  preview,
  subjectsData,
}) {
  const [t] = useTranslateLoader(prefixPN('moduleJourney'));
  const moduleColor =
    Array.isArray(subjectsData) && subjectsData.length === 1
      ? subjectsData[0].color
      : 'rgb(135, 141, 150)';
  const blockedActivities = useBlockedActivities({ activities, activitiesById, assignationsById });
  const introductionLink = preview
    ? `/private/learning-paths/modules/journey/${module?.assignable?.id}/preview`
    : `/private/learning-paths/modules/journey/${module?.id}`;
  return (
    <Box className={classes.activitiesList}>
      {!!(module?.metadata?.statement || module?.assignable?.resources?.length) && (
        <DashboardCard
          introductionCard
          assetNumber={t('introduction')}
          statement={module?.metadata?.statement}
          cover={module?.assignable?.asset?.cover}
          localizations={localizations}
          emptyIcon={module?.assignable?.roleDetails?.icon}
          fileType={module?.assignable?.roleDetails?.name}
          introductionLink={introductionLink}
          preview={preview}
        />
      )}
      {sortBy(
        activities?.map((activity, index) => ({
          comp: (
            <DashboardCard
              isBlocked={!!blockedActivities[activity?.id]}
              localizations={localizations}
              activity={activitiesById[activity?.id]}
              assignation={assignationsById[activity?.id]}
              key={activity?.id}
              preview={preview}
              assetNumber={index + 1}
              moduleColor={moduleColor}
            />
          ),
          createdAt: activitiesById[activity?.id].createdAt,
        })),
        'createdAt'
      ).map((a) => a.comp)}
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
  subjectsData: PropTypes.arrayOf(PropTypes.object),
};

export function ModuleDashboard({ id, preview }) {
  const {
    module,
    moduleAssignation,
    activities,
    activitiesById,
    assignationsById,
    isLoading,
    subjectsData,
  } = preview ? useModuleDataForPreview(id) : useModuleData(id);

  const isStudent = useIsStudent();
  const { mutateAsync } = useStudentAssignationMutation();
  const updateTimestamps = useUpdateTimestamps(mutateAsync, moduleAssignation);
  useEffect(() => {
    if (isStudent && moduleAssignation?.id) {
      updateTimestamps('open');
    }
  }, [moduleAssignation?.id]);

  const localizations = useModuleDashboardLocalizations();
  const { classes } = useModuleDashboardStyles();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <TotalLayoutContainer
      Header={<ActivityHeader instance={module} showStartDate showDeadline showDateTime />}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Tabs fullHeight fullWidth usePaddedLayout>
          <TabPanel label={localizations?.activities}>
            <Box sx={{ padding: '30px 0 30px 0' }}>
              <ModuleDashboardBody
                activities={activities}
                activitiesById={activitiesById}
                assignationsById={assignationsById}
                classes={classes}
                localizations={localizations}
                module={module}
                subjectsData={subjectsData}
                preview={preview}
              />
            </Box>
          </TabPanel>
          {!!module?.assignable?.resources?.length && (
            <TabPanel label={localizations?.resources}>
              <ContextContainer sx={{ padding: '30px 0 30px 0' }}>
                <Box>
                  <Paper sx={{ padding: '36px', width: '100%' }}>
                    <AssetEmbedList assets={module?.assignable?.resources} width={720} />
                  </Paper>
                </Box>
              </ContextContainer>
            </TabPanel>
          )}
        </Tabs>
      </Box>
    </TotalLayoutContainer>
  );
}

ModuleDashboard.propTypes = {
  id: PropTypes.string,
  preview: PropTypes.bool,
};
