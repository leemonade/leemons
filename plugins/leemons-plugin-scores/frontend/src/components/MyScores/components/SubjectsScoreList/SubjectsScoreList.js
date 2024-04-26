import React from 'react';

import { LoadingOverlay, Stack } from '@bubbles-ui/components';
import { useStore } from '@common';

import useClassesMatchingFilters from './hooks/useClassesMatchingFilters';
import SubjectScoreColumn from './components/SubjectScoreColumn/SubjectScoreColumn';
import EmptyState from './components/EmptyState';

export default function SubjectsScoreList(filters) {
  const { classes, isLoading } = useClassesMatchingFilters(filters);
  const [classesWithResultsStore, render] = useStore({});

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (!classes.length) {
    return <EmptyState />;
  }

  const noResultsInChildren = classes.every((klass) => !classesWithResultsStore[klass.id]);

  return (
    <>
      {noResultsInChildren && <EmptyState />}

      <Stack spacing={3} sx={{ overflowX: 'auto' }}>
        {classes.map((klass) => (
          <SubjectScoreColumn
            {...filters}
            key={klass.id}
            class={klass}
            onNoResults={() => {
              if (classesWithResultsStore[klass.id]) {
                classesWithResultsStore[klass.id] = false;
                render();
              }
            }}
            onResults={() => {
              if (!classesWithResultsStore[klass.id]) {
                classesWithResultsStore[klass.id] = true;
                render();
              }
            }}
          />
        ))}
      </Stack>
    </>
  );
}
