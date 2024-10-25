import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Box,
  Button,
  createStyles,
  ContextContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import {
  ChevRightIcon,
  ChevLeftIcon,
} from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isNil } from 'lodash';
import PropTypes from 'prop-types';

import LikertResponse from './LikertResponse';
import NetPromoterScoreResponse from './NetPromoterScoreResponse';
import OpenResponse from './OpenResponse';

import prefixPN from '@feedback/helpers/prefixPN';
import SelectResponseQuestion from '@feedback/pages/private/feedback/StudentInstance/components/questions/SelectResponseQuestion';
import { setQuestionResponseRequest } from '@feedback/request';
import { setInstanceTimestamp } from '@feedback/request/feedback';

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

function QuestionsStep({
  viewMode,
  scrollRef,
  feedback,
  instance,
  instanceId,
  defaultValues,
  userId,
  modalMode,
  nextActivityUrl,
  setShowIntroduction,
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
      window.open(
        `/private/feedback/result/${instanceId}?fromExecution`,
        'FeedbackResult',
        'noopener'
      );
    if (!viewMode) history.push(`/private/feedback/result/${instanceId}?fromExecution`);
  };

  async function onNext(value, goTo = 'goToResults') {
    store.values[question.id] = value;
    if (!viewMode) setQuestionResponseRequest(question.id, instanceId, value);

    if (!isLast) {
      store.currentIndex++;
      if (store.currentIndex > store.maxIndex) {
        store.maxIndex = store.currentIndex;
      }
    } else {
      if (!viewMode) setInstanceTimestamp(instanceId, 'end', userId);

      if (instance.showResults) {
        goToResults();
      } else if (isModule) {
        gotToModuleDashboard();
      } else {
        goToOnGoing();
      }
    }

    render();
  }

  function onPrev() {
    if (store.currentIndex === 0) {
      setShowIntroduction(true);
    } else {
      store.currentIndex--;
    }
    render();
  }

  const questionName = useMemo(() => {
    const plainText = question?.question
      ? new DOMParser().parseFromString(question.question, 'text/html').body.textContent
      : '';
    return `${store.currentIndex + 1}. ${plainText}`;
  }, [question, store.currentIndex]);

  const hasValue = React.useMemo(() => {
    if (question?.type === 'multiResponse') {
      return store?.currentValue?.length >= question?.properties?.minResponses;
    }
    if (question?.type === 'likertScale') {
      return !isNil(store.currentValue);
    }
    if (question?.type === 'netPromoterScore') {
      return !isNil(store.currentValue);
    }
    return store.currentValue?.length > 0;
  }, [question, JSON.stringify(store.currentValue)]);

  const nextText = useMemo(() => {
    if (isLast) return t('finish');
    if (question?.required) return t('next');
    if (hasValue) return t('next');
    return t('skip');
  }, [question, hasValue, isLast, t]);

  const disableNext = useMemo(() => question?.required && !hasValue, [question, hasValue]);
  const showModuleFinalDropdown = useMemo(() => isModule && isLast, [isModule, isLast]);

  const footerFinalActionsAndLabels = useMemo(() => {
    const result = [
      {
        label: t('viewResults'),
        onClick: () => onNext(store.currentValue, 'goToResults'),
      },
    ];

    // Modulo no tiene siguiente actividad
    if (modalMode === 1) {
      result.push({
        label: t('moduleDashboard'),
        onClick: () => onNext(store.currentValue, 'goToModuleDashboard'),
      });
    } else if (modalMode === 2) {
      // Modulo tiene siguiente actividad
      result.push({
        label: t('nextActivity'),
        onClick: () => onNext(store.currentValue, 'goToNextActivity'),
      });
    }
    return result;
  }, [t, store.currentValue, nextActivityUrl]);
  if (!translations) return null;

  return (
    <TotalLayoutStepContainer
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={scrollRef}
          leftZone={
            <Button variant="outline" leftIcon={<ChevLeftIcon />} onClick={onPrev}>
              {t('back')}
            </Button>
          }
          rightZone={
            !showModuleFinalDropdown ? (
              <Button
                variant={isLast ? 'filled' : 'outline'}
                rightIcon={!isLast && <ChevRightIcon />}
                onClick={() => onNext(store.currentValue)}
                disabled={disableNext}
              >
                {nextText}
              </Button>
            ) : (
              <Button
                onClick={() => onNext(store.currentValue, 'goToResults')}
                disabled={disableNext}
              >
                {t('finish')}
              </Button>
            )
          }
        />
      }
    >
      {question ? (
        <ContextContainer title={questionName}>
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
        </ContextContainer>
      ) : null}
      {/* Modal is not used anymore, but it's left here for future redirection cases reference (Basic 2.0) */}
      {/* <Modal
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
      </Modal> */}
    </TotalLayoutStepContainer>
  );
}

QuestionsStep.propTypes = {
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

export default QuestionsStep;
