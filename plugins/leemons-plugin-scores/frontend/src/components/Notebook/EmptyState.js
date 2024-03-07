import React, { useMemo } from 'react';
import { Box, createStyles, Paragraph, Title } from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import propTypes from 'prop-types';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { useLayout } from '@layout/context';
import noFilters from './assets/noFilters.png';

const useEmptyStateStyles = createStyles((theme) => ({
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
function useEmptyStateLocalizations(isStudent) {
  const key = `notebook.${isStudent ? 'noCourseSelected' : 'noClassSelected'}`;
  const [, translations] = useTranslateLoader(prefixPN(key));

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return _.get(res, prefixPN(key));
    }

    return {};
  }, [translations]);
}
export function EmptyState({ isStudent }) {
  const { theme } = useLayout();
  const { classes } = useEmptyStateStyles({});
  const labels = useEmptyStateLocalizations(isStudent);

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

EmptyState.propTypes = {
  isStudent: propTypes.bool,
};

export default EmptyState;
