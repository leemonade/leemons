import React, { useMemo } from 'react';
import {
  Box,
  createStyles,
  Paragraph,
  TabPanel,
  Tabs,
  Title,
  useResizeObserver,
} from '@bubbles-ui/components';
import _, { isEmpty } from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { Header } from './components/Header';
import ActivitiesTab from './components/ActivitiesTab';
import noFilters from './assets/noFilters.png';

const useEmptyStateStyles = createStyles((theme, { top }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing[7],
    width: '100%',
    height: `calc(100vh - ${top}px)`,
    padding: theme.spacing[8],
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[5],
    maxWidth: 370,
  },
  textMargin: {
    margin: 0,
  },
  image: {
    maxHeight: 500,
    maxWidth: '50%',
  },
}));

function useEmptyStateLocalizations() {
  const [, translations] = useTranslateLoader(prefixPN('notebook.noClassSelected'));

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('notebook.noClassSelected'));

      return data;
    }

    return {};
  }, [translations]);

  return labels;
}

function EmptyState() {
  const [ref, rect] = useResizeObserver();
  const top = React.useMemo(() => ref?.current?.getBoundingClientRect()?.top, [rect]);
  const { classes } = useEmptyStateStyles({ top });
  const labels = useEmptyStateLocalizations();

  return (
    <Box className={classes.root} ref={ref}>
      <img src={noFilters} className={classes.image} />
      <Box className={classes.text}>
        <Title>{labels.title}</Title>
        <Paragraph className={classes.textMargin}>{labels.description}</Paragraph>
      </Box>
    </Box>
  );
}

const useNotebookStyles = createStyles((theme, { top } = {}) => ({
  root: {
    width: '100%',
    position: 'sticky',
    top,
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
  const labels = useNotebookLocalizations();
  const top = 0;
  const { classes } = useNotebookStyles({ top });

  if (isEmpty(filters)) {
    return <EmptyState />;
  }

  return (
    <Box className={classes.root}>
      <Header filters={filters} />
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
