import { useIsStudent } from '@academic-portfolio/hooks';
import useSearchOngoingActivities from '@assignables/requests/hooks/queries/useSearchOngoingActivities';
import useActivitiesByProfile from './useActivitiesByProfile';

// EN: This hook only works for students, as the teachers doesn't have a progreso.
// ES: Este hook solo funciona para estudiantes, porque los profes no tienen progreso.
export default function useEvaluatedActivities({ program, class: klass }) {
  const enabled = useIsStudent();

  const { data: evaluatedActivities, isLoading: evaluatedActivitiesAreLoading } =
    useSearchOngoingActivities(
      {
        limit: 9,
        progress: 'evaluated',
        // TODO: Sort by evaluation date
        sort: 'assignation',
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
    count: activities?.length ?? null,
  };
}
