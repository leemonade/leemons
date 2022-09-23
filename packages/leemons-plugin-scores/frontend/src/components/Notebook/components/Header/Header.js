import React, { useMemo } from 'react';
import { Box, Button, createStyles, Text } from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import { addAction, fireEvent } from 'leemons-hooks';

import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useSubjectClasses from '@academic-portfolio/hooks/useSubjectClasses';
import { addErrorAlert } from '@layout/alert';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    backgroundColor: theme.colors.interactive03h,
    padding: theme.spacing[1],
    paddingTop: theme.spacing[3],
    paddingInline: theme.spacing[2],
    paddingLeft: theme.spacing[5],
    paddingRight: theme.spacing[5],
  },
  title: {
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
  addAction('plugins.scores::downloaded-intercepted', () => {
    clearTimeout(timer);
  });

  addAction('plugins.scores::download-scores-error', ({ args: [e] }) => {
    addErrorAlert(`Error downloading scores report ${e.message}`);
  });

  fireEvent('plugins.scores::download-scores', extension);
  timer = setTimeout(() => {
    fireEvent('plugins.scores::download-scores-error', new Error('timeout'));
  }, 1000);
}

function useTitle({ subject, filters }) {
  return React.useMemo(() => {
    if (!subject) {
      return <Text></Text>;
    }

    const subjectGroupToUse = subject.find((s) => s.groups?.id === filters.group);

    if (!subjectGroupToUse) {
      return <Text></Text>;
    }

    const subjectName = subjectGroupToUse.subject.name;
    const className = subjectGroupToUse.groups?.name;

    if (className) {
      return (
        <Text strong color="primary" size="md">
          {subjectName} - {className}
        </Text>
      );
    }
    return (
      <Text strong color="primary" size="md">
        {subjectName}
      </Text>
    );
  }, [subject, filters]);
}

export default function Header({ filters = {} }) {
  /*
    --- Styles ---
  */
  const { classes } = useStyles();

  /*
  --- Localizations ---
  */
  const labels = useHeaderLocalizations();

  /*
  --- Data fetching ---
  */
  const { data: subjectData } = useSubjectClasses(filters.subject, { enabled: !!filters.subject });
  const title = useTitle({ subject: subjectData, filters });

  return (
    <Box className={classes.root}>
      <Box className={classes.title}>{title}</Box>
      <Button
        variant="outline"
        size="xs"
        position="center"
        leftIcon={<DownloadIcon />}
        onClick={() => onScoresDownload('xlsx')}
      >
        {labels.export} excel
      </Button>
      <Button
        variant="outline"
        size="xs"
        position="center"
        leftIcon={<DownloadIcon />}
        onClick={() => onScoresDownload('csv')}
      >
        {labels.export} csv
      </Button>
    </Box>
  );
}
