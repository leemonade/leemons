import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { getClassImage } from '@academic-portfolio/helpers/getClassImage';
import { useUserAgents } from '@assignables/components/Assignment/AssignStudents/hooks';
import prefixPN from '@assignables/helpers/prefixPN';
import useSearchAssignableInstances from '@assignables/hooks/assignableInstance/useSearchAssignableInstancesQuery';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import useAssignations from '@assignables/requests/hooks/queries/useAssignations';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import {
  Box,
  ImageLoader,
  Loader,
  ScoreFronstage,
  Select,
  Switch,
  createStyles,
} from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useScores } from '@scores/requests/hooks/queries';
import _, { capitalize, map } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import EmptyState from '../Notebook/components/ActivitiesTab/EmptyState';

function ClassIcon({ class: klass, dropdown = false }) {
  return (
    <Box
      sx={() => ({
        position: dropdown ? 'static' : 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 26,
        minHeight: 26,
        maxWidth: 26,
        maxHeight: 26,
        borderRadius: '50%',
        backgroundColor: klass?.color,
      })}
    >
      <ImageLoader
        sx={() => ({
          borderRadius: 0,
          filter: 'brightness(0) invert(1)',
        })}
        forceImage
        width={16}
        height={16}
        src={getClassIcon(klass)}
      />
    </Box>
  );
}

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

function useActivities(activities) {
  const previousResult = React.useRef([]);

  const {
    data: assignableInstances,
    isLoading,
    isRefetching,
  } = useInstances({
    ids: activities || [],
    enabled: !!activities?.length,
  });

  if (isRefetching || isLoading) {
    return {
      assignableInstances: previousResult.current,
      isLoading: isRefetching || isLoading,
    };
  }

  previousResult.current = assignableInstances;
  return {
    assignableInstances,
    isLoading,
  };
}

function useRoles() {
  const [, translations] = useTranslateLoader(prefixPN('roles'));

  const roles = React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('roles'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return Object.entries(data).map(([key, value]) => ({
        label: capitalize(value.singular),
        plural: capitalize(value.plural),
        value: key,
      }));
    }

    return [];
  }, [translations]);

  return roles;
}

const StudentActivitiesStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  filters: {
    display: 'flex',
    alignItems: 'end',
    gap: 24,
    backgroundColor: theme.other.global.background.color.surface.subtle,
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
  });
  const { assignableInstances: activities, isLoading: activitiesIsLoading } = useActivities(data);
  const { isLoading: assignationsAreLoading, data: assignationsData } = useAssignations({
    queries: data ? data.map((instance) => ({ instance, user })) : [],
    details: true,
    fetchInstance: true,
    enabled: !!data?.length,
    placeholderData: [],
  });

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
    const letter = evaluationSystem.scales.find((scale) => scale.number === score)?.letter;
    return letter;
  };

  const getAverageScore = (klass, classActivities) => {
    const periodScore = scores.find((score) => score.class === klass.id)?.grade;
    if (periodScore) return { number: periodScore, letter: getLetterScore(periodScore) };
    const averageScore =
      classActivities.reduce((total, next) => total + next.score.number, 0) /
        classActivities.length || 0;
    return { number: averageScore, letter: getLetterScore(averageScore) };
  };

  const getActivityScoreAndDate = (activity, klassId) => {
    const activityAssignation = assignationsData.find(
      (assignation) => assignation.instance.id === activity.id
    );
    if (!activityAssignation) return {};
    const date = activityAssignation.timestamps.end
      ? new Date(activityAssignation.timestamps.end)
      : labels.notDelivered;
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
    activities.forEach((activity) => {
      if (!activity.requiresScoring) return;
      // Filters non-calificable activities except when the filter is set to TRUE
      if (!!activity.gradable || localFilters.seeNonCalificable) {
        // If type is selected, filters activities matching type
        if (
          !localFilters.type ||
          (localFilters.type && localFilters.type === activity.assignable.role)
        ) {
          classesIds.push(...activity.classes);
          filteredActivities.push(activity);
        }
      }
    });
    return { filteredActivities, classesIds };
  };

  const getClassActivities = (filteredActivities, klass) => {
    const classActivitiesRaw = filteredActivities.filter((activity) =>
      activity.classes.includes(klass.id)
    );
    const classActivities = classActivitiesRaw.map((activity) => {
      const percentage = (100 / classActivitiesRaw.length).toFixed(0);
      const { activityScore, activityDate } = getActivityScoreAndDate(activity, klass.subject.id);
      const activityURL = activity.assignable.roleDetails.evaluationDetailUrl
        .replace(':id', activity.id)
        .replace(':user', user);
      return {
        title: activity.assignable.asset.name,
        score: { number: activityScore, letter: getLetterScore(activityScore) },
        percentage,
        date: activityDate,
        nonCalificable: !activity.gradable,
        onClick: () => window.open(activityURL, '_blank', 'noopener'),
      };
    });
    return classActivities;
  };

  const renderScores = () => {
    if (
      searchAssignableLoading ||
      activitiesIsLoading ||
      assignationsAreLoading ||
      scoresIsLoading ||
      (assignationsData?.length > 0 && !evaluationSystem)
    ) {
      setRenderedScores(<LoadingState />);
      return;
    }

    const { filteredActivities, classesIds } = filterActivities();
    const uniqueClassesIds = [...new Set(classesIds)];
    const filteredClasses = klasses.filter((klass) =>
      localFilters.subject
        ? localFilters.subject === klass.id && uniqueClassesIds.includes(klass.id)
        : uniqueClassesIds.includes(klass.id)
    );

    setRenderedScores(
      filteredClasses && filteredClasses.length ? (
        filteredClasses.map((klass) => {
          const classActivities = getClassActivities(filteredActivities, klass);
          const averageScore = getAverageScore(klass, classActivities);
          return (
            <ScoreFronstage
              key={klass.id}
              title={klass.subject.name}
              subtitle={klass.groups.name}
              label={labels.averageScore}
              image={getClassImage(klass)}
              icon={getClassIcon(klass)}
              score={averageScore}
              values={classActivities}
              maxGrade={evaluationSystem?.maxScale.number}
              minGrade={evaluationSystem?.minScaleToPromote.number}
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
        <Select
          label={labels.subject.label}
          placeholder={labels.subject.placeholder}
          data={klasses.map((klass) => {
            const klassName =
              !klass.groups.isAlone && klass.groups?.name
                ? `${klass.subject.name} - ${klass.groups.name}`
                : klass.subject.name;
            return {
              value: klass.id,
              c: klass,
              label: klassName,
              icon: <ClassIcon class={klass} dropdown />,
            };
          })}
          value={localFilters.subject}
          onChange={(value) => handleFilterOnChange('subject', value)}
          clearable={labels.type.clear}
        />
        <Select
          label={labels.type.label}
          placeholder={labels.type.placeholder}
          data={roles}
          value={localFilters.type}
          onChange={(value) => handleFilterOnChange('type', value)}
          clearable={labels.type.clear}
        />
        <Box className={classes.switchContainer}>
          <Switch
            label={labels.seeNonCalificable}
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
