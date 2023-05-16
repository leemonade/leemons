import { Box, createStyles, Text, Title } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN as _prefixPN } from '@scores/helpers';
import _ from 'lodash';
import React, { useMemo } from 'react';

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

function useHeaderLocalizations({ prefixPN, variant }) {
  const prefix = prefixPN || _prefixPN;
  const key = prefix(`${variant}.header.teacher`);
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

export function Header({ prefixPN, variant }) {
  const { classes } = useHeaderStyles();
  const localizations = useHeaderLocalizations({ prefixPN, variant });

  return (
    <Box className={classes.root}>
      <Title className={classes.title}>{localizations?.title}</Title>
      <Text>{localizations.description}</Text>
    </Box>
  );
}

export default Header;
