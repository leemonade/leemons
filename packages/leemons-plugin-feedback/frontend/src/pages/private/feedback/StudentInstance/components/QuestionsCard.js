import { Box, Button, createStyles, Modal, Paragraph, Stack, Text } from '@bubbles-ui/components';
import { ArrowLeftIcon, ChevronRightIcon, ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import prefixPN from '@feedback/helpers/prefixPN';
import HeaderProgressBar from '@feedback/pages/private/feedback/StudentInstance/components/questions/HeaderProgressBar';
import QuestionTitle from '@feedback/pages/private/feedback/StudentInstance/components/questions/QuestionTitle';
import SelectResponseQuestion from '@feedback/pages/private/feedback/StudentInstance/components/questions/SelectResponseQuestion';
import { setQuestionResponseRequest } from '@feedback/request';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';
import React from 'react';

import { setInstanceTimestamp } from '@feedback/request/feedback';
import { Link, useHistory } from 'react-router-dom';
import LikertResponse from './LikertResponse';
import NetPromoterScoreResponse from './NetPromoterScoreResponse';
import OpenResponse from './OpenResponse';

export const Styles = createStyles((theme, { viewMode }) => ({
  container: {
    maxWidth: viewMode ? '100%' : 768,
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

function QuestionsCard({
  viewMode,
  returnToTable,
  feedback,
  instance,
  instanceId,
  defaultValues,
  userId,
  modalMode,
  nextActivityUrl,
}) {
  const { classes } = Styles({ viewMode });
  const [t, translations] = useTranslateLoader(prefixPN('feedbackResponseQuestion'));
  const [store, render] = useStore({
    maxIndex: 0,
    currentIndex: 0,
    values: defaultValues || {},
  });

  const moduleId = instance?.metadata?.module?.id;
  const isModule = !!moduleId;
  const moduleDashboardUrl = `/private/learning-paths/modules/dashboard/${moduleId}`;

  const question = feedback.questions[store.currentIndex];

  const history = useHistory();

  const isLast = React.useMemo(
    () => feedback.questions.length - 1 === store.currentIndex,
    [feedback, store.currentIndex]
  );

  const goToOnGoing = (e, openInNewTab = false) => {
    if (openInNewTab) window.open('/private/assignables/ongoing', 'AssignablesOngoing', 'noopener');
    history.push('/private/assignables/ongoing');
  };

  const gotToModuleDashboard = (e, openInNewTab = false) => {
    if (openInNewTab) window.open(moduleDashboardUrl, 'Dashboard', 'noopener');
    history.push(moduleDashboardUrl);
  };

  const goToResults = (e, openInNewTab = false) => {
    if (openInNewTab)
      window.open(`/private/feedback/result/${instanceId}`, 'FeedbackResult', 'noopener');
    if (!viewMode) history.push(`/private/feedback/result/${instanceId}`);
  };

  async function onNext(value) {
    store.values[question.id] = value;
    if (!viewMode) setQuestionResponseRequest(question.id, instanceId, value);

    if (!isLast) {
      store.currentIndex++;
      if (store.currentIndex > store.maxIndex) {
        store.maxIndex = store.currentIndex;
      }
    } else {
      if (!viewMode) setInstanceTimestamp(instanceId, 'end', userId);
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
        {viewMode ? (
          <Box>
            <Button
              onClick={returnToTable}
              variant="link"
              leftIcon={<ArrowLeftIcon />}
              color="secondary"
            >
              {t('returnToTable')}
            </Button>
          </Box>
        ) : (
          <Box className={classes.headerText}>
            <Text size="sm" stronger>
              {t('nQuestion', { n: store.currentIndex + 1 })}
            </Text>
            &nbsp;
            {question.required ? <Text role="productive">{t('questionRequired')}</Text> : null}
          </Box>
        )}

        <HeaderProgressBar current={store.maxIndex} max={feedback.questions.length} />
      </Box>
      {question ? (
        <Box className={classes.questionCard}>
          <QuestionTitle
            t={t}
            viewMode={viewMode}
            currentValue={store.currentValue}
            question={question}
          />
          <Box className={classes.questionContainer}>
            {React.cloneElement(questionsByType[question.type], {
              question,
              feedback,
              currentIndex: store.currentIndex,
              onNext,
              onPrev,
              viewMode,
              defaultValue: store.values[question.id],
              setCurrentValue: (e) => {
                store.currentValue = e;
                render();
              },
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
          {modalMode === 0 ? (
            <Stack justifyContent="center">
              {isModule ? (
                <Button onClick={gotToModuleDashboard}>{t('moduleDashboard')}</Button>
              ) : (
                <Button onClick={goToOnGoing}>{t('pendingActivities')}</Button>
              )}
            </Stack>
          ) : null}
          {modalMode === 1 ? (
            <Stack justifyContent="space-between">
              {isModule ? (
                <Button variant="light" onClick={gotToModuleDashboard}>
                  {t('moduleDashboard')}
                </Button>
              ) : (
                <Button variant="light" onClick={goToOnGoing}>
                  {t('pendingActivities')}
                </Button>
              )}
              <Button onClick={goToResults}>{t('viewResults')}</Button>
            </Stack>
          ) : null}
          {modalMode === 2 ? (
            <Stack justifyContent="space-between">
              <Button
                variant="light"
                rightIcon={<ExpandDiagonalIcon />}
                compact
                onClick={() => goToResults(null, true)}
              >
                {t('viewResults')}
              </Button>
              <Link to={nextActivityUrl}>
                <Button rightIcon={<ChevronRightIcon />} compact>
                  {t('nextActivity')}
                </Button>
              </Link>
            </Stack>
          ) : null}
          {modalMode === 3 ? (
            <Stack justifyContent="space-between">
              {isModule ? (
                <Button
                  variant="light"
                  rightIcon={<ExpandDiagonalIcon />}
                  compact
                  onClick={() => gotToModuleDashboard(null, true)}
                >
                  {t('moduleDashboard')}
                </Button>
              ) : (
                <Button
                  variant="light"
                  rightIcon={<ExpandDiagonalIcon />}
                  compact
                  onClick={() => goToOnGoing(null, true)}
                >
                  {t('pendingActivities')}
                </Button>
              )}
              <Link to={nextActivityUrl}>
                <Button rightIcon={<ChevronRightIcon />} compact>
                  {t('nextActivity')}
                </Button>
              </Link>
            </Stack>
          ) : null}
        </Stack>
      </Modal>
    </Box>
  );
}

QuestionsCard.propTypes = {
  feedback: PropTypes.any,
  instance: PropTypes.any,
  instanceId: PropTypes.string,
  defaultValues: PropTypes.any,
  userId: PropTypes.string,
  viewMode: PropTypes.bool,
  returnToTable: PropTypes.func,
  modalMode: PropTypes.number,
  nextActivityUrl: PropTypes.any,
};

export default QuestionsCard;
