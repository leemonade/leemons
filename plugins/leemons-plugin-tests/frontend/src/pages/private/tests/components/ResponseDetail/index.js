import { useCallback, useMemo } from 'react';

import { Stack, Text, Table, ContextContainer, HtmlText, Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import AnswerFeed from './AnswerFeed';
import ResponseStatusIcon from './ResponseStatusIcon';

import prefixPN from '@tests/helpers/prefixPN';
import { QUESTION_TYPES } from '@tests/pages/private/questions-banks/questionConstants';

const CHOICE_BASED_QUESTION_TYPES = [
  QUESTION_TYPES.MONO_RESPONSE,
  QUESTION_TYPES.MAP,
  QUESTION_TYPES.TRUE_FALSE,
];

const getResultCell = ({ value }) => {
  return (
    <Box
      sx={() => ({
        marginInline: 'auto',
      })}
    >
      {value}
    </Box>
  );
};

function ResponseDetail({
  isCorrect,
  userSkipped,
  solutionLabel,
  responses,
  globalFeedback,
  isChoiceBased,
}) {
  const [t] = useTranslateLoader(prefixPN('testResult.responseDetail'));

  const columns = [
    {
      Header: isChoiceBased ? t('answers') : t('answer'),
      accessor: 'choice',
      style: { width: '70%' },
    },
    {
      Header: t('result'),
      accessor: 'result',
      style: { width: '15%', textAlign: 'center' },

      Cell: getResultCell,
    },
    {
      Header: t('solution'),
      accessor: 'solution',
    },
  ];

  const getResult = useCallback(
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

  console.log('isChoiceBased', isChoiceBased);
  const getSolution = useCallback(
    (isUserAnswer, isCorrect) => {
      if (!isChoiceBased) return solutionLabel;
      if (isUserAnswer && !isCorrect) return solutionLabel;
      if (userSkipped) return solutionLabel;
      return '';
    },
    [solutionLabel, userSkipped, isChoiceBased]
  );

  const tableData = useMemo(() => {
    if (!responses?.length) return [];

    return responses?.map(({ choice, isUserAnswer, isCorrect }) => ({
      choice,
      result: getResult(isUserAnswer, isCorrect),
      solution: getSolution(isUserAnswer, isCorrect),
    }));
  }, [responses, getResult, getSolution]);

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
  responses: PropTypes.arrayOf(
    PropTypes.shape({
      response: PropTypes.string,
      isUserAnswer: PropTypes.bool,
      isCorrect: PropTypes.bool,
    })
  ),
  globalFeedback: PropTypes.string,
  solutionLabel: PropTypes.string,
  isChoiceBased: PropTypes.bool,
};

function Index(props) {
  const { questionType } = props;

  return (
    <ResponseDetail {...props} isChoiceBased={CHOICE_BASED_QUESTION_TYPES.includes(questionType)} />
  );
}

Index.propTypes = {
  questionType: PropTypes.string,
};

export default Index;
