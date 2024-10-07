import React from 'react';

import { Stack, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import AnswerFeed from './AnswerFeed';

import prefixPN from '@tests/helpers/prefixPN';

function ResponseDetail({ isCorrect, responses }) {
  const [t] = useTranslateLoader(prefixPN('testResult.responseDetail'));

  const columns = [
    {
      label: 'OPCIONES 🌎',
      value: 'label',
    },
    {
      label: 'RESULTADO 🌎',
      value: 'value',
    },
    {
      label: 'SOLUCIÓN 🌎',
      value: 'value',
    },
  ];

  return (
    <Stack direction="column" gap={2}>
      <AnswerFeed isCorrect={isCorrect} t={t} />
      {/* <Table data={responses} columns={columns} /> */}

      <Stack direction="column" gap={2}>
        <Text strong>Explicación</Text>
        <Text>text</Text>
      </Stack>
    </Stack>
  );
}

ResponseDetail.propTypes = {
  isCorrect: PropTypes.object,
  responses: PropTypes.array,
};

export default ResponseDetail;
export { ResponseDetail };
