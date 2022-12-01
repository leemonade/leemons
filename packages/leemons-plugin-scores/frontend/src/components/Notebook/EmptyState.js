import React, { useMemo } from 'react';
import { Box, createStyles, Paragraph, Title } from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { useLayout } from '@layout/context';
import noFilters from './assets/noFilters.png';

const useEmptyStateStyles = createStyles((theme, {}) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing[7],
    width: '100%',
    padding: theme.spacing[8],
    flex: 1,
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
export function EmptyState() {
  const { theme } = useLayout();
  const { classes } = useEmptyStateStyles({});
  const labels = useEmptyStateLocalizations();

  return (
    <Box className={classes.root}>
      {theme.usePicturesEmptyStates && <img src={noFilters} className={classes.image} />}
      <Box className={classes.text}>
        <Title>{labels.title}</Title>
        <Paragraph className={classes.textMargin}>{labels.description}</Paragraph>
      </Box>
    </Box>
  );
}

export default EmptyState;
