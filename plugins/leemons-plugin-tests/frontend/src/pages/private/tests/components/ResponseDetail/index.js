import { useCallback, useMemo } from 'react';

import { Stack, Text, Table, ContextContainer, HtmlText, Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import AnswerFeed from './AnswerFeed';
import ResponseStatusIcon from './ResponseStatusIcon';

import { QUESTION_RESPONSE_STATUS } from '@tests/constants';
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

function OpenResponseDetail({ response, teacherFeedback, t }) {
  return (
    <Stack direction="column" spacing={5}>
      <Stack direction="column" spacing={2}>
        <Text role="productive" color="primary" strong>
          {t('answer')}
        </Text>
        <Text>{response}</Text>
      </Stack>
      {teacherFeedback && (
        <Stack direction="column" spacing={2}>
          <Text role="productive" color="primary" strong>
            {t('feedback')}
          </Text>
          <HtmlText>{teacherFeedback}</HtmlText>
        </Stack>
      )}
    </Stack>
  );
}

OpenResponseDetail.propTypes = {
  response: PropTypes.string,
  teacherFeedback: PropTypes.string,
  t: PropTypes.func,
};

function ResponseDetail({
  questionStatus,
  userSkipped,
  solutionLabel,
  responses,
  globalFeedback,
  isChoiceBased,
  isOpenResponse,
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
        <ResponseStatusIcon status={QUESTION_RESPONSE_STATUS.OK} />
      ) : (
        <ResponseStatusIcon status={QUESTION_RESPONSE_STATUS.KO} />
      );
    },
    [userSkipped]
  );

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
      {!userSkipped && <AnswerFeed questionStatus={questionStatus} t={t} />}
      <Box sx={{ paddingInline: 16 }}>
        {isOpenResponse ? (
          <OpenResponseDetail
            response={responses[0].choice}
            teacherFeedback={responses[0].teacherFeedback}
            t={t}
          />
        ) : (
          <Table fullWidth data={tableData} columns={columns} />
        )}
      </Box>

      {globalFeedback && (
        <Stack direction="column" spacing={2}>
          <Text color="primary" strong>
            {t('explanation')}
          </Text>
          <HtmlText>{globalFeedback}</HtmlText>
        </Stack>
      )}
    </ContextContainer>
  );
}

ResponseDetail.propTypes = {
  questionStatus: PropTypes.string,
  userSkipped: PropTypes.bool,
  responses: PropTypes.arrayOf(
    PropTypes.shape({
      choice: PropTypes.string,
      isUserAnswer: PropTypes.bool,
      isCorrect: PropTypes.bool,
      teacherFeedback: PropTypes.string,
    })
  ),
  globalFeedback: PropTypes.string,
  solutionLabel: PropTypes.string,
  isChoiceBased: PropTypes.bool,
  isOpenResponse: PropTypes.bool,
};

function Index(props) {
  const { questionType } = props;

  return (
    <ResponseDetail
      {...props}
      isChoiceBased={CHOICE_BASED_QUESTION_TYPES.includes(questionType)}
      isOpenResponse={questionType === QUESTION_TYPES.OPEN_RESPONSE}
    />
  );
}

Index.propTypes = {
  questionType: PropTypes.string,
};

export default Index;
