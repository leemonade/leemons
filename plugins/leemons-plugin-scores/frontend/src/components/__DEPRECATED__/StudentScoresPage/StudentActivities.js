import React, { useMemo } from 'react';

import { SelectSubject } from '@academic-portfolio/components/SelectSubject';
import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { getClassImage } from '@academic-portfolio/helpers/getClassImage';
import { useRoles } from '@assignables/components/Ongoing/AssignmentList/components/Filters/components/Type/Type';
import useSearchAssignableInstances from '@assignables/hooks/assignableInstance/useSearchAssignableInstancesQuery';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import useAssignations from '@assignables/requests/hooks/queries/useAssignations';
import { Box, Loader, ScoreFronstage, Select, Switch, createStyles } from '@bubbles-ui/components';
import getNearestScale from '@scorm/helpers/getNearestScale';
import useUserAgents from '@users/hooks/useUserAgents';
import { map } from 'lodash';
import PropTypes from 'prop-types';

import { EmptyState } from '../Notebook/components/ActivitiesTab/EmptyState';

import { useScores } from '@scores/requests/hooks/queries';

function LoadingState() {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        backgroundColor: theme.white,
      })}
    >
      <Loader />
    </Box>
  );
}

const StudentActivitiesStyles = createStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  filters: {
    display: 'flex',
    alignItems: 'end',
    gap: 24,
    // backgroundColor: theme.other.global.background.color.surface.subtle,
    paddingInline: 48,
    paddingBlock: 16,
  },
  scoreContainer: {
    display: 'flex',
    paddingBlock: 24,
    paddingInline: 48,
    gap: 40,
    flex: 1,
    maxHeight: '100vh',
    overflowY: 'hidden',
    overflowX: 'auto',
  },
  switchContainer: {
    height: '40px',
  },
}));

export default function StudentActivities({ klasses, filters, labels }) {
  const [localFilters, setLocalFilters] = React.useState({
    subject: '',
    type: '',
    seeNonCalificable: false,
  });
  const [renderedScores, setRenderedScores] = React.useState([]);
  const { classes } = StudentActivitiesStyles({}, { name: 'StudentActivities' });
  const roles = useRoles().filter((role) => role.value !== 'feedback');
  const user = useUserAgents()[0];
  const { data, isLoading: searchAssignableLoading } = useSearchAssignableInstances({
    finished: true,
    finished_$gt: filters.startDate,
    finished_$lt: filters.endDate,
    visible: true,
  });
  const { isLoading: assignationsAreLoading, data: assignationsData } = useAssignations({
    queries: data ? data.map((instance) => ({ instance, user })) : [],
    details: true,
    fetchInstance: true,
    enabled: !!data?.length,
    placeholderData: [],
  });

  const activities = useMemo(
    () =>
      assignationsData
        .filter((assignation) => assignation.finished)
        .map((assignation) => assignation.instance),
    [assignationsData]
  );

  const evaluationSystem = useProgramEvaluationSystem(filters.program, {
    enabled: assignationsData?.length > 0,
  });
  const useLetterScore = useMemo(() => evaluationSystem?.type !== 'numeric', [evaluationSystem]);

  const { data: scores, isLoading: scoresIsLoading } = useScores({
    students: [user],
    classes: map(klasses, 'id'),
    periods: filters.period.isCustom ? [] : [filters.period.period.id],
    published: true,
  });

  const getLetterScore = (score) => {
    if (!evaluationSystem) return null;
    if (!useLetterScore) return null;

    return getNearestScale({ grade: score, evaluationSystem }).letter;
  };

  const getAverageScore = (klass, classActivities) => {
    const periodScore = scores.find((score) => score.class === klass.id)?.grade;
    if (periodScore) return { number: periodScore, letter: getLetterScore(periodScore) };
    const averageScore =
      classActivities.reduce(
        (total, next) => total + (next?.score?.number ?? evaluationSystem.minScale.number),
        0
      ) / classActivities.length || 0;
    return { number: averageScore, letter: getLetterScore(averageScore) };
  };

  const getActivityScoreAndDate = (activity, klassId) => {
    const activityAssignation = assignationsData.find(
      (assignation) => assignation.instance.id === activity.id
    );
    if (!activityAssignation) return {};
    const date = activityAssignation.timestamps.end
      ? new Date(activityAssignation.timestamps.end)
      : labels?.notDelivered;
    const grade =
      activityAssignation.grades.find((assignationGrade) => assignationGrade.subject === klassId)
        ?.grade || 0;
    return { activityScore: grade, activityDate: date };
  };

  const handleFilterOnChange = (type, value) => {
    const newFilters = { ...localFilters };
    newFilters[type] = value;
    setLocalFilters(newFilters);
  };

  const filterActivities = () => {
    const classesIds = [];
    const filteredActivities = [];
    activities?.forEach((activity) => {
      if (!activity.gradable || activity?.metadata?.module?.type === 'module') return;

      // Filters non-calificable activities except when the filter is set to TRUE
      // If type is selected, filters activities matching type
      if (
        (activity.gradable || localFilters.seeNonCalificable) &&
        (!localFilters.type ||
          (localFilters.type && localFilters.type === activity.assignable.role))
      ) {
        classesIds.push(...activity.classes);
        filteredActivities.push(activity);
      }
    });
    return { filteredActivities, classesIds };
  };

  const getClassActivities = (filteredActivities, klass, evaluationSystem) => {
    const classActivitiesRaw = filteredActivities.filter((activity) =>
      activity.classes.includes(klass.id)
    );
    return classActivitiesRaw
      .map((activity) => {
        const percentage = (100 / classActivitiesRaw.length)?.toFixed(0);
        const { activityScore, activityDate } = getActivityScoreAndDate(activity, klass.subject.id);

        const gotDeadline =
          activityDate instanceof Date
            ? activityDate
            : activity?.dates?.closed ?? activity?.dates?.deadline;
        if (!!gotDeadline && new Date(gotDeadline) > new Date()) return null;

        let score = activityScore;

        if (score < evaluationSystem.minScale.number) {
          score = evaluationSystem.minScale.number;
        } else if (score > evaluationSystem.maxScale.number) {
          score = evaluationSystem.maxScale.number;
        }

        const activityURL = activity.assignable.roleDetails.evaluationDetailUrl
          .replace(':id', activity.id)
          .replace(':user', user);
        return {
          id: activity.id,
          title: activity.assignable.asset.name,
          score: { number: score, letter: getLetterScore(activityScore) },
          percentage,
          date: activityDate,
          nonCalificable: !activity.gradable,
          onClick: () => window.open(activityURL, '_blank', 'noopener'),
        };
      })
      .filter(Boolean);
  };

  const renderScores = () => {
    if (
      searchAssignableLoading ||
      assignationsAreLoading ||
      scoresIsLoading ||
      (assignationsData?.length > 0 && !evaluationSystem)
    ) {
      setRenderedScores(<LoadingState />);
      return;
    }

    const { filteredActivities, classesIds } = filterActivities();
    const uniqueClassesIds = [...new Set(classesIds)];
    const filteredClasses = klasses?.filter((klass) =>
      localFilters.subject
        ? localFilters.subject === klass.id && uniqueClassesIds.includes(klass.id)
        : uniqueClassesIds.includes(klass.id)
    );

    setRenderedScores(
      filteredClasses && filteredClasses.length ? (
        filteredClasses.map((klass) => {
          const classActivities = getClassActivities(filteredActivities, klass, evaluationSystem);
          const averageScore = getAverageScore(klass, classActivities);

          return (
            <ScoreFronstage
              key={klass.id}
              title={klass.subject.name}
              subtitle={klass.groups.name}
              label={labels?.averageScore}
              image={getClassImage(klass)}
              icon={getClassIcon(klass)}
              color={klass.color}
              score={averageScore}
              values={classActivities}
              maxGrade={evaluationSystem?.maxScale.number}
              minGrade={evaluationSystem?.minScaleToPromote.number}
              subjectColor={klass.color}
            />
          );
        })
      ) : (
        <EmptyState />
      )
    );
  };

  React.useEffect(() => {
    renderScores();
  }, [
    JSON.stringify(filters),
    JSON.stringify(data),
    JSON.stringify(activities),
    JSON.stringify(assignationsData),
    JSON.stringify(scores),
    evaluationSystem,
    localFilters,
  ]);

  return (
    <Box className={classes.root}>
      <Box className={classes.filters}>
        <SelectSubject
          placeholder={labels?.subject?.placeholder}
          data={
            klasses?.map((klass) => {
              const isGroupAlone = !klass.groups || klass.groups.isAlone;
              const klassName =
                !isGroupAlone && klass.groups?.name
                  ? `${klass.subject.name} - ${klass.groups.name}`
                  : klass.subject.name;
              return {
                ...klass.subject,
                value: klass.id,
                label: klassName,
              };
            }) ?? []
          }
          value={localFilters.subject}
          onChange={(value) => handleFilterOnChange('subject', value)}
          clearable={labels?.type?.clear}
        />
        <Select
          placeholder={labels?.type?.placeholder}
          data={roles}
          value={localFilters.type}
          onChange={(value) => handleFilterOnChange('type', value)}
          clearable={labels?.type?.clear}
        />
        <Box className={classes.switchContainer}>
          <Switch
            label={labels?.seeNonCalificable}
            value={localFilters.seeNonCalificable}
            onChange={(value) => handleFilterOnChange('seeNonCalificable', value)}
          />
        </Box>
      </Box>
      <Box className={classes.scoreContainer}>{renderedScores}</Box>
    </Box>
  );
}

StudentActivities.propTypes = {
  activities: PropTypes.array,
  filters: PropTypes.object,
  klasses: PropTypes.array,
  labels: PropTypes.object,
};
