import React, { useMemo } from 'react';
import {
  Box,
  createStyles,
  ImageLoader,
  Text,
  Title,
  useResizeObserver,
} from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import noResults from '../../assets/noResults.png';

const useEmptyStateStyles = createStyles((theme, { top }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: `calc(100vh - ${top}px)`,
    width: '100%',
    backgroundColor: theme.white,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
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
  const top = React.useMemo(() => ref.current?.getBoundingClientRect()?.top, [ref, rect]);

  const { classes } = useEmptyStateStyles({ top });

  const labels = useEmptyStateLocalizations();

  return (
    <Box className={classes.root} ref={ref}>
      {ref.current && (
        <Box className={classes.container}>
          <ImageLoader
            src={noResults}
            imageStyles={{
              width: 573,
            }}
            height="100%"
          />
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
