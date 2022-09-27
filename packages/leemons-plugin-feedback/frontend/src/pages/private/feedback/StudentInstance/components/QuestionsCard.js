import React from 'react';
import PropTypes from 'prop-types';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import HeaderProgressBar from '@feedback/pages/private/feedback/StudentInstance/components/questions/HeaderProgressBar';
import { Box, createStyles, Text, Modal, Paragraph, Stack, Button } from '@bubbles-ui/components';
import { useStore } from '@common';
import QuestionTitle from '@feedback/pages/private/feedback/StudentInstance/components/questions/QuestionTitle';
import SelectResponseQuestion from '@feedback/pages/private/feedback/StudentInstance/components/questions/SelectResponseQuestion';
import { setQuestionResponseRequest } from '@feedback/request';
import { ExpandDiagonalIcon, ChevronRightIcon } from '@bubbles-ui/icons/outline';
import { useHistory } from 'react-router-dom';
import { setInstanceTimestamp } from '@feedback/request/feedback';
import OpenResponse from './OpenResponse';
import LikertResponse from './LikertResponse';
import NetPromoterScoreResponse from './NetPromoterScoreResponse';

export const Styles = createStyles((theme) => ({
  container: {
    maxWidth: 768,
    width: '100%',
    margin: '0px auto',
    marginTop: 45,
  },
  header: {
    height: 56,
    borderRadius: 4,
    backgroundColor: theme.colors.uiBackground01,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing[5],
    paddingRight: theme.spacing[5],
    marginBottom: theme.spacing[2],
  },
  questionCard: {
    borderRadius: 4,
    backgroundColor: theme.colors.uiBackground01,
  },
  questionContainer: {
    padding: theme.spacing[5],
  },
}));

const questionsByType = {
  singleResponse: <SelectResponseQuestion />,
  multiResponse: <SelectResponseQuestion multi />,
  likertScale: <LikertResponse />,
  netPromoterScore: <NetPromoterScoreResponse />,
  openResponse: <OpenResponse />,
};

function QuestionsCard({ feedback, instanceId, defaultValues, userId }) {
  const { classes } = Styles();
  const [t, translations] = useTranslateLoader(prefixPN('feedbackResponseQuestion'));
  const [store, render] = useStore({
    maxIndex: 0,
    currentIndex: 0,
    values: defaultValues || {},
    modalMode: 1,
  });
  const question = feedback.questions[store.currentIndex];

  const history = useHistory();

  const isLast = React.useMemo(
    () => feedback.questions.length - 1 === store.currentIndex,
    [feedback, store.currentIndex]
  );

  const goToOnGoing = () => {
    history.push('/private/assignables/ongoing');
  };

  async function onNext(value) {
    store.values[question.id] = value;
    setQuestionResponseRequest(question.id, instanceId, value);

    if (!isLast) {
      store.currentIndex++;
      if (store.currentIndex > store.maxIndex) {
        store.maxIndex = store.currentIndex;
      }
    } else {
      setInstanceTimestamp(instanceId, 'end', userId);
      store.showFinishModal = true;
    }

    render();
  }

  function onPrev() {
    store.currentIndex--;
    render();
  }

  if (!translations) return null;

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box className={classes.headerText}>
          <Text size="sm" stronger>
            {t('nQuestion', { n: store.currentIndex + 1 })}
          </Text>
          &nbsp;
          {question.required ? <Text role="productive">{t('questionRequired')}</Text> : null}
        </Box>
        <HeaderProgressBar current={store.maxIndex} max={feedback.questions.length} />
      </Box>
      {question ? (
        <Box className={classes.questionCard}>
          <QuestionTitle question={question} />
          <Box className={classes.questionContainer}>
            {React.cloneElement(questionsByType[question.type], {
              question,
              feedback,
              currentIndex: store.currentIndex,
              onNext,
              onPrev,
              defaultValue: store.values[question.id],
              t,
            })}
          </Box>
        </Box>
      ) : null}
      <Modal
        title={t('finishModal')}
        opened={store.showFinishModal}
        onClose={() => {}}
        centerTitle
        centered
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={false}
        size={480}
      >
        <Stack direction="column" fullWidth spacing={8}>
          <Paragraph align="center">{feedback.thanksMessage}</Paragraph>
          {store.modalMode === 0 ? (
            <Stack justifyContent="space-between">
              <Button variant="light" onClick={goToOnGoing}>
                {t('pendingActivities')}
              </Button>
              <Button>{t('viewResults')}</Button>
            </Stack>
          ) : null}
          {store.modalMode === 1 ? (
            <Stack justifyContent="center">
              <Button onClick={goToOnGoing}>{t('pendingActivities')}</Button>
            </Stack>
          ) : null}
          {store.modalMode === 2 ? (
            <Stack justifyContent="space-between">
              <Button variant="light" rightIcon={<ExpandDiagonalIcon />} compact>
                {t('viewResults')}
              </Button>
              <Button rightIcon={<ChevronRightIcon />} compact>
                {t('nextActivity')}
              </Button>
            </Stack>
          ) : null}
          {store.modalMode === 3 ? (
            <Stack justifyContent="space-between">
              <Button
                variant="light"
                rightIcon={<ExpandDiagonalIcon />}
                compact
                onClick={goToOnGoing}
              >
                {t('pendingActivities')}
              </Button>
              <Button rightIcon={<ChevronRightIcon />} compact>
                {t('nextActivity')}
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </Modal>
    </Box>
  );
}

QuestionsCard.propTypes = {
  feedback: PropTypes.any,
  instanceId: PropTypes.string,
  defaultValues: PropTypes.any,
  userId: PropTypes.string,
};

export default QuestionsCard;
