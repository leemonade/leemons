import { useMemo } from 'react';

import { Box, Text, TextClamp } from '@bubbles-ui/components';
import { CheckBoldIcon, RemoveBoldIcon, SlashIcon } from '@bubbles-ui/icons/solid';
import { find, map } from 'lodash';

import { htmlToText } from '../../StudentInstance/helpers/htmlToText';

export default function useCommonTableData({
  questions,
  styles,
  t,
  questionResponses,
  levels,
  cx,
}) {
  const headers = useMemo(
    () => [
      {
        Header: t('question'),
        accessor: 'question',
        className: cx(styles.tableHeader, styles.firstTableHeader),
      },
      {
        Header: t('type') ?? '🌎 Tipo',
        accessor: 'type',
        className: styles.tableHeader,
      },
      {
        Header: t('category'),
        accessor: 'category',
        className: styles.tableHeader,
      },
      {
        Header: t('level'),
        accessor: 'level',
        className: styles.tableHeader,
      },
      {
        Header: t('result'),
        accessor: 'result',
        className: styles.tableHeaderResults,
      },
      {
        Header: t('score') ?? '🌎 Puntuación',
        accessor: 'score',
        className: styles.tableHeaderResults,
      },
    ],
    [t, styles, cx]
  );

  const data = useMemo(() => {
    if (!questions) return [];
    return map(questions, (question, i) => {
      let result = '';
      if (questionResponses[question.id].status === 'ok') {
        result = (
          <Box
            style={{ minWidth: '100px', color: '#5CBC6A', textAlign: 'center' }}
            className={styles.tableCell}
          >
            <CheckBoldIcon height={12} width={12} />
          </Box>
        );
      } else if (questionResponses[question.id].status === 'ko') {
        result = (
          <Box
            style={{ minWidth: '100px', color: '#D13B3B', textAlign: 'center' }}
            className={styles.tableCell}
          >
            <RemoveBoldIcon height={12} width={12} />
          </Box>
        );
      } else {
        result = (
          <Box
            style={{ minWidth: '100px', color: '#4D5358', textAlign: 'center' }}
            className={styles.tableCell}
          >
            <SlashIcon height={10} width={10} />
          </Box>
        );
      }
      return {
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
        result,
      };
    });
  }, [questions, questionResponses, levels, styles]);

  return useMemo(
    () => ({
      headers,
      data,
    }),
    [headers, data]
  );
}
