import React, { useMemo } from 'react';
import {
  Box,
  createStyles,
  ImageLoader,
  Paragraph,
  TabPanel,
  Tabs,
  Title,
} from '@bubbles-ui/components';
import _, { isEmpty } from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { Header } from './components/Header';
import ActivitiesTab from './components/ActivitiesTab';
import noFilters from './assets/noFilters.png';

const useStyles = createStyles((theme, { isOpened } = {}) => ({
  root: {
    width: isOpened ? 'calc(100% - 370px)' : '100%',
    boxSizing: 'border-box',
    transition: 'width 0.3s ease-in-out',
  },
  tabHeader: {
    backgroundColor: theme.colors.interactive03h,
  },
}));

function EmptyState() {
  const [, translations] = useTranslateLoader(prefixPN('notebook.noClassSelected'));

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('notebook.noClassSelected'));

      return data;
    }

    return {};
  }, [translations]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100%',
      }}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          width: '100%',
          bottom: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[4],
        })}
      >
        <ImageLoader
          src={noFilters}
          imageStyles={{
            maxWidth: 573,
            width: '50%',
          }}
          height="100%"
        />
        <Box sx={{ maxWidth: '25%' }}>
          <Title>{labels.title}</Title>
          <Paragraph>{labels.description}</Paragraph>
        </Box>
      </Box>
    </Box>
  );
}

export default function Notebook({ isOpened, onOpenChange, filters }) {
  const { classes } = useStyles({ isOpened });

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

  if (isEmpty(filters)) {
    return <EmptyState />;
  }

  return (
    <Box className={classes.root}>
      <Header isOpened={isOpened} onOpenChange={onOpenChange} filters={filters} />
      <Tabs className={classes.tabHeader}>
        <TabPanel label={labels.activities.title}>
          <ActivitiesTab filters={filters} labels={labels.activities} />
        </TabPanel>
      </Tabs>
    </Box>
  );
}
