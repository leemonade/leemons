import React from 'react';
import { Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@emails-amazon-ses/helpers/prefixPN';
import useRequestErrorMessage from '@common/useRequestErrorMessage';

export default function AddEmailProvider() {
  const [t] = useTranslateLoader(prefixPN('provider'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  return <Box>{t('title')}</Box>;
}
AddEmailProvider.propTypes = {};
