import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { addErrorAlert } from '@layout/alert';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
import { forEach, isString } from 'lodash';
import {
  Box,
  Button,
  COLORS,
  Modal,
  Stack,
  Text,
  VerticalStepper,
  Paragraph,
} from '@bubbles-ui/components';
import { HeaderBackground, TaskDeadline, TaskHeader } from '@bubbles-ui/leemons';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import getClassData from '@assignables/helpers/getClassData';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import { getCentersWithToken } from '@users/session';
import dayjs from 'dayjs';
import { StudentInstanceStyles } from './StudentInstance.style';
import Resume from './components/Resume';
import { getIfCurriculumSubjectsHaveValues } from './helpers/getIfCurriculumSubjectsHaveValues';
import Development from './components/Development';
import { TestStyles } from './TestStyles.style';
import {
  getQuestionByIdsRequest,
  getUserQuestionResponsesRequest,
  setInstanceTimestampRequest,
  setQuestionResponseRequest,
} from '../../../../request';
import { calculeInfoValues } from './helpers/calculeInfoValues';
import QuestionList from './components/QuestionList';

export default function StudentInstance() {
  const [t, translations] = useTranslateLoader(prefixPN('studentInstance'));
  const [store, render] = useStore({
    loading: true,
    idLoaded: '',
    isFirstStep: true,
    currentStep: 0,
    maxNavigatedStep: 0,
    viewMode: false,
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

  function closeFinishModal() {
    store.showFinishModal = false;
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
          getProgramEvaluationSystemRequest(store.instance.assignable.subjects[0].program),
          getClassData(store.instance.classes, { multiSubject: t('multiSubject') }),
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
      store.timestamps = timestamps;
      store.questionsInfo = calculeInfoValues(
        questions.length,
        evaluationSystem.maxScale.number,
        evaluationSystem.minScale.number,
        evaluationSystem.minScaleToPromote.number
      );
      store.questions = questions;
      store.evaluationSystem = evaluationSystem;
      store.class = classe;
      store.idLoaded = params.id;
      store.loading = false;

      render();
    } catch (error) {
      console.log(error);
      addErrorAlert(error);
    }
  }

  async function finishTest() {
    store.showFinishModal = false;
    const { timestamps } = await setInstanceTimestampRequest(params.id, 'end', getUserId());
    store.timestamps = timestamps;

    /*
    store.loading = true;
    store.idLoaded = '';
    store.isFirstStep = true;
    store.currentStep = 0;
    store.maxNavigatedStep = 0;
    store.viewMode = false;
    render();
    init();
     */

    history.push(`/private/tests/result/${params.id}/${getUserId()}`);
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

  const headerProps = React.useMemo(() => {
    if (store.instance) {
      if (store.instance.assignable.asset.cover) {
        return {
          blur: 10,
          withBlur: true,
          image: getFileUrl(
            isString(store.instance.assignable.asset.cover)
              ? store.instance.assignable.asset.cover
              : store.instance.assignable.asset.cover.id
          ),
          backgroundPosition: 'center',
        };
      }
      return {
        withBlur: false,
        withGradient: false,
        color: store.instance.assignable.asset.color,
      };
    }
    return {};
  }, [store.instance]);

  const taskHeaderProps = React.useMemo(() => {
    if (store.instance) {
      return {
        title: store.instance.assignable.asset.name,
        subtitle: store.class.name,
        icon: store.class.icon,
        color: store.class.color,
        styles: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: store.isFirstStep && '50%',
          borderRadius: store.isFirstStep ? '16px 16px 0 0' : 0,
          backgroundColor: store.isFirstStep ? COLORS.uiBackground01 : COLORS.uiBackground02,
        },
      };
    }
    return {};
  }, [store.instance, store.class, store.isFirstStep]);

  const taskDeadlineProps = React.useMemo(() => {
    if (store.instance && store.instance.dates.deadline) {
      return {
        label: t('delivery'),
        deadline: new Date(store.instance.dates.deadline),
        styles: {
          position: 'absolute',
          top: 8,
          right: store.isFirstStep ? 8 : 0,
        },
      };
    }
    return null;
  }, [store.instance, store.isFirstStep]);

  const verticalStepperProps = React.useMemo(() => {
    if (store.instance) {
      const commonProps = { classes, t, store, render, cx, prevStep, nextStep, goToStep };
      const steps = [];
      const curriculumValues = getIfCurriculumSubjectsHaveValues(
        store.instance.assignable.subjects
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
      /*
      if (store.instance?.assignable?.statement) {
        steps.push({
          label: t('statement'),
          status: 'OK',
          component: <Statement {...commonProps} />,
        });
      }
      */
      const testProps = { styles, onStartQuestions };

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

      forEach(store.questions, (question, index) => {
        const isLast = index === store.questions.length - 1;
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

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <HeaderBackground
          styles={{
            position: 'absolute',
            zIndex: -1,
          }}
          {...headerProps}
        />
        <TaskHeader {...taskHeaderProps} size={store.isFirstStep ? 'md' : 'sm'} />
        {!store.viewMode && taskDeadlineProps ? (
          <TaskDeadline {...taskDeadlineProps} size={store.isFirstStep ? 'md' : 'sm'} />
        ) : null}
      </Box>
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
          {verticalStepperProps.data[store.currentStep]
            ? React.cloneElement(verticalStepperProps.data[store.currentStep].component, {
                isFirstStep: !store.currentStep,
              })
            : null}
        </Box>
      </Box>
      <Modal
        title={t('finishTestModalTitle')}
        opened={store.showFinishModal}
        onClose={closeFinishModal}
      >
        <Box className={styles.howItWorksModalContainer}>
          <Text
            dangerouslySetInnerHTML={{
              __html: t('finishTestModalDescription'),
            }}
          />
        </Box>
        <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
          <Stack fullWidth justifyContent="space-between">
            <Button variant="link" onClick={closeFinishModal}>
              {t('cancelSubmission')}
            </Button>
            <Button onClick={finishTest}>{t('confirmSubmission')}</Button>
          </Stack>
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
    </Box>
  );
}
