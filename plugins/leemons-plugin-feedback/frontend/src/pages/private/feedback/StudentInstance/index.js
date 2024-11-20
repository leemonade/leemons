import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import ActivityHeader from '@assignables/components/ActivityHeader';
import {
  ActivityUnavailable,
  useActivityStates,
} from '@assignables/components/ActivityUnavailable';
import getNextActivityUrl from '@assignables/helpers/getNextActivityUrl';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import {
  LoadingOverlay,
  VerticalStepperContainer,
  TotalLayoutContainer,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getCentersWithToken } from '@users/session';

import IntroductionStep from './components/IntroductionStep';
import QuestionsStep from './components/QuestionsStep';

import prefixPN from '@feedback/helpers/prefixPN';
import { getFeedbackRequest, getUserAssignableResponsesRequest } from '@feedback/request';
import { setInstanceTimestamp } from '@feedback/request/feedback';

const STEPS = {
  INTRODUCTION: 'introduction',
  QUESTIONS: 'questions',
};

const STEPS_INDEX = {
  [STEPS.INTRODUCTION]: 0,
  [STEPS.QUESTIONS]: 1,
};

const StudentInstance = () => {
  const [t] = useTranslateLoader(prefixPN('studentInstance'));
  const [step, setStep] = useState(STEPS.INTRODUCTION);
  const [store, render] = useStore({
    loading: true,
    idLoaded: '',
    showingWelcome: true,
    modalMode: 0,
  });

  const params = useParams();
  const scrollRef = useRef();

  const getUserId = () => {
    if (params.user) return params.user;
    return getCentersWithToken()[0].userAgentId;
  };

  const { isUnavailable } = useActivityStates({
    instance: store.instance,
    user: getUserId(),
  });

  const advanceToQuestions = () => {
    setInstanceTimestamp(params.id, 'start', getUserId());
    setStep(STEPS.QUESTIONS);
  };

  const getModalMode = (showResults, hasNextActivity) => {
    if (!showResults && !hasNextActivity) return 0;
    if (showResults && !hasNextActivity) return 1;
    if (showResults && hasNextActivity) return 2;
    if (!showResults && hasNextActivity) return 3;
    return 0;
  };

  const init = async () => {
    try {
      [store.instance, store.assignation, store.responses] = await Promise.all([
        getAssignableInstance({ id: params.id }),
        getAssignation({ id: params.id, user: getUserId() }),
        getUserAssignableResponsesRequest(params.id),
        setInstanceTimestamp(params.id, 'open', getUserId()),
      ]);

      let canStart = true;
      if (store.instance.dates?.start) {
        const now = new Date();
        const start = new Date(store.instance.dates.start);
        if (now < start) {
          canStart = false;
        }
      }

      const showResults = !!store.instance.showResults;

      store.nextActivityUrl = await getNextActivityUrl(store.assignation);
      const hasNextActivity =
        store.assignation?.instance?.relatedAssignableInstances?.after?.length > 0 &&
        store.nextActivityUrl;
      store.modalMode = getModalMode(showResults, hasNextActivity);

      store.canStart = canStart;
      store.feedback = (await getFeedbackRequest(store.instance.assignable.id)).feedback;
      store.idLoaded = params.id;
      store.loading = false;

      render();
    } catch (error) {
      addErrorAlert(error);
    }
  };

  useEffect(() => {
    if (params?.id && store.idLoaded !== params?.id) {
      init();
    }
  }, [params]);

  if (store.loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <ActivityHeader
          assignation={store?.assignation}
          instance={store?.instance}
          showClass
          showDeadline
          showEvaluationType
          showRole
          showCountdown
        />
      }
    >
      <VerticalStepperContainer
        scrollRef={scrollRef}
        currentStep={STEPS_INDEX[step]}
        data={[
          { label: t('feedbackIntroductoryText'), status: 'OK' },
          { label: t('questions'), status: 'OK', isBlocked: isUnavailable },
        ]}
      >
        {isUnavailable && (
          <ActivityUnavailable instance={store.instance} user={getUserId()} scrollRef={scrollRef} />
        )}
        {!isUnavailable && step === STEPS.INTRODUCTION && (
          <IntroductionStep
            feedback={store.feedback}
            instance={store.instance}
            t={t}
            onNext={advanceToQuestions}
            scrollRef={scrollRef}
          />
        )}
        {!isUnavailable && step === STEPS.QUESTIONS && (
          <QuestionsStep
            setShowIntroduction={() => setStep(STEPS.INTRODUCTION)}
            feedback={store.feedback}
            instance={store.instance}
            instanceId={store.idLoaded}
            defaultValues={store.responses}
            userId={getUserId()}
            modalMode={store.modalMode}
            nextActivityUrl={store.nextActivityUrl}
          />
        )}
      </VerticalStepperContainer>
    </TotalLayoutContainer>
  );
};

export default function StudentInstanceContainer() {
  const { id, user } = useParams();

  return <StudentInstance key={`studentInstance.${id}.user.${user}`} />;
}
