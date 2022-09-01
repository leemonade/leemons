import React, { useMemo } from 'react';
import { Box, createStyles, Text, Title } from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

const useHeaderStyles = createStyles((theme) => ({
  root: {
    marginLeft: theme.spacing[5],
    marginTop: theme.spacing[10],
    maxWidth: 750,
  },
  title: {
    marginBottom: theme.spacing[5],
  },
}));

function useHeaderLocalizations({ variant }) {
  const key = prefixPN(`${variant}.header.teacher`);
  const [, translations] = useTranslateLoader(key);

  const localizations = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return _.get(res, key);
    }

    return {};
  }, [translations]);

  return localizations;
}

export function Header({ variant }) {
  const { classes } = useHeaderStyles();
  const localizations = useHeaderLocalizations({ variant });

  return (
    <Box className={classes.root}>
      <Title className={classes.title}>{localizations?.title}</Title>
      <Text>{localizations.description}</Text>
    </Box>
  );
}

export default Header;
