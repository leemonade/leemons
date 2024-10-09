import React, { useMemo } from 'react';

import { Box, COLORS, Text } from '@bubbles-ui/components';
import { htmlToText } from '@common';
import PropTypes from 'prop-types';

export default function QuestionTitle(props) {
  const { styles, question, store, cx, t, tableViewMode } = props;

  let classNameQuestionTitle = cx(styles.questionTitle);
  if (store.embedded) {
    classNameQuestionTitle = cx(classNameQuestionTitle, styles.questionTitleEmbedded);
  }

  const colorsByStatus = useMemo(
    () => ({
      ok: COLORS.fatic02,
      ko: COLORS.fatic01,
      null: null,
    }),
    []
  );

  // TODO PAOLA: Modificar mono responses y map para que usen ese question title de la forma correcta. Pueden tener también su propio ViewModeResponses.js file

  // TODO PAOLA, preguntar si se cambia el detalle de las preguntas existentes de una vez, se ven diferentes
  const TableViewModePoints = useMemo(() => {
    if (!store.questionResponses || !t) return null;

    const questionPoints = store.questionsInfo?.perQuestionNumber?.toFixed(2);
    const status = store.questionResponses?.[question.id].status;

    let responsePoints = '';
    const okPoints = store.questionsInfo?.perQuestion;
    const koPoints =
      store.questionsInfo?.perErrorQuestionNumber < 0 ? store.questionsInfo?.perErrorQuestion : '0';
    const omitPoints =
      store.questionsInfo?.perOmitQuestionNumber < 0 ? store.questionsInfo?.perOmitQuestion : '0';

    if (status === 'ok') {
      responsePoints = okPoints;
    } else if (status === 'ko') {
      responsePoints = koPoints;
    } else {
      responsePoints = omitPoints ?? '';
    }

    console.log(store.questionResponses?.[question.id]);
    console.log(store.questionsInfo);

    return (
      <Box>
        <Text style={{ whiteSpace: 'nowrap' }}>
          <span
            style={{
              color: colorsByStatus[status],
            }}
          >
            {responsePoints}
          </span>{' '}
          {t('pointsOutOf', { questionPoints })}
        </Text>
      </Box>
    );
  }, [store.questionResponses, store.questionsInfo, colorsByStatus, t, question.id]);

  return (
    <Box className={tableViewMode ? styles.tableViewModeTitle : classNameQuestionTitle}>
      <Box className={styles.questionTitleText}>
        <Text size={store.viewMode ? 'sm' : 'lg'} role="productive" color="primary" strong>
          {props.index + 1}. {htmlToText(question.stem.text)}
        </Text>
      </Box>

      {tableViewMode && (
        <Box className={cx(styles.questionValueCard, styles.questionValueCardEmbedded)}>
          {TableViewModePoints}
          <Text size="xs" color="primary"></Text>
        </Box>
      )}

      {/* KEPT HERE UNTIL TEST PLUGIN FRONTEND CHANGES ARE FINALIZED - POSSIBLY DEPRECATED */}
      {store.embedded && store.viewMode && !tableViewMode ? (
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
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  index: PropTypes.number,
  tableViewMode: PropTypes.bool,
};
