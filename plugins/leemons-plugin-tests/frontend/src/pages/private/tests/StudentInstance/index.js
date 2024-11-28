import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
import ActivityHeader from '@assignables/components/ActivityHeader';
import {
  ActivityUnavailable,
  useActivityStates,
} from '@assignables/components/ActivityUnavailable';
import getClassData from '@assignables/helpers/getClassData';
import getNextActivityUrl from '@assignables/helpers/getNextActivityUrl';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import { allAssignationsGetKey } from '@assignables/requests/hooks/keys/assignations';
import useAssignations from '@assignables/requests/hooks/queries/useAssignations';
import {
  Box,
  Button,
  Modal,
  Paragraph,
  Stack,
  Text,
  TotalLayoutContainer,
  VerticalStepperContainer,
} from '@bubbles-ui/components';
import { ChevronRightIcon, ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useQueryClient } from '@tanstack/react-query';
import { getCentersWithToken } from '@users/session';
import { forEach, intersectionBy } from 'lodash';

import {
  getQuestionByIdsRequest,
  getUserQuestionResponsesRequest,
  setInstanceTimestampRequest,
  setQuestionResponseRequest,
} from '../../../../request';

import { StudentInstanceStyles } from './StudentInstance.style';
import { TestStyles } from './TestStyles.style';
import Development from './components/Development';
import QuestionList from './components/QuestionList';
import { calculeInfoValues } from './helpers/calculeInfoValues';
import { getConfigByInstance } from './helpers/getConfigByInstance';
import { getIfCurriculumSubjectsHaveValues } from './helpers/getIfCurriculumSubjectsHaveValues';

import prefixPN from '@tests/helpers/prefixPN';

const setInstanceTimestamp = (queryClient) => async (instance, key, user) => {
  const result = await setInstanceTimestampRequest(instance, key, user);

  queryClient.invalidateQueries({
    queryKey: allAssignationsGetKey,
  });
  return result;
};

function StudentInstance() {
  const scrollRef = React.useRef();
  const [t, translations] = useTranslateLoader(prefixPN('studentInstance'));
  const [store, render] = useStore({
    loading: true,
    idLoaded: '',
    isFirstStep: true,
    currentStep: 0,
    maxNavigatedStep: 0,
    viewMode: false,
    modalMode: 1,
    questionResponsesPromises: [],
  });

  const queryClient = useQueryClient();
  const updateTimestamp = setInstanceTimestamp(queryClient);

  const { classes: styles } = TestStyles({}, { name: 'Tests' });
  const { classes, cx } = StudentInstanceStyles(
    { isFirstStep: store.isFirstStep },
    { name: 'TaskDoing' }
  );

  const history = useHistory();
  const params = useParams();

  function getUserId() {
    if (params.user) return params.user;
    return getCentersWithToken()[0].userAgentId;
  }

  async function onStartQuestions() {
    const { timestamps } = await updateTimestamp(params.id, 'start', getUserId());
    store.timestamps = timestamps;
    store.assignation.timestamps = timestamps;
    render();
  }

  function closeForceFinishModal() {
    store.showForceFinishModal = false;
    render();
    history.push(`/private/tests/result/${params.id}/${getUserId()}`);
  }

  function prevStep() {
    store.currentStep -= 1;
    render();
  }

  function nextStep() {
    store.currentStep += 1;
    if (store.currentStep > store.maxNavigatedStep) {
      store.maxNavigatedStep = store.currentStep;
    }
    render();
  }

  async function finishStep() {
    await Promise.allSettled(store.questionResponsesPromises);

    if (store.viewMode) {
      history.push(`/private/tests/result/${params.id}/${getUserId()}`);
    } else {
      // store.showFinishModal = true;
      const { timestamps } = await updateTimestamp(params.id, 'end', getUserId());
      history.push(`/private/tests/result/${params.id}/${getUserId()}?fromTest`);
      store.timestamps = timestamps;
      render();
    }
  }

  async function init() {
    try {
      [store.instance, store.assignation] = await Promise.all([
        getAssignableInstance({ id: params.id }),
        getAssignation({ id: params.id, user: getUserId() }),
      ]);

      const [{ evaluationSystem }, classe, { questions }, { responses }, { timestamps }] =
        await Promise.all([
          getProgramEvaluationSystemRequest(store.instance.subjects[0].program),
          getClassData(store.instance.classes, {
            multiSubject: t('multiSubject'),
            groupName: store.instance?.metadata?.groupName,
          }),
          getQuestionByIdsRequest(store.instance.metadata.questions),
          getUserQuestionResponsesRequest(params.id, getUserId()),
          updateTimestamp(params.id, 'open', getUserId()),
        ]);
      if (store.assignation.finished) store.viewMode = true;
      store.questionResponses = responses;
      store.questionMax = Object.keys(responses).length - 1;
      if (store.questionMax < 0) store.questionMax = 0;
      forEach(questions, ({ id }) => {
        if (!store.questionResponses[id]) {
          store.questionResponses[id] = {
            clues: 0,
          };
        }
      });

      const moduleId = store.instance.metadata?.module?.id;
      store.isModule = !!moduleId;
      store.moduleDashboardUrl = `/private/learning-paths/modules/dashboard/${moduleId}`;

      store.nextActivityUrl = await getNextActivityUrl(store.assignation);
      store.hasNextActivity =
        store.assignation?.instance?.relatedAssignableInstances?.after?.length > 0 &&
        store.nextActivityUrl;
      store.timestamps = timestamps;
      store.config = getConfigByInstance(store.instance);
      store.questionsInfo = calculeInfoValues(
        questions.length,
        evaluationSystem.maxScale.number,
        evaluationSystem.minScale.number,
        evaluationSystem.minScaleToPromote.number,
        store.instance
      );
      store.questions = questions;
      store.evaluationSystem = evaluationSystem;
      store.class = classe;
      store.idLoaded = params.id;
      store.loading = false;
      store.modalMode = store.hasNextActivity ? 2 : 1;

      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  async function forceFinishTest() {
    store.showForceFinishModal = true;
    const { timestamps } = await updateTimestamp(params.id, 'end', getUserId());
    store.timestamps = timestamps;
    render();
  }

  function goToStep(step) {
    if (step <= store.maxNavigatedStep) {
      store.currentStep = step;
      render();
    }
  }

  async function saveQuestion(question) {
    try {
      const promise = setQuestionResponseRequest({
        instance: store.instance.id,
        question,
        ...store.questionResponses[question],
      });

      store.questionResponsesPromises.push(promise);

      return await promise;
    } catch (error) {
      addErrorAlert(error);
    }
  }

  const { data: assignation } = useAssignations({
    query: {
      instance: params.id,
      user: getUserId(),
    },
    fetchInstance: true,
  });

  const { isUnavailable } = useActivityStates({ instance: store.instance, user: getUserId() });

  React.useEffect(() => {
    if (params?.id && translations && store.idLoaded !== params?.id) init();
  }, [params, translations]);

  const verticalStepperProps = React.useMemo(() => {
    if (store.instance) {
      const commonProps = {
        styles,
        classes,
        t,
        store,
        render,
        cx,
        prevStep,
        nextStep,
        goToStep,
        scrollRef,
      };
      const steps = [];

      const curriculumValues = getIfCurriculumSubjectsHaveValues(
        intersectionBy(store.instance.assignable.subjects, store.instance.subjects, 'subject')
      );
      /*
      if (
        // store.instance?.assignable?.asset?.description ||
        store.instance?.assignable?.statement ||
        (store.instance.curriculum.content && curriculumValues.content) ||
        (store.instance.curriculum.objectives && curriculumValues.objectives) ||
        (store.instance.curriculum.assessmentCriteria && curriculumValues.assessmentCriteria)
      ) {
        steps.push({
          label: t('resume'),
          status: 'OK',
          component: <Resume {...commonProps} />,
        });
      }

       */
      const testProps = { onStartQuestions };

      steps.push({
        label: t('development'),
        status: 'OK',
        component: <Development {...commonProps} {...testProps} />,
      });

      steps.push({
        label: t('questions'),
        status: 'OK',
        component: (
          <QuestionList
            {...commonProps}
            {...testProps}
            nextStep={nextStep}
            finishStep={finishStep}
            saveQuestion={saveQuestion}
          />
        ),
        isQuestion: true,
        isBlocked: isUnavailable,
      });

      return {
        data: steps,
      };
    }
    return {};
  }, [store.instance, translations]);

  React.useEffect(() => {
    if (verticalStepperProps.data) {
      store.isFirstStep = !verticalStepperProps.data[store.currentStep].isQuestion;
      render();
    }
  }, [store.currentStep, verticalStepperProps]);

  if (store.loading) {
    return null;
  }

  const goToOnGoing = () => {
    history.push('/private/assignables/ongoing');
  };

  const goToModuleDashboard = () => {
    history.push(store.moduleDashboardUrl);
  };

  const goToResults = (e, openInNewTab = false, fromTimeout = false) => {
    if (openInNewTab)
      window.open(
        `/private/tests/result/${params?.id}/${getUserId()}${fromTimeout ? '?fromTimeout' : ''}`,
        '_blank',
        'noopener'
      );
    else
      history.push(
        `/private/tests/result/${params?.id}/${getUserId()}${fromTimeout ? '?fromTimeout' : ''}`
      );
  };

  return (
    <>
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <ActivityHeader
            instance={assignation?.instance}
            assignation={assignation}
            showClass
            showRole
            showEvaluationType
            showCountdown
            showDeadline
            onTimeout={() => goToResults(null, false, true)}
          />
        }
      >
        <VerticalStepperContainer
          {...verticalStepperProps}
          currentStep={store.currentStep}
          onChangeActiveIndex={(e) => {
            store.currentStep = e;
            render();
          }}
          scrollRef={scrollRef}
        >
          <Stack fullHeight>
            {isUnavailable ? (
              <ActivityUnavailable instance={store.instance} user={getUserId()} />
            ) : null}
            {!isUnavailable && verticalStepperProps.data[store.currentStep]
              ? React.cloneElement(verticalStepperProps.data[store.currentStep].component, {
                  isFirstStep: !store.currentStep,
                })
              : null}
          </Stack>
        </VerticalStepperContainer>
      </TotalLayoutContainer>
      <Modal
        title={t('finishTestModalTitle')}
        opened={store.showFinishModal}
        onClose={() => {}}
        centerTitle
        centered
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={false}
        size={480}
      >
        <Box className={styles.howItWorksModalContainer}>
          <Text
            dangerouslySetInnerHTML={{
              __html: t('finishTestModalDescription'),
            }}
          />
        </Box>
        <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
          {store.modalMode === 1 ? (
            <Stack fullWidth justifyContent="space-between">
              {store.isModule ? (
                <Box>
                  <Button variant="light" compact onClick={goToModuleDashboard}>
                    {t('modulesDashboard')}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Button variant="light" compact onClick={goToOnGoing}>
                    {t('pendingActivities')}
                  </Button>
                </Box>
              )}
              <Box>
                <Button compact onClick={goToResults}>
                  {t('viewResults')}
                </Button>
              </Box>
            </Stack>
          ) : null}
          {store.modalMode === 2 ? (
            <Stack fullWidth justifyContent="space-between">
              <Button
                variant="light"
                rightIcon={<ExpandDiagonalIcon />}
                compact
                onClick={() => goToResults(null, true)}
              >
                {t('viewResults')}
              </Button>
              <Link to={store.nextActivityUrl}>
                <Button rightIcon={<ChevronRightIcon />} compact>
                  {t('nextActivity')}
                </Button>
              </Link>
            </Stack>
          ) : null}
        </Box>
      </Modal>
      <Modal
        title={t('finishForceTestModalTitle')}
        opened={store.showForceFinishModal}
        onClose={closeForceFinishModal}
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        <Box className={styles.howItWorksModalContainer}>
          <Paragraph
            dangerouslySetInnerHTML={{
              __html: t('finishForceTestModalDescription'),
            }}
          />
        </Box>
        <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
          <Stack fullWidth justifyContent="space-between">
            <Button
              variant="link"
              onClick={() => {
                store.showForceFinishModal = false;
                render();
                history.push(`/private/assignables/ongoing`);
              }}
            >
              {t('activitiesInCourse')}
            </Button>
            <Button
              onClick={() => {
                store.showForceFinishModal = false;
                render();
                history.push(`/private/tests/result/${params.id}/${getUserId()}`);
              }}
            >
              {t('reviewResults')}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

export default function StudentInstanceContainer() {
  const { id, user } = useParams();

  return <StudentInstance key={`studentInstance.${id}.user.${user}`} />;
}
