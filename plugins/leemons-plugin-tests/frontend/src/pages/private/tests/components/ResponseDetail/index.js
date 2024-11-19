import React, { useCallback, useMemo } from 'react';

import { Stack, Text, Table, ContextContainer, HtmlText, Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import AnswerFeed from './AnswerFeed';
import ResponseStatusIcon from './ResponseStatusIcon';

import prefixPN from '@tests/helpers/prefixPN';

function ResponseDetail({ isCorrect, userSkipped, solutionLabel, responses, globalFeedback }) {
  const [t] = useTranslateLoader(prefixPN('testResult.responseDetail'));

  const columns = [
    {
      Header: t('choices'),
      accessor: 'choice',
      style: { width: '70%' },
    },
    {
      Header: t('result'),
      accessor: 'userAnswer',
      style: { width: '15%', textAlign: 'center' },
      cellStyle: { justifyContent: 'center' },
    },
    {
      Header: t('solution'),
      accessor: 'solution',
      style: { width: '15%', padding: 8 },
    },
  ];

  const getUserAnswer = useCallback(
    (isUserAnswer, isCorrect) => {
      if (userSkipped) return '-';
      if (!isUserAnswer) return '';
      return isCorrect ? (
        <ResponseStatusIcon isCorrect />
      ) : (
        <ResponseStatusIcon isCorrect={false} />
      );
    },
    [userSkipped]
  );

  const getSolution = useCallback(
    (isUserAnswer, isCorrect) => {
      if (isUserAnswer && !isCorrect) return solutionLabel;
      if (userSkipped) return solutionLabel;
      return '';
    },
    [solutionLabel, userSkipped]
  );

  const tableData = useMemo(() => {
    if (!responses?.length) return [];

    return responses?.map(({ choice, isUserAnswer, isCorrect }) => ({
      choice,
      userAnswer: getUserAnswer(isUserAnswer, isCorrect),
      solution: getSolution(isUserAnswer, isCorrect),
    }));
  }, [responses, getUserAnswer, getSolution]);

  return (
    <ContextContainer spacing={4} sx={{ marginBottom: 32 }}>
      <AnswerFeed isCorrect={isCorrect} t={t} />
      <Box sx={{ paddingInline: 16 }}>
        <Table fullWidth data={tableData} columns={columns} />
      </Box>

      {globalFeedback && (
        <Stack direction="column" spacing={2}>
          <Text color="primary" strong>
            {t('feedback')}
          </Text>
          <HtmlText>{globalFeedback}</HtmlText>
        </Stack>
      )}
    </ContextContainer>
  );
}

ResponseDetail.propTypes = {
  isCorrect: PropTypes.bool,
  userSkipped: PropTypes.bool,
  responses: PropTypes.array,
  globalFeedback: PropTypes.string,
  solutionLabel: PropTypes.string,
};

export default ResponseDetail;
export { ResponseDetail };
