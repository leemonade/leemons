import useAssignationsByProfile from '@assignables/hooks/assignations/useAssignationsByProfile';

export default function useActivitiesByProfile(instances) {
  return useAssignationsByProfile(instances, { placeholderData: [] });
}
