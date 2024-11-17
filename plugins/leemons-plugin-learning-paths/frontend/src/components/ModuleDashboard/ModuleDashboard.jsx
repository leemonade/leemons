import React, { useEffect, useMemo } from 'react';

import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import ActivityHeader from '@assignables/components/ActivityHeader';
import { ProgressChart } from '@assignables/components/ProgressChart';
import useAssignationsByProfile from '@assignables/hooks/assignations/useAssignationsByProfile';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
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
import { unflatten } from '@common';
import { addErrorAlert } from '@layout/alert';
import { AssetEmbedList } from '@leebrary/components/AssetEmbedList';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useUpdateTimestamps } from '@tasks/components/Student/TaskDetail/__DEPRECATED__components/Steps/Steps';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { get, head, map, sortBy, tail } from 'lodash';
import PropTypes from 'prop-types';

import { DashboardCard } from './components/DashboardCard';
import { useModuleDataForPreview } from './helpers/previewHooks';

import { prefixPN } from '@learning-paths/helpers';

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
  }, [translations, key]);
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
}) {
  const [t] = useTranslateLoader(prefixPN('moduleJourney'));
  const blockedActivities = useBlockedActivities({ activities, activitiesById, assignationsById });
  const introductionLink = `/private/learning-paths/modules/journey/${module?.id}`;
  const preparedAsset = prepareAsset(module?.assignable?.asset);
  return (
    <Box className={classes.activitiesList}>
      {!!(module?.metadata?.statement || module?.assignable?.resources?.length) && (
        <DashboardCard
          introductionCard
          asset={preparedAsset}
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
            />
          ),
          createdAt: activitiesById[activity?.id]?.createdAt,
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

function useStudentsGradesGraphData({ moduleAssignation, activitiesById }) {
  const isStudent = useIsStudent();

  return useMemo(() => {
    if (!isStudent || !moduleAssignation?.metadata?.moduleStatus) {
      return [];
    }

    return moduleAssignation.metadata.moduleStatus
      .map((status) => ({
        label: activitiesById?.[status.instance]?.assignable?.asset?.name,
        value: status.gradeAvg,
        gradable: activitiesById?.[status.instance]?.gradable,
      }))
      .filter((status) => status.gradable);
  }, [moduleAssignation, activitiesById, isStudent]);
}

function useTeachersGradesGraphData({ module, activitiesById, programEvaluationSystem }) {
  const isTeacher = useIsTeacher();
  const minScale = programEvaluationSystem?.minScale?.number ?? 0;

  return useMemo(() => {
    if (!isTeacher || !module?.metadata?.module?.activities) {
      return [];
    }

    return module?.metadata?.module?.activities
      .map((activity) => {
        const instance = activitiesById?.[activity.id];
        const { students = [] } = instance ?? {};

        const averageGrade =
          students.reduce((acc, student) => {
            const mainGrade = student.grades.find((grade) => grade.type === 'main');

            return acc + (mainGrade?.grade ?? minScale);
          }, 0) / students.length;

        return {
          label: instance?.assignable?.asset?.name,
          value: averageGrade,
          gradable: instance?.gradable,
        };
      })
      .filter((activity) => activity.gradable);
  }, [module, activitiesById, minScale, isTeacher]);
}

export function ModuleDashboard({ id, preview }) {
  const { module, moduleAssignation, activities, activitiesById, assignationsById, isLoading } =
    preview ? useModuleDataForPreview(id) : useModuleData(id);

  const programEvaluationSystem = useProgramEvaluationSystem(module);
  const studentsGradesGraphData = useStudentsGradesGraphData({ moduleAssignation, activitiesById });
  const teachersGradesGraphData = useTeachersGradesGraphData({
    module,
    activitiesById,
    programEvaluationSystem,
  });

  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();

  const { mutateAsync } = useStudentAssignationMutation();
  const updateTimestamps = useUpdateTimestamps(mutateAsync, moduleAssignation);

  useEffect(() => {
    if (isStudent) {
      const assignations = Object.values(assignationsById);

      if (!assignations?.length) {
        return;
      }

      const hasAllGrades = assignations
        .filter((assignation) => assignation?.instance?.requiresScoring)
        .every((assignation) => assignation.grades.length >= assignation.instance.subjects.length);

      if (hasAllGrades) {
        updateTimestamps('gradesViewed');
      }
    }
  }, [assignationsById, isStudent, updateTimestamps]);

  useEffect(() => {
    if (isStudent && moduleAssignation?.id) {
      updateTimestamps('open');
    }
  }, [moduleAssignation?.id, updateTimestamps, isStudent]);

  const localizations = useModuleDashboardLocalizations();
  const { classes } = useModuleDashboardStyles();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <TotalLayoutContainer
      Header={
        <ActivityHeader
          instance={module}
          showStartDate
          showDeadline
          showDateTime
          showDeleteButton={isTeacher}
        />
      }
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
                preview={preview}
              />
            </Box>
          </TabPanel>
          {!!module?.assignable?.resources?.length && (
            <TabPanel label={localizations?.resources}>
              <ContextContainer sx={{ padding: '30px 0 30px 0' }}>
                <Box>
                  <Paper sx={{ padding: '36px', width: '100%' }} shadow="none">
                    <AssetEmbedList assets={module?.assignable?.resources} width={720} />
                  </Paper>
                </Box>
              </ContextContainer>
            </TabPanel>
          )}
          <TabPanel label={localizations?.progress ?? 'Progreso'}>
            <ContextContainer sx={{ padding: '30px 0 30px 0' }}>
              <Paper sx={{ width: '100%' }} shadow="none">
                <ContextContainer
                  title={
                    isStudent
                      ? localizations?.studentProgressTitle ?? 'Notas del módulo'
                      : localizations?.teacherProgressTitle ?? 'Notas medias del módulo'
                  }
                >
                  <Box pt={10}>
                    <ProgressChart
                      data={isStudent ? studentsGradesGraphData : teachersGradesGraphData}
                      maxValue={programEvaluationSystem?.maxScale?.number}
                      passValue={programEvaluationSystem?.minScaleToPromote?.number}
                      height={390}
                    />
                  </Box>
                </ContextContainer>
              </Paper>
            </ContextContainer>
          </TabPanel>
        </Tabs>
      </Box>
    </TotalLayoutContainer>
  );
}

ModuleDashboard.propTypes = {
  id: PropTypes.string,
  preview: PropTypes.bool,
};
