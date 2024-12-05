import { Box, COLORS, Text, Stack } from '@bubbles-ui/components';
import { htmlToText } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { TestStyles } from '../TestStyles.style';

import prefixPN from '@tests/helpers/prefixPN';

const colorsByStatus = { ok: COLORS.fatic02, ko: COLORS.fatic01, null: null };

function Score({ questionResponse, assignmentConfig, questionsInfo }) {
  const [t] = useTranslateLoader(prefixPN('studentInstance'));
  if (!questionResponse || !t) return null;

  const { status, cluesTypes: clueTypesArray, points } = questionResponse ?? {};

  const getPointsToSubstractFromClue = (clueType, totalPoints) => {
    const clue = assignmentConfig?.clues?.find((clue) => clue.type === clueType);
    if (clue && totalPoints) {
      return ((clue.value / 100) * totalPoints).toFixed(2);
    }
    return 0;
  };

  let responsePoints = '';
  const okPoints = questionsInfo?.perQuestionNumber?.toFixed(2);
  const koPoints =
    questionsInfo?.perErrorQuestionNumber < 0
      ? questionsInfo?.perErrorQuestionNumber?.toFixed(2)
      : '0';
  const omitPoints =
    questionsInfo?.perOmitQuestionNumber < 0
      ? questionsInfo?.perOmitQuestionNumber?.toFixed(2)
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
}

Score.propTypes = {
  questionResponse: PropTypes.object,
  assignmentConfig: PropTypes.object,
  questionsInfo: PropTypes.object,
};

export default function QuestionTitleComponent({
  question,
  questionIndex,
  questionResponse,
  assignmentConfig,
  questionsInfo,
  viewMode,
}) {
  const { classes } = TestStyles({}, { name: 'Tests' });

  return (
    <Box className={viewMode ? classes.tableViewModeTitle : classes.questionTitle}>
      <Box className={classes.questionTitleText}>
        <Text size={viewMode ? 'md' : 'lg'} role="productive" color="primary" strong>
          {questionIndex + 1}. {htmlToText(question.stem.text)}
        </Text>
      </Box>

      {viewMode && (
        <Box>
          <Score
            questionResponse={questionResponse}
            assignmentConfig={assignmentConfig}
            questionsInfo={questionsInfo}
          />
          <Text size="xs" color="primary"></Text>
        </Box>
      )}
    </Box>
  );
}

QuestionTitleComponent.propTypes = {
  question: PropTypes.object,
  questionIndex: PropTypes.number,
  questionResponse: PropTypes.object,
  assignmentConfig: PropTypes.object,
  questionsInfo: PropTypes.object,
  viewMode: PropTypes.bool,
};
