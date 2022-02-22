import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@scores/helpers/prefixPN';
import { useHistory } from 'react-router-dom';
import { Box } from '@bubbles-ui/components';

function AddCurriculum() {
  const [t] = useTranslateLoader(prefixPN('addCurriculum'));

  const history = useHistory();

  return <Box>Hola :D</Box>;
}

export default AddCurriculum;
