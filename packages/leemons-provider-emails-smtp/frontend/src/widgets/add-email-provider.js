import React from 'react';
import { Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@emails-smtp/helpers/prefixPN';
import useRequestErrorMessage from '@common/useRequestErrorMessage';

export default function AddEmailProvider() {
  const [t] = useTranslateLoader(prefixPN('setup'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  return <Box>Holaaaa</Box>;
}
AddEmailProvider.propTypes = {};
