import React, { useMemo } from 'react';
import { Box, createStyles } from '@bubbles-ui/components';
import propTypes from 'prop-types';
import _, { isEmpty } from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { Header } from './components/Header';
import ActivitiesTab from './components/ActivitiesTab';
import { EmptyState } from './EmptyState';
import StudentActivities from '../StudentScoresPage/StudentActivities';

const useNotebookStyles = createStyles(() => ({
  root: {
    width: '100%',
    boxSizing: 'border-box',
    transition: 'width 0.3s ease-in-out',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tabHeader: {
    flex: 1,
  },
}));

function useNotebookLocalizations(key) {
  const [, translations] = useTranslateLoader(prefixPN(key));
  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return _.get(res, prefixPN(key));
    }

    return {};
  }, [translations]);
}

export default function Notebook({
  filters,
  localFilters,
  setLocalFilters,
  isStudent,
  klasses,
  scrollRef,
}) {
  const { classes } = useNotebookStyles();

  const key = isStudent ? 'notebook.students' : 'notebook.tabs';
  const labels = useNotebookLocalizations(key);

  if (isEmpty(filters)) {
    return <EmptyState isStudent={isStudent} />;
  }

  return (
    <Box className={classes.root}>
      <Header filters={filters} variant="notebook" allowDownload isStudent={isStudent} />
      {isStudent ? (
        <StudentActivities klasses={klasses} filters={filters} labels={labels} />
      ) : (
        <ActivitiesTab
          key={filters?.period?.period?.id === 'final' ? 'final' : 'evaluation'}
          filters={filters}
          labels={labels.activities}
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
          scrollRef={scrollRef}
        />
      )}
    </Box>
  );
}

Notebook.propTypes = {
  filters: propTypes.object,
  localFilters: propTypes.object,
  setLocalFilters: propTypes.func,
  isStudent: propTypes.bool,
  klasses: propTypes.array,
  scrollRef: propTypes.any,
};
