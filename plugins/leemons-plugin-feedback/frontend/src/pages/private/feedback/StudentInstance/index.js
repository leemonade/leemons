import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActivityContainer } from '@assignables/components/ActivityContainer';
import {
  Box,
  COLORS,
  LoadingOverlay,
  Stack,
  Button,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { addErrorAlert } from '@layout/alert';
import {
  setQuestionResponseRequest,
  getFeedbackRequest,
  getUserAssignableResponsesRequest,
} from '@feedback/request';

import { useLocale, useStore } from '@common';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import { getCentersWithToken } from '@users/session';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { isString } from 'lodash';
import QuestionsCard from '@feedback/pages/private/feedback/StudentInstance/components/QuestionsCard';
import { setInstanceTimestamp } from '@feedback/request/feedback';
import getNextActivityUrl from '@assignables/helpers/getNextActivityUrl';
import ActivityHeader from '@assignables/components/ActivityHeader/index';
import { ChevronRightIcon } from '@bubbles-ui/icons/outline';
import { useSurveyStore } from '../../../../hooks/useSurveyStore';
import WelcomeCard from './components/WelcomeCards/WelcomeCard';
import QuestionButtons from './components/questions/QuestionButtons';

const StudentInstance = () => {
  const [t] = useTranslateLoader(prefixPN('studentInstance'));
  const [tFRQ, translations] = useTranslateLoader(prefixPN('feedbackResponseQuestion'));

  const [state, setState] = useSurveyStore({
    loading: true,
    idLoaded: '',
    showingWelcome: true,
    modalMode: 0,
    maxIndex: 0,
    currentIndex: 0,
    responses: {},
  });
  const scrollRef = React.useRef();
  const locale = useLocale();
  const params = useParams();

  const getUserId = () => {
    if (params.user) return params.user;
    return getCentersWithToken()[0].userAgentId;
  };

  const advanceToQuestions = () => {
    setInstanceTimestamp(params.id, 'start', getUserId());
    setState('showingWelcome', false);
  };

  const taskHeaderProps = React.useMemo(() => {
    if (state.instance) {
      return {
        title: state.instance.assignable.asset.name,
        image: state.instance.assignable.asset.cover
          ? getFileUrl(
            isString(state.instance.assignable.asset.cover)
              ? state.instance.assignable.asset.cover
              : state.instance.assignable.asset.cover.id
          )
          : null,
      };
    }
    return {};
  }, [state.instance, state.class, state.isFirstStep]);

  const getModalMode = (showResults, hasNextActivity) => {
    if (!showResults && !hasNextActivity) return 0;
    if (showResults && !hasNextActivity) return 1;
    if (showResults && hasNextActivity) return 2;
    if (!showResults && hasNextActivity) return 3;
    return 0;
  };

  const init = async () => {
    try {
      [state.instance, state.assignation, state.responses] = await Promise.all([
        getAssignableInstance({ id: params.id }),
        getAssignation({ id: params.id, user: getUserId() }),
        getUserAssignableResponsesRequest(params.id),
        setInstanceTimestamp(params.id, 'open', getUserId()),
      ]);

      let canStart = true;
      if (state.instance.dates?.start) {
        const now = new Date();
        const start = new Date(state.instance.dates.start);
        if (now < start) {
          canStart = false;
        }
      }

      const showResults = !!state.instance.showResults;

      const storeNextActivityUrl = await getNextActivityUrl(state.assignation);
      setState('nextActivityUrl', storeNextActivityUrl);

      // store.nextActivityUrl = await getNextActivityUrl(store.assignation);
      const hasNextActivity =
        state.assignation?.instance?.relatedAssignableInstances?.after?.length > 0 &&
        state.nextActivityUrl;
      const storeModalMode = getModalMode(showResults, hasNextActivity);
      setState('showingWelcome', storeModalMode);
      // store.modalMode = getModalMode(showResults, hasNextActivity);
      setState('canStart', canStart);
      // store.canStart = canStart;
      const storeFeedback = (await getFeedbackRequest(state.instance.assignable.id)).feedback;
      setState('feedback', storeFeedback);
      // store.feedback = (await getFeedbackRequest(store.instance.assignable.id)).feedback;
      setState('idLoaded', params?.id);
      // store.idLoaded = params.id;
      setState('loading', false);
      // store.loading = false;
    } catch (error) {
      addErrorAlert(error);
    }
  };

  useEffect(() => {
    if (params?.id && state.idLoaded !== params?.id) {
      init();
    }
  }, [params]);

  if (state.loading) {
    return <LoadingOverlay visible />;
  }
  if (!translations) return null;

  const isLast = state.feedback.questions.length - 1 === state.currentIndex;
  const question = state.feedback.questions[state.currentIndex];
  async function onNext(value) {
    setState('responses', { ...state.responses, [question.id]: value });
    // TODO: Fix this call to setQuestionResponseRequest  if "Assignation Finished"
    setQuestionResponseRequest(question.id, state.idLoaded, value);

    if (!isLast) {
      setState('currentIndex', state.currentIndex + 1);
      if (state.currentIndex > state.maxIndex) {
        setState('maxIndex', state.currentIndex);
      }
    } else {
      setInstanceTimestamp(state.instanceId, 'end', state.userId);
      setState('showFinishModal', true);
    }
  }

  function onPrev() {
    setState('currentIndex', state.currentIndex - 1);
  }

  const WelcomeFooterComponent = (
    <Stack fullWidth justifyContent="flex-end">
      <Button compact rounded rightIcon={<ChevronRightIcon />} onClick={advanceToQuestions}>
        {t('startQuestions')}
      </Button>
    </Stack>
  );
  const QuestionFooterComponent = (
    <QuestionButtons
      t={tFRQ}
      feedback={state.feedback}
      question={question}
      value={state.currentValue}
      currentIndex={state.currentIndex}
      onNext={onNext}
      onPrev={onPrev}
    />
  );

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <ActivityHeader
          instance={state.instance}
          showClass
          showRole
          showEvaluationType
          showTime
          showDeadline
        />
      }
    >
      <Stack justifyContent="center" ref={scrollRef} style={{ overflow: 'auto' }}>
        <TotalLayoutStepContainer
          Footer={
            <TotalLayoutFooterContainer
              scrollRef={scrollRef}
              // rightZone={state.showingWelcome ? WelcomeFooterComponent : QuestionFooterComponent}
              fixed
            >
              {state.showingWelcome ? WelcomeFooterComponent : QuestionFooterComponent}
            </TotalLayoutFooterContainer>
          }
        >
          {state.showingWelcome ? (
            <WelcomeCard feedback={state.feedback} t={t} />
          ) : (
            <QuestionsCard
              feedback={state.feedback}
              instance={state.instance}
              instanceId={state.idLoaded}
              defaultValues={state.responses}
              userId={getUserId()}
              modalMode={state.modalMode}
              nextActivityUrl={state.nextActivityUrl}
              setState={setState}
              state={state}
              onNext={onNext}
              onPrev={onPrev}
            />
          )}
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
    // <Box style={{ height: '100vh', backgroundColor: COLORS.ui02 }}>
    //   <ActivityContainer
    //     header={taskHeaderProps}
    //     deadline={
    //       store.instance.dates.deadline
    //         ? { label: t('delivery'), locale, deadline: new Date(store.instance.dates.deadline) }
    //         : null
    //     }
    //     collapsed
    //   >
    //     <Stack fullWidth justifyContent="center">
    //       {store.showingWelcome ? (
    //         <WelcomeCard
    //           feedback={store.feedback}
    //           t={t}
    //           onNext={advanceToQuestions}
    //           canStart={store.canStart}
    //         />
    //       ) : (
    //         <QuestionsCard
    //           feedback={store.feedback}
    //           instance={store.instance}
    //           instanceId={store.idLoaded}
    //           defaultValues={store.responses}
    //           userId={getUserId()}
    //           modalMode={store.modalMode}
    //           nextActivityUrl={store.nextActivityUrl}
    //         />
    //       )}
    //     </Stack>
    //   </ActivityContainer>
    // </Box>
  );
};

export default function StudentInstanceContainer() {
  const { id, user } = useParams();

  return <StudentInstance key={`studentInstance.${id}.user.${user}`} />;
}
