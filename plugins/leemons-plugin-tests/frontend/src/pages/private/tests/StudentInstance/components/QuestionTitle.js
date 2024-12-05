import { useMemo } from 'react';

import { Box, COLORS, Text, Stack } from '@bubbles-ui/components';
import { htmlToText } from '@common';
import PropTypes from 'prop-types';

export default function QuestionTitle(props) {
  const { styles, question, store, cx, t } = props;

  let questionTitleClassName = cx(styles.questionTitle);
  if (store.embedded) {
    questionTitleClassName = cx(questionTitleClassName, styles.questionTitleEmbedded);
  }

  const colorsByStatus = useMemo(
    () => ({
      ok: COLORS.fatic02,
      ko: COLORS.fatic01,
      null: null,
    }),
    []
  );

  const TableViewModePoints = useMemo(() => {
    if (!store.questionResponses || !t) return null;

    const questionResponse = store.questionResponses?.[question.id];
    const { status, cluesTypes: clueTypesArray, points } = questionResponse ?? {};

    const getPointsToSubstractFromClue = (clueType, totalPoints) => {
      const clue = store?.config?.clues?.find((clue) => clue.type === clueType);
      if (clue && totalPoints) {
        return ((clue.value / 100) * totalPoints).toFixed(2);
      }
      return 0;
    };

    let responsePoints = '';
    const okPoints = store.questionsInfo?.perQuestionNumber?.toFixed(2);
    const koPoints =
      store.questionsInfo?.perErrorQuestionNumber < 0
        ? store.questionsInfo?.perErrorQuestionNumber?.toFixed(2)
        : '0';
    const omitPoints =
      store.questionsInfo?.perOmitQuestionNumber < 0
        ? store.questionsInfo?.perOmitQuestionNumber?.toFixed(2)
        : '0';

    if (status === 'ok') {
      responsePoints = okPoints;
    } else if (status === 'ko') {
      responsePoints = koPoints;
    } else {
      responsePoints = omitPoints ?? '';
    }

    const finalPoints = points?.toFixed(2);

    return (
      <Stack spacing={3}>
        {clueTypesArray?.length > 0 && (
          <Stack spacing={3}>
            <Text style={{ whiteSpace: 'nowrap' }} size="xs">
              <span
                style={{
                  color: colorsByStatus[status],
                  paddingRight: 4,
                }}
              >
                {responsePoints}
              </span>{' '}
              {t('pointsInTotal')}
            </Text>

            {clueTypesArray.map((usedClueType, index) => (
              <>
                <Box style={{ borderLeft: '1px solid gray' }} />
                <Text style={{ whiteSpace: 'nowrap' }} size="xs" key={`${index}-${usedClueType}`}>
                  <span
                    style={{
                      color: colorsByStatus.ko,
                      paddingRight: 4,
                    }}
                  >
                    {`-${getPointsToSubstractFromClue(usedClueType, okPoints)}%`}
                  </span>
                  {t(`clueN`, { number: index + 1 })}
                </Text>
              </>
            ))}
          </Stack>
        )}
        <Text style={{ whiteSpace: 'nowrap' }} size="xs">
          <span
            style={{
              color: colorsByStatus[status],
            }}
          >
            {finalPoints}
          </span>{' '}
          {t('pointsOutOf', { questionPoints: okPoints })}
        </Text>
      </Stack>
    );
  }, [
    store?.questionResponses,
    store?.questionsInfo,
    colorsByStatus,
    t,
    question.id,
    store?.config?.clues,
  ]);

  return (
    <Box className={store.viewMode ? styles.tableViewModeTitle : questionTitleClassName}>
      <Box className={styles.questionTitleText}>
        <Text size={store.viewMode ? 'md' : 'lg'} role="productive" color="primary" strong>
          {props.index + 1}. {htmlToText(question.stem.text)}
        </Text>
      </Box>

      {!store.viewMode && (
        <Box>
          {TableViewModePoints}
          <Text size="xs" color="primary"></Text>
        </Box>
      )}

      {/* KEPT HERE UNTIL TEST PLUGIN FRONTEND CHANGES ARE FINALIZED - POSSIBLY DEPRECATED */}
      {store.embedded && store.viewMode ? (
        <Box className={cx(styles.questionValueCard, styles.questionValueCardEmbedded)}>
          <Box>
            <Text style={{ whiteSpace: 'nowrap' }}>
              <span
                style={{
                  color: store.viewMode
                    ? colorsByStatus[store.questionResponses?.[question.id].status]
                    : COLORS.fatic02,
                }}
              >
                {store.viewMode
                  ? store.questionResponses?.[question.id].points.toFixed(2)
                  : store.questionsInfo.perQuestion}
              </span>{' '}
              {t('pointsInTotal')}
            </Text>
          </Box>
          <Text size="xs" color="primary"></Text>
        </Box>
      ) : null}
    </Box>
  );
}

QuestionTitle.propTypes = {
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  index: PropTypes.number,
  tableViewMode: PropTypes.bool,
};
