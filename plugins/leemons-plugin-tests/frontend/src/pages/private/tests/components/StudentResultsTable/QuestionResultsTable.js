import { useCallback, useMemo } from 'react';

import { Table, ActionButton, Stack, Box, Text, TextClamp } from '@bubbles-ui/components';
import { EditIcon, SlashIcon } from '@bubbles-ui/icons/solid';
import PropTypes from 'prop-types';

import { htmlToText } from '../../StudentInstance/helpers/htmlToText';
import ResponseStatusIcon from '../ResponseDetail/ResponseStatusIcon';

import { QUESTION_RESPONSE_STATUS } from '@tests/constants';

export default function QuestionResultsTable({
  isTeacher,
  onReviewQuestion,
  questions,
  styles,
  t,
  questionResponses,
  cx,
}) {
  const getScoreItem = useCallback(
    (questionId) => {
      const { points, status } = questionResponses?.[questionId] || {};

      return (
        <Stack justifyContent="center" fullWidth>
          {isTeacher && status === QUESTION_RESPONSE_STATUS.NOT_GRADED ? (
            <ActionButton
              icon={<EditIcon width={20} height={20} />}
              onClick={() => onReviewQuestion(questionId)}
            />
          ) : (
            points?.toFixed(2) || '-'
          )}
        </Stack>
      );
    },
    [isTeacher, onReviewQuestion, questionResponses]
  );

  const getResultItem = useCallback(
    (questionId) => (
      <Stack justifyContent="center" fullWidth>
        {questionResponses?.[questionId]?.status ? (
          <ResponseStatusIcon status={questionResponses?.[questionId]?.status} />
        ) : (
          <SlashIcon height={10} width={10} />
        )}
      </Stack>
    ),
    [questionResponses]
  );

  const headers = useMemo(
    () => [
      {
        Header: t('questionResultsTable.question'),
        accessor: 'question',
        className: cx(styles.tableHeader, styles.firstTableHeader),
      },
      {
        Header: t('questionResultsTable.questionType'),
        accessor: 'type',
        className: styles.tableHeader,
      },
      {
        Header: t('questionResultsTable.category'),
        accessor: 'category',
        className: styles.tableHeader,
      },
      {
        Header: t('questionResultsTable.level'),
        accessor: 'level',
        className: styles.tableHeader,
      },
      {
        Header: t('questionResultsTable.result'),
        accessor: 'result',
        className: styles.tableHeaderResults,
      },
      {
        Header: t('questionResultsTable.score'),
        accessor: 'score',
        className: styles.tableHeaderResults,
      },
    ],
    [t, styles, cx]
  );

  const tableData = useMemo(() => {
    if (!questions) return [];

    return questions.map((question, i) => ({
      question: (
        <Box className={styles.tableCell}>
          <TextClamp lines={2} withToolTip>
            <Text>
              {i + 1}. {htmlToText(question.stem.text)}
            </Text>
          </TextClamp>
        </Box>
      ),
      type: (
        <Box style={{ minWidth: '130px' }} className={styles.tableCell}>
          {question.type}
        </Box>
      ),
      category: (
        <Box style={{ minWidth: '130px' }} className={styles.tableCell}>
          {question.category?.category || '-'}
        </Box>
      ),
      level: (
        <Box style={{ minWidth: '130px' }} className={styles.tableCell}>
          {question.level || '-'}
        </Box>
      ),
      result: getResultItem(question.id),
      score: getScoreItem(question.id),
    }));
  }, [questions, styles, getScoreItem, getResultItem]);

  return <Table columns={headers} data={tableData} />;
}

QuestionResultsTable.propTypes = {
  isTeacher: PropTypes.bool,
  onReviewQuestion: PropTypes.func,
  questions: PropTypes.array,
  styles: PropTypes.object,
  t: PropTypes.func,
  questionResponses: PropTypes.object,
  cx: PropTypes.func,
};
