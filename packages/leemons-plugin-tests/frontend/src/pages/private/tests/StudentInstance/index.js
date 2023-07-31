import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
import getClassData from '@assignables/helpers/getClassData';
import getNextActivityUrl from '@assignables/helpers/getNextActivityUrl';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import {
  Box,
  Button,
  Modal,
  Paragraph,
  Stack,
  Text,
  VerticalStepper,
} from '@bubbles-ui/components';
import { ChevronRightIcon, ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import { ActivityContainer } from '@bubbles-ui/leemons';
import { useLocale, useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { getCentersWithToken } from '@users/session';
import dayjs from 'dayjs';
import { forEach, intersectionBy, isString } from 'lodash';
import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
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
import Resume from './components/Resume';
import { calculeInfoValues } from './helpers/calculeInfoValues';
import { getConfigByInstance } from './helpers/getConfigByInstance';
import { getIfCurriculumSubjectsHaveValues } from './helpers/getIfCurriculumSubjectsHaveValues';

function StudentInstance() {
  const locale = useLocale();
  const [t, translations] = useTranslateLoader(prefixPN('studentInstance'));
  const [store, render] = useStore({
    loading: true,
    idLoaded: '',
    isFirstStep: true,
    currentStep: 0,
    maxNavigatedStep: 0,
    viewMode: false,
    modalMode: 1,
  });

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
    const { timestamps } = await setInstanceTimestampRequest(params.id, 'start', getUserId());
    store.timestamps = timestamps;
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
    if (store.viewMode) {
      history.push(`/private/tests/result/${params.id}/${getUserId()}`);
    } else {
      store.showFinishModal = true;
      const { timestamps } = await setInstanceTimestampRequest(params.id, 'end', getUserId());
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
          setInstanceTimestampRequest(params.id, 'open', getUserId()),
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
    const { timestamps } = await setInstanceTimestampRequest(params.id, 'end', getUserId());
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
      await setQuestionResponseRequest({
        instance: store.instance.id,
        question,
        ...store.questionResponses[question],
      });
    } catch (error) {
      addErrorAlert(error);
    }
  }

  React.useEffect(() => {
    if (store.timeout) clearTimeout(store.timeout);
    if (
      !store.showForceFinishModal &&
      !store.viewMode &&
      store.instance &&
      store.instance.duration &&
      store.timestamps.start
    ) {
      const [value, unit] = store.instance.duration.split(' ');
      const now = new Date();
      const endDate = new Date(store.timestamps.start);
      endDate.setSeconds(endDate.getSeconds() + dayjs.duration({ [unit]: value }).asSeconds());
      const diff = endDate.getTime() - now.getTime();
      if (diff > 0) {
        store.timeout = setTimeout(() => {
          forceFinishTest();
        }, diff);
      } else {
        forceFinishTest();
      }
    }
  }, [store.timestamps, store.instance]);

  React.useEffect(() => {
    if (params?.id && translations && store.idLoaded !== params?.id) init();
  }, [params, translations]);

  const taskHeaderProps = React.useMemo(() => {
    if (store.instance) {
      return {
        title: store.instance.assignable.asset.name,
        subtitle: store.class.name,
        icon: store.class.icon,
        color: store.class.color,
        image: store.instance.assignable.asset.cover
          ? getFileUrl(
              isString(store.instance.assignable.asset.cover)
                ? store.instance.assignable.asset.cover
                : store.instance.assignable.asset.cover.id
            )
          : null,
        /*
        styles: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: store.isFirstStep && '50%',
          borderRadius: store.isFirstStep ? '16px 16px 0 0' : 0,
          backgroundColor: store.isFirstStep ? COLORS.uiBackground01 : COLORS.uiBackground02,
        },
        */
      };
    }
    return {};
  }, [store.instance, store.class, store.isFirstStep]);

  const verticalStepperProps = React.useMemo(() => {
    if (store.instance) {
      const commonProps = { styles, classes, t, store, render, cx, prevStep, nextStep, goToStep };
      const steps = [];

      const curriculumValues = getIfCurriculumSubjectsHaveValues(
        intersectionBy(store.instance.assignable.subjects, store.instance.subjects, 'subject')
      );
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

  const goToResults = (e, openInNewTab = false) => {
    if (openInNewTab)
      window.open(`/private/tests/result/${params?.id}/${getUserId()}`, '_blank', 'noopener');
    else history.push(`/private/tests/result/${params?.id}/${getUserId()}`);
  };

  return (
    <ActivityContainer
      collapsed={!store.isFirstStep}
      header={taskHeaderProps}
      deadline={
        store.instance.dates.deadline
          ? { label: t('delivery'), locale, deadline: new Date(store.instance.dates.deadline) }
          : null
      }
    >
      <>
        <Box className={classes.mainContent}>
          <Box className={classes.verticalStepper}>
            <Box className={classes.verticalStepperContent}>
              <VerticalStepper
                {...verticalStepperProps}
                currentStep={store.currentStep}
                onChangeActiveIndex={(e) => {
                  store.currentStep = e;
                  render();
                }}
              />
            </Box>
          </Box>
          <Box className={classes.pages}>
            <Box className={classes.pagesContent}>
              {verticalStepperProps.data[store.currentStep]
                ? React.cloneElement(verticalStepperProps.data[store.currentStep].component, {
                    isFirstStep: !store.currentStep,
                  })
                : null}
            </Box>
          </Box>
        </Box>
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
              <Stack justifyContent="space-between">
                {store.isModule ? (
                  <Button variant="light" compact onClick={goToModuleDashboard}>
                    {t('modulesDashboard')}
                  </Button>
                ) : (
                  <Button variant="light" compact onClick={goToOnGoing}>
                    {t('pendingActivities')}
                  </Button>
                )}
                <Button compact onClick={goToResults}>
                  {t('viewResults')}
                </Button>
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
    </ActivityContainer>
  );
}

export default function StudentInstanceContainer() {
  const { id, user } = useParams();

  return <StudentInstance key={`studentInstance.${id}.user.${user}`} />;
}
