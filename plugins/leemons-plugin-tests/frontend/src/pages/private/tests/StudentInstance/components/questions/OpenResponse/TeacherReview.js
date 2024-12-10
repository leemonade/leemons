import { useMemo, useState } from 'react';

import {
  Stack,
  Text,
  RadioGroup,
  createStyles,
  Box,
  Button,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { TextEditorInput, TEXT_EDITOR_TEXTAREA_TOOLBARS } from '@bubbles-ui/editors';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { getConfigByInstance } from '../../../helpers/getConfigByInstance';
import QuestionTitleComponent from '../../QuestionTitleComponent';

import prefixPN from '@tests/helpers/prefixPN';
import { setOpenQuestionGradeRequest } from '@tests/request';

const useTeacherReviewStyles = createStyles((theme) => ({
  container: {
    marginTop: 16,
    gap: 16,
  },
}));

export default function TeacherReview({
  response,
  questionIndex,
  scrollRef,
  question,
  assignmentConfig,
  questionsInfo,
  studentUserAgentId,
  instance,
  afterSaveCorrection,
}) {
  const [t] = useTranslateLoader(prefixPN('testResult.responseDetail'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [teacherFeedback, setTeacherFeedback] = useState('');
  const [questionStatus, setQuestionStatus] = useState(null);
  const { classes } = useTeacherReviewStyles();
  const [isLoading, setIsLoading] = useState(false);

  const userAnswer = response?.properties?.response || '-';
  const studentSkipped = !response?.status;
  const { questionFilters } = getConfigByInstance(instance);

  const showFeedbackSection = useMemo(
    () => questionFilters?.openResponse?.enableTeacherReviewFeedback,
    [questionFilters]
  );

  const radioData = useMemo(
    () => [
      {
        value: 'ok',
        label: t('questionStatus.ok'),
      },
      {
        value: 'partial',
        label: t('questionStatus.partial'),
      },
      {
        value: 'ko',
        label: t('questionStatus.ko'),
      },
    ],
    [t]
  );

  // HANDLERS ····································································································

  const onSaveCorrection = async (data) => {
    try {
      setIsLoading(true);
      await setOpenQuestionGradeRequest({
        instanceId: instance?.id,
        studentUserAgentId,
        questionId: question?.id,
        ...data,
      });
      addSuccessAlert(t('correctionSaved'));
      await afterSaveCorrection();
    } catch (error) {
      console.error(error);
      addErrorAlert(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCorrection = async () => {
    const cleanTeacherFeedback = teacherFeedback || null;

    await onSaveCorrection({
      teacherReviewStatus: questionStatus,
      teacherFeedback: cleanTeacherFeedback,
    });
  };

  return (
    <TotalLayoutStepContainer
      fullWidth
      noMargin
      hasFooter
      clean
      footerPadding={0}
      Footer={
        <TotalLayoutFooterContainer
          showFooterBorder
          scrollRef={scrollRef}
          rightZone={
            <Box sx={{ minWidth: '120px' }}>
              <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  position="left"
                  rounded
                  loading={isLoading}
                  compact
                  onClick={handleSaveCorrection}
                  disabled={!questionStatus}
                >
                  {t('saveCorrection')}
                </Button>
              </Box>
            </Box>
          }
        />
      }
    >
      <Stack direction="column">
        <QuestionTitleComponent
          question={question}
          questionIndex={questionIndex}
          questionResponse={response}
          assignmentConfig={assignmentConfig}
          questionsInfo={questionsInfo}
          viewMode
        />
        <Stack className={classes.container} direction="column">
          <Stack spacing={2} direction="column">
            <Text role="productive" color="primary" strong>
              {t('answer')}
            </Text>
            <Text>{userAnswer}</Text>
          </Stack>

          {!studentSkipped && (
            <Stack direction="column" spacing={2} sx={{ marginBottom: !showFeedbackSection && 16 }}>
              <Text role="productive" color="primary" strong>
                {t('gradeAndFeedback')}
              </Text>
              <RadioGroup data={radioData} onChange={setQuestionStatus} />

              {showFeedbackSection && (
                <TextEditorInput
                  toolbars={TEXT_EDITOR_TEXTAREA_TOOLBARS}
                  value={teacherFeedback}
                  onChange={setTeacherFeedback}
                  placeholder={t('feedbackPlaceholder')}
                  editorStyles={{ minHeight: 80 }}
                />
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </TotalLayoutStepContainer>
  );
}

TeacherReview.propTypes = {
  response: PropTypes.object,
  questionIndex: PropTypes.number,
  scrollRef: PropTypes.object,
  question: PropTypes.object,
  assignmentConfig: PropTypes.object,
  questionsInfo: PropTypes.object,
  studentUserAgentId: PropTypes.string,
  instance: PropTypes.object,
  afterSaveCorrection: PropTypes.func,
};
