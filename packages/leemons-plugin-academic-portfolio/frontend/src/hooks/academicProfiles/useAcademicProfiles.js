import { useQuery } from '@tanstack/react-query';
import { getProfiles } from '@academic-portfolio/request/settings';

export default function useAcademicProfiles() {
  const { data, isLoading } = useQuery(['plugins.academic-portfolio.profiles'], getProfiles, {
    staleTime: 5 * 60 * 1000,
  });

  const profiles = isLoading ? null : data?.profiles;

  return {
    isLoading,
    student: profiles?.student,
    teacher: profiles?.teacher,
  };
}
