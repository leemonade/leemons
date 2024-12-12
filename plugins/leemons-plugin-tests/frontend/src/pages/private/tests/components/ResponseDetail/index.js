import { useCallback, useMemo } from 'react';

import {
  Stack,
  Text,
  Table,
  ContextContainer,
  HtmlText,
  Box,
  Checkbox,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import StemResource from '../../StudentInstance/components/StemResource';

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
  userSkipped,
  solutionLabel,
  responses,
  isChoiceBased,
  isOpenResponse,
  showChoiceCheckbox,
  t,
}) {
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

  const getChoice = useCallback(
    (choice, isUserAnswer) => {
      if (!showChoiceCheckbox) return choice;

      return (
        <Stack alignItems="center">
          <Checkbox checked={isUserAnswer} disabled />
          {choice}
        </Stack>
      );
    },
    [showChoiceCheckbox]
  );

  const tableData = useMemo(() => {
    if (!responses?.length) return [];

    return responses?.map(({ choice, isUserAnswer, isCorrect }) => ({
      choice: getChoice(choice, isUserAnswer),
      result: getResult(isUserAnswer, isCorrect),
      solution: getSolution(isUserAnswer, isCorrect),
    }));
  }, [responses, getResult, getSolution, getChoice]);

  return (
    <>
      {isOpenResponse ? (
        <OpenResponseDetail
          response={responses[0].choice}
          teacherFeedback={responses[0].teacherFeedback}
          t={t}
        />
      ) : (
        <Table fullWidth data={tableData} columns={columns} />
      )}
    </>
  );
}

ResponseDetail.propTypes = {
  userSkipped: PropTypes.bool,
  responses: PropTypes.arrayOf(
    PropTypes.shape({
      choice: PropTypes.string,
      isUserAnswer: PropTypes.bool,
      isCorrect: PropTypes.bool,
      teacherFeedback: PropTypes.string,
    })
  ),
  solutionLabel: PropTypes.string,
  isChoiceBased: PropTypes.bool,
  isOpenResponse: PropTypes.bool,
  showChoiceCheckbox: PropTypes.bool,
  t: PropTypes.func,
};

function Index(props) {
  const [t] = useTranslateLoader(prefixPN('testResult.responseDetail'));
  const {
    questionType,
    questionStatus,
    globalFeedback,
    stemResource,
    displayStemMediaHorizontally,
  } = props;

  return (
    <ContextContainer spacing={4} sx={{ marginBottom: 32 }}>
      <AnswerFeed questionStatus={questionStatus} t={t} />
      <Box sx={{ paddingInline: 16 }}>
        {stemResource && displayStemMediaHorizontally ? (
          <Stack fullWidth spacing={1}>
            <Box noFlex sx={{ width: '30%' }}>
              <StemResource asset={stemResource} />
            </Box>
            <Box sx={{ width: '70%' }}>
              <ResponseDetail
                {...props}
                isChoiceBased={CHOICE_BASED_QUESTION_TYPES.includes(questionType)}
                isOpenResponse={questionType === QUESTION_TYPES.OPEN_RESPONSE}
                t={t}
              />
            </Box>
          </Stack>
        ) : (
          <Stack fullWidth spacing={4} direction="column">
            {stemResource && <StemResource asset={stemResource} />}
            <ResponseDetail
              {...props}
              isChoiceBased={CHOICE_BASED_QUESTION_TYPES.includes(questionType)}
              isOpenResponse={questionType === QUESTION_TYPES.OPEN_RESPONSE}
              t={t}
            />
          </Stack>
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

Index.propTypes = {
  questionType: PropTypes.string,
  questionStatus: PropTypes.string,
  userSkipped: PropTypes.bool,
  globalFeedback: PropTypes.string,
  stemResource: PropTypes.object,
  displayStemMediaHorizontally: PropTypes.bool,
};

export default Index;
