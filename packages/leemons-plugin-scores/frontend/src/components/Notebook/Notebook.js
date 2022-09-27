import React, { useMemo } from 'react';
import { Box, createStyles, TabPanel, Tabs } from '@bubbles-ui/components';
import _, { isEmpty } from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { Header } from './components/Header';
import ActivitiesTab from './components/ActivitiesTab';
import { EmptyState } from './EmptyState';

const useNotebookStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    boxSizing: 'border-box',
    transition: 'width 0.3s ease-in-out',
  },
  tabHeader: {
    backgroundColor: theme.colors.interactive03h,
  },
}));

function useNotebookLocalizations() {
  const [, translations] = useTranslateLoader(prefixPN('notebook.tabs'));

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('notebook.tabs'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  return labels;
}

export default function Notebook({ filters }) {
  const { classes } = useNotebookStyles();

  const labels = useNotebookLocalizations();

  if (isEmpty(filters)) {
    return <EmptyState />;
  }

  return (
    <Box className={classes.root}>
      <Header filters={filters} variant="notebook" allowDownload />
      <Tabs className={classes.tabHeader}>
        <TabPanel label={labels.activities.title}>
          <ActivitiesTab
            key={filters?.period?.period?.id === 'final' ? 'final' : 'evaluation'}
            filters={filters}
            labels={labels.activities}
          />
        </TabPanel>
      </Tabs>
    </Box>
  );
}
