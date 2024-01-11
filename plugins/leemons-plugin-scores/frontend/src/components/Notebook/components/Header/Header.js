import React, { useMemo } from 'react';
import { Box, createStyles } from '@bubbles-ui/components';
import propTypes from 'prop-types';
import { addAction, fireEvent, removeAction } from 'leemons-hooks';

import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useSubjectClasses from '@academic-portfolio/hooks/useSubjectClasses';
import { addErrorAlert } from '@layout/alert';
import { useTitle } from './useTitle';

const useStyles = createStyles((theme, { isStudent }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: isStudent ? '16px 48px' : `${theme.spacing[3]}px 0px`,
  },
  title: {
    span: isStudent
      ? {
        color: theme.other.global.content.color.text.default,
        ...theme.other.global.content.typo.heading.lg,
      }
      : {},
    flex: 1,
  },
}));

export function onScoresDownload(extension) {
  let timer;
  const downloadScoresError = 'scores::download-scores-error';
  const onClearTimer = () => {
    clearTimeout(timer);

    removeAction('scores::downloaded-intercepted', onClearTimer);
  };

  const onError = ({ args: [e] }) => {
    addErrorAlert(`Error downloading scores report ${e.message}`);

    removeAction(downloadScoresError, onError);
  };

  addAction('scores::downloaded-intercepted', onClearTimer);
  addAction(downloadScoresError, onError);

  fireEvent('scores::download-scores', extension);
  timer = setTimeout(() => {
    fireEvent(downloadScoresError, new Error('timeout'));
  }, 1000);
}

export default function Header({ filters = {}, variant, isStudent }) {
  /*
    --- Styles ---
  */
  const { classes } = useStyles({ isStudent });

  /*
  --- Localizations ---
  */

  /*
  --- Data fetching ---
  */
  const { data: subjectData } = useSubjectClasses(filters.subject, { enabled: !!filters.subject });
  const title = useTitle({ subject: subjectData, filters, variant, isStudent });

  return (
    <Box className={classes.root}>
      <Box className={classes.title}>{title}</Box>
    </Box>
  );
}

Header.propTypes = {
  filters: propTypes.object,
  variant: propTypes.string,
  isStudent: propTypes.bool,
};
