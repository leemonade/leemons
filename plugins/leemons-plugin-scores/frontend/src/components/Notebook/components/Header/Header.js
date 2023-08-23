import React, { useMemo } from 'react';
import { Box, Button, createStyles } from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
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
    gap: theme.spacing[2],
    backgroundColor: isStudent
      ? theme.other.global.background.color.surface.muted
      : theme.colors.interactive03h,
    padding: isStudent ? '16px 48px' : `${theme.spacing[3]}px ${theme.spacing[5]}px`,
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

function useHeaderLocalizations() {
  const [, translations] = useTranslateLoader(prefixPN('notebook.header'));

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return _.get(res, prefixPN('notebook.header'));
    }

    return {};
  }, [translations]);

  return labels;
}

function onScoresDownload(extension) {
  let timer;

  const onClearTimer = () => {
    clearTimeout(timer);

    removeAction('plugins.scores::downloaded-intercepted', onClearTimer);
  };

  const onError = ({ args: [e] }) => {
    addErrorAlert(`Error downloading scores report ${e.message}`);

    removeAction('plugins.scores::download-scores-error', onError);
  };

  addAction('plugins.scores::downloaded-intercepted', onClearTimer);
  addAction('plugins.scores::download-scores-error', onError);

  fireEvent('plugins.scores::download-scores', extension);
  timer = setTimeout(() => {
    fireEvent('plugins.scores::download-scores-error', new Error('timeout'));
  }, 1000);
}

export default function Header({ filters = {}, variant, allowDownload, isStudent }) {
  /*
    --- Styles ---
  */
  const { classes } = useStyles({ isStudent });

  /*
  --- Localizations ---
  */
  const labels = useHeaderLocalizations();

  /*
  --- Data fetching ---
  */
  const { data: subjectData } = useSubjectClasses(filters.subject, { enabled: !!filters.subject });
  const title = useTitle({ subject: subjectData, filters, variant, isStudent });

  return (
    <Box className={classes.root}>
      <Box className={classes.title}>{title}</Box>
      {allowDownload && (
        <>
          <Button
            variant="outline"
            size="sm"
            position="center"
            leftIcon={<DownloadIcon />}
            onClick={() => onScoresDownload('xlsx')}
          >
            {labels.export} excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            position="center"
            leftIcon={<DownloadIcon />}
            onClick={() => onScoresDownload('csv')}
          >
            {labels.export} csv
          </Button>
        </>
      )}
    </Box>
  );
}
