import React, { useMemo } from 'react';
import { Box, Button, createStyles, IconButton, Text } from '@bubbles-ui/components';
import { DownloadIcon, MoveLeftIcon, MoveRightIcon } from '@bubbles-ui/icons/outline';

import _ from 'lodash';
import { LocaleDate, unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useSubjectClasses from '@academic-portfolio/hooks/useSubjectClasses';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';

const useStyles = createStyles((theme, { isOpened } = {}) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    backgroundColor: theme.colors.interactive03h,
    padding: theme.spacing[1],
    paddingInline: theme.spacing[2],
    paddingLeft: isOpened ? theme.spacing[2] : theme.spacing[5],
  },
  title: {
    flex: 1,
  },
}));

export default function Header({ isOpened, onOpenChange, filters = {} }) {
  /*
    --- Styles ---
  */
  const { classes } = useStyles({ isOpened });
  /*
  --- Localizations ---
  */
  const [, translations] = useTranslateLoader(prefixPN('notebook.header'));

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('notebook.header'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  /*
  --- Data fetching ---
  */
  const { data: subjectData } = useSubjectClasses(filters.subject, { enabled: !!filters.subject });
  const title = React.useMemo(() => {
    if (!subjectData) {
      return <Text></Text>;
    }

    const subjectGroupToUse = subjectData.find((s) => s.groups.id === filters.group);

    if (!subjectGroupToUse) {
      return <Text></Text>;
    }

    const periodName = filters.period?.name || (
      <Text>
        <LocaleDate date={filters?.startDate} /> - <LocaleDate date={filters?.endDate} />
      </Text>
    );
    const subjectName = subjectGroupToUse.subject.name;
    const className = subjectGroupToUse.groups.name;

    return (
      <Text>
        {periodName}: {subjectName} - {className}
      </Text>
    );
  }, [subjectData, filters]);

  return (
    <Box className={classes.root}>
      {isOpened && (
        <IconButton
          variant="transparent"
          size="lg"
          icon={<MoveLeftIcon />}
          onClick={() => onOpenChange(false)}
        />
      )}
      {!isOpened && (
        <IconButton
          variant="transparent"
          size="lg"
          icon={<MoveRightIcon />}
          onClick={() => onOpenChange(true)}
        />
      )}

      <Box className={classes.title}>{title}</Box>
      <Button variant="outline" size="xs" position="center" leftIcon={<DownloadIcon />}>
        {labels.export}
      </Button>
    </Box>
  );
}
