import React from 'react';
import { Box, Stack, Button, ContextContainer, Select } from '@bubbles-ui/components';
import { useHistory } from 'react-router-dom';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '../../../helpers/prefixPN';

const Signup = () => {
  const [t] = useTranslateLoader(prefixPN('signup'));

  return <Box>{t('title')}</Box>;
};

export default Signup;
