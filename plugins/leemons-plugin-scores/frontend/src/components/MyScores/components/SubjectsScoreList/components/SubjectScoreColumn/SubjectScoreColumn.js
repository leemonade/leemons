import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Box, LoadingOverlay, Stack } from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { Link } from 'react-router-dom';

import useWeights from '@scores/requests/hooks/queries/useWeights';
import useProgramEvaluationSystems from '@grades/hooks/queries/useProgramEvaluationSystem';
import useMyScoresStore from '@scores/stores/myScoresStore';
import Header from './components/Header';
import ActivityScoreDisplay from './components/ActivityScoreDisplay';
import useSubjectScoreColumnStyles from './SubjectsScoreColumn.styles';
import useActivitiesWithWeights from './hooks/useActivitiesWithWeights';
import ActivityScoreTotal from './components/ActivityScoreTotal/ActivityScoreTotal';

export default function SubjectScoreColumn({ class: klass, ...filters }) {
  const addColumn = useMyScoresStore((store) => store.addColumn);
  const removeColumn = useMyScoresStore((store) => store.removeColumn);

  const { data: evaluationSystem, isLoading: evaluationSystemLoading } =
    useProgramEvaluationSystems({ program: klass.program });
  const { data: weights, isLoading: weightsLoading } = useWeights({ classId: klass.id });
  const { activities, isLoading: activitiesLoading } = useActivitiesWithWeights({
    ...filters,
    class: klass,
    weights,
  });

  const { classes } = useSubjectScoreColumnStyles({ color: klass.color });

  useEffect(() => {
    if (activities?.length) {
      addColumn(klass.id, activities);
    } else {
      removeColumn(klass.id);
    }
  }, [activities, addColumn, removeColumn, klass?.id]);

  useEffect(() => () => removeColumn(klass.id), [removeColumn, klass.id]);

  if (weightsLoading || activitiesLoading || evaluationSystemLoading) {
    return <LoadingOverlay visible />;
  }

  if (!activities.length) {
    return null;
  }

  return (
    <Stack className={classes.root} direction="column" spacing={4}>
      <Link className={classes.opener} to={`/private/dashboard/class/${klass.id}`}>
        <ExpandDiagonalIcon width={18} height={18} color="#2F463F" />
      </Link>
      <Box>
        <Header class={klass} weights={weights} />
      </Box>
      <Box>
        <Stack direction="column" fullWidth>
          <ActivityScoreTotal
            activities={activities}
            evaluationSystem={evaluationSystem}
            class={klass}
            period={filters.period}
          />
          {activities.map((activity) => (
            <ActivityScoreDisplay
              activity={activity}
              key={activity.id}
              class={klass}
              evaluationSystem={evaluationSystem}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

SubjectScoreColumn.propTypes = {
  class: PropTypes.shape({
    subject: PropTypes.shape({
      image: PropTypes.object.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    groups: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    program: PropTypes.string.isRequired,
  }).isRequired,
  period: PropTypes.object.isRequired,
  showNonEvaluable: PropTypes.bool,
};
