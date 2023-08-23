import React, { useMemo } from 'react';
import { Box, createStyles, Text, Title } from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { useLayout } from '@layout/context';
import noResults from '../../assets/noResults.png';

const useEmptyStateStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'center',
    // height: `calc(100vh - ${top}px)`,
    flex: 1,
    width: '100%',
    backgroundColor: theme.white,
    padding: theme.spacing[2],
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  image: {
    // maxHeight: bottom - top,
    maxWidth: 573,
  },
  text: { maxWidth: 250 },
}));

function useEmptyStateLocalizations() {
  const [, translations] = useTranslateLoader(prefixPN('notebook.noResults'));

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return _.get(res, prefixPN('notebook.noResults'));
    }

    return {};
  }, [translations]);
}

export function EmptyState() {
  const { theme } = useLayout();
  const { classes } = useEmptyStateStyles({});

  const labels = useEmptyStateLocalizations();

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        {theme.usePicturesEmptyStates && <img src={noResults} className={classes.image} />}
        <Box className={classes.test}>
          <Title>{labels?.title}</Title>
          <Text>{labels?.description}</Text>
        </Box>
      </Box>
    </Box>
  );
}

export default EmptyState;
