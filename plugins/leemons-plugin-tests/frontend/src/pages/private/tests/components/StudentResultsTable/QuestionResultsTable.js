import { useCallback, useMemo } from 'react';

import { Table, ActionButton, Stack, Box, Text, TextClamp } from '@bubbles-ui/components';
import { EditIcon, SlashIcon } from '@bubbles-ui/icons/solid';
import { find } from 'lodash';
import PropTypes from 'prop-types';

import { htmlToText } from '../../StudentInstance/helpers/htmlToText';
import ResponseStatusIcon from '../ResponseDetail/ResponseStatusIcon';

export default function QuestionResultsTable({
  onlyOpenResponseQuestions,
  isTeacher,
  onReviewQuestion,
  questions,
  styles,
  t,
  questionResponses,
  levels,
  cx,
}) {
  const getScoreItem = useCallback(
    (questionId, points) => {
      return (
        <Stack justifyContent="center" fullWidth>
          {isTeacher && onlyOpenResponseQuestions ? (
            <ActionButton
              icon={<EditIcon width={20} height={20} />}
              onClick={() => onReviewQuestion(questionId)}
            />
          ) : (
            points || '-'
          )}
        </Stack>
      );
    },
    [isTeacher, onlyOpenResponseQuestions, onReviewQuestion]
  );

  const getResultItem = useCallback(
    (questionResponseStatus) => (
      <Stack justifyContent="center" fullWidth>
        {questionResponseStatus ? (
          <ResponseStatusIcon status={questionResponseStatus} />
        ) : (
          <SlashIcon height={10} width={10} />
        )}
      </Stack>
    ),
    []
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
          {question.level ? find(levels, { value: question.level }).label : '-'}
        </Box>
      ),
      result: getResultItem(questionResponses[question.id].status),
      score: getScoreItem(question.id, questionResponses[question.id].points),
    }));
  }, [questions, questionResponses, levels, styles, getScoreItem, getResultItem]);

  return <Table columns={headers} data={tableData} />;
}

QuestionResultsTable.propTypes = {
  onlyOpenResponseQuestions: PropTypes.bool,
  isTeacher: PropTypes.bool,
  onReviewQuestion: PropTypes.func,
  questions: PropTypes.array,
  styles: PropTypes.object,
  t: PropTypes.func,
  questionResponses: PropTypes.object,
  levels: PropTypes.array,
  cx: PropTypes.func,
};
