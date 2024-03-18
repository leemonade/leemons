import useSearchEvaluatedActivities from '@assignables/requests/hooks/queries/useSearchEvaluatedActivities';
import { useIsStudent } from '@academic-portfolio/hooks';
import useActivitiesByProfile from './useActivitiesByProfile';

// This hook only works for students, as the teachers doesn't have activities itself
export default function useEvaluatedActivities({ program, class: klass }) {
  const enabled = useIsStudent();

  const { data: evaluatedActivities, isLoading: evaluatedActivitiesAreLoading } =
    useSearchEvaluatedActivities(
      {
        limit: 9,
        programs: program && JSON.stringify([program]),
        classes: klass && JSON.stringify([klass]),
      },
      { enabled, select: (results) => results.items }
    );

  const { data: activities, isLoading: activitiesAreLoading } =
    useActivitiesByProfile(evaluatedActivities);

  const isLoading = evaluatedActivitiesAreLoading || activitiesAreLoading;

  return {
    activities,
    isLoading,
    count: evaluatedActivities?.length ?? null,
  };
}
