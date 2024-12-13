import { useCallback, useMemo, useState } from 'react';

import { useLevelsOfDifficulty } from '@assignables/components/LevelsOfDifficulty';
import {
  PaginatedList,
  ActionButton,
  Stack,
  Box,
  Text,
  TextClamp,
  ContextContainer,
} from '@bubbles-ui/components';
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
  const [currentPage, setCurrentPage] = useState(1); // This pagination is handled entirely in frontend as a presentational thing
  const size = 10;
  const levels = useLevelsOfDifficulty();
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
      },
      {
        Header: t('questionResultsTable.questionType'),
        accessor: 'type',
      },
      {
        Header: t('questionResultsTable.category'),
        accessor: 'category',
      },
      {
        Header: t('questionResultsTable.level'),
        accessor: 'level',
      },
      {
        Header: t('questionResultsTable.result'),
        accessor: 'result',
      },
      {
        Header: t('questionResultsTable.score'),
        accessor: 'score',
      },
    ],
    [t]
  );

  const tableData = useMemo(() => {
    if (!questions) return [];

    const startIndex = (currentPage - 1) * size;
    const paginatedQuestions = questions.slice(startIndex, startIndex + size);

    return paginatedQuestions.map((question, i) => ({
      question: (
        <Box sx={{ minWidth: '150px' }}>
          <TextClamp lines={2} withToolTip>
            <Text>
              {startIndex + i + 1}. {htmlToText(question.stem.text)}
            </Text>
          </TextClamp>
        </Box>
      ),
      type: <Box sx={{ minWidth: '130px' }}>{question.type}</Box>,
      category: <Box sx={{ minWidth: '130px' }}>{question.category?.category || '-'}</Box>,
      level: (
        <Box sx={{ minWidth: '130px' }}>
          {levels.find((level) => level.value === question.level)?.label || question.level || '-'}
        </Box>
      ),
      result: getResultItem(question.id),
      score: getScoreItem(question.id),
    }));
  }, [questions, getScoreItem, getResultItem, levels, currentPage, size]);

  return (
    <ContextContainer>
      <PaginatedList
        columns={headers}
        items={tableData}
        size={size}
        page={currentPage}
        hidePaper
        totalCount={questions?.length || 0}
        totalPages={Math.ceil(questions?.length / size)}
        onPageChange={setCurrentPage}
      />
    </ContextContainer>
  );
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
