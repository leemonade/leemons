import React, { useEffect } from 'react';

import { LoadingOverlay, Stack } from '@bubbles-ui/components';

import useMyScoresStore from '@scores/stores/myScoresStore';
import useClassesMatchingFilters from './hooks/useClassesMatchingFilters';
import SubjectScoreColumn from './components/SubjectScoreColumn/SubjectScoreColumn';
import EmptyState from './components/EmptyState';

export default function SubjectsScoreList(filters) {
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
        {classes.map((klass) => (
          <SubjectScoreColumn {...filters} key={klass.id} class={klass} />
        ))}
      </Stack>
    </>
  );
}
