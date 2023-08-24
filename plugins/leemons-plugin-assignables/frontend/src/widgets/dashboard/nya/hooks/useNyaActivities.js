import useSearchNyaActivities from '@assignables/requests/hooks/queries/useSearchNyaActivities';
import useActivitiesByProfile from './useActivitiesByProfile';

export default function useNyaActivities({ program, class: klass }) {
  const { data: nyaActivities, isLoading: nyaActivitiesAreLoading } = useSearchNyaActivities(
    {
      programs: program && JSON.stringify([program]),
      classes: klass && JSON.stringify([klass]),
      limit: 9,
    },
    {
      select: (results) => results.items,
    }
  );

  const { data: activities, isLoading: activitiesAreLoading } =
    useActivitiesByProfile(nyaActivities);

  return {
    count: nyaActivities?.length ?? null,
    isLoading: nyaActivitiesAreLoading || activitiesAreLoading,
    activities,
  };
}
