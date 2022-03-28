import React from 'react';
import { ContextContainer } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@dashboard/helpers/prefixPN';

export default function Setup() {
  const [t, translations] = useTranslateLoader(prefixPN('setup_page'));

  return <ContextContainer fullHeight>Hola</ContextContainer>;
}
