import { Box, createStyles, Title } from '@bubbles-ui/components';
import { unflatten } from '@common';
import propTypes from 'prop-types';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN as _prefixPN } from '@scores/helpers';
import _ from 'lodash';
import React, { useMemo } from 'react';

const useHeaderStyles = createStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing[5],
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
    // maxWidth: 750,
    backgroundColor: 'white',
  },
  title: {
    // marginBottom: theme.spacing[5],
  },
}));

function useHeaderLocalizations({ prefixPN, variant }) {
  const prefix = prefixPN || _prefixPN;
  const key = prefix(`${variant}.header.teacher`);
  const [, translations] = useTranslateLoader(key);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return _.get(res, key);
    }

    return {};
  }, [translations]);
}

export function Header({ prefixPN, variant }) {
  const { classes } = useHeaderStyles();
  const localizations = useHeaderLocalizations({ prefixPN, variant });

  return (
    <Box className={classes.root}>
      <Title className={classes.title}>{localizations?.title}</Title>
      {/* <Text>{localizations.description}</Text> */}
    </Box>
  );
}

Header.propTypes = {
  prefixPN: propTypes.string,
  variant: propTypes.string,
};

export default Header;
