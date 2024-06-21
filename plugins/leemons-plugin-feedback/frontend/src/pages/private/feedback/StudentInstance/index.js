import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  LoadingOverlay,
  VerticalStepperContainer,
  TotalLayoutContainer,
} from '@bubbles-ui/components';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert } from '@layout/alert';
import { useStore } from '@common';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import { getCentersWithToken } from '@users/session';
import { getFeedbackRequest, getUserAssignableResponsesRequest } from '@feedback/request';
import getNextActivityUrl from '@assignables/helpers/getNextActivityUrl';
import ActivityHeader from '@assignables/components/ActivityHeader';

import { setInstanceTimestamp } from '@feedback/request/feedback';
import prefixPN from '@feedback/helpers/prefixPN';
import IntroductionStep from './components/IntroductionStep';
import QuestionsStep from './components/QuestionsStep';

const StudentInstance = () => {
  const [t] = useTranslateLoader(prefixPN('studentInstance'));
  const [showIntroduction, setShowIntroduction] = useState(true);
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

  const advanceToQuestions = () => {
    setInstanceTimestamp(params.id, 'start', getUserId());
    setShowIntroduction(false);
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
        currentStep={showIntroduction ? 0 : 1}
        data={[
          { label: t('feedbackIntroductoryText'), status: 'OK' },
          { label: t('questions'), status: 'OK' },
        ]}
      >
        {showIntroduction ? (
          <IntroductionStep
            feedback={store.feedback}
            t={t}
            onNext={advanceToQuestions}
            scrollRef={scrollRef}
          />
        ) : (
          <QuestionsStep
            setShowIntroduction={setShowIntroduction}
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
