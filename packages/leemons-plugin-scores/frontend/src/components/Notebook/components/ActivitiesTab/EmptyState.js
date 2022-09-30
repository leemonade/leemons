import React, { useMemo } from 'react';
import { Box, createStyles, Text, Title, useResizeObserver } from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import noResults from '../../assets/noResults.png';

const useEmptyStateStyles = createStyles((theme, { top, bottom }) => ({
  root: {
    display: 'flex',
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'center',
    height: `calc(100vh - ${top}px)`,
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
    maxHeight: bottom - top,
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
  const [ref, rect] = useResizeObserver();
  const { top, bottom } = React.useMemo(() => {
    const boundingRect = ref.current?.getBoundingClientRect();

    return { top: boundingRect?.top, bottom: boundingRect?.bottom };
  }, [ref, rect]);

  const { classes } = useEmptyStateStyles({ top, bottom });

  const labels = useEmptyStateLocalizations();

  return (
    <Box className={classes.root} ref={ref}>
      {ref.current && (
        <Box className={classes.container}>
          <img src={noResults} className={classes.image} />
          <Box className={classes.test}>
            <Title>{labels?.title}</Title>
            <Text>{labels?.description}</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default EmptyState;
