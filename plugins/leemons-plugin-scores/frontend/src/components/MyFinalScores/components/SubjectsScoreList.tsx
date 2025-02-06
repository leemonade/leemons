import { useEffect } from 'react';

import { LoadingOverlay, Stack } from '@bubbles-ui/components';

import { Class } from '../types/class';

import { SubjectFinalScoreColumn } from './SubjectFinalScoreColumn';

import EmptyState from '@scores/components/MyScores/components/SubjectsScoreList/components/EmptyState';
import useClassesMatchingFilters from '@scores/components/MyScores/components/SubjectsScoreList/hooks/useClassesMatchingFilters';
import useMyScoresStore from '@scores/stores/myScoresStore';

export function SubjectsScoreList({ filters }: { filters: any }) {
  const { classes, isLoading } = useClassesMatchingFilters(filters);
  const noResultsInChildren = !useMyScoresStore((store) => store.columns.size);
  const setClasses = useMyScoresStore((store) => store.setClasses);

  useEffect(() => {
    setClasses(classes);
  }, [classes, setClasses]);

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (!classes.length) {
    return <EmptyState />;
  }

  return (
    <>
      {noResultsInChildren && <EmptyState />}

      <Stack spacing={3} sx={{ overflowX: 'auto' }}>
        {classes?.map((classData: Class) => (
          <SubjectFinalScoreColumn {...filters} key={classData.id} classData={classData} />
        ))}
      </Stack>
    </>
  );
}
