import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import { useParams } from 'react-router-dom';
import { addErrorAlert } from '@layout/alert';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
import { isString } from 'lodash';
import { Box, COLORS, VerticalStepper } from '@bubbles-ui/components';
import { HeaderBackground, TaskDeadline, TaskHeader } from '@bubbles-ui/leemons';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import getClassData from '@assignables/helpers/getClassData';
import { StudentInstanceStyles } from './StudentInstance.style';
import Resume from './components/Resume';
import { getIfCurriculumSubjectsHaveValues } from './helpers/getIfCurriculumSubjectsHaveValues';
import Statement from './components/Statement';
import Development from './components/Development';
import { TestStyles } from './TestStyles.style';
import { getQuestionByIdsRequest } from '../../../../request';
import { calculeInfoValues } from './helpers/calculeInfoValues';

export default function StudentInstance() {
  const [t, translations] = useTranslateLoader(prefixPN('studentInstance'));
  const [store, render] = useStore({
    loading: true,
    isFirstStep: true,
    currentStep: 1,
    maxNavigatedStep: 1,
  });

  const { classes: styles } = TestStyles({}, { name: 'Tests' });
  const { classes, cx } = StudentInstanceStyles(
    { isFirstStep: store.isFirstStep },
    { name: 'TaskDoing' }
  );

  const params = useParams();

  async function onStartQuestions() {
    // TODO LLamar a asignables seteando la hora de inicio del test
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

  function goToStep(step) {
    if (step <= store.maxNavigatedStep) {
      store.currentStep = step;
      render();
    }
  }

  async function init() {
    try {
      store.instance = await getAssignableInstance({ id: params.id });
      const [{ evaluationSystem }, classe, { questions }] = await Promise.all([
        getProgramEvaluationSystemRequest(store.instance.assignable.subjects[0].program),
        getClassData(store.instance.classes, { multiSubject: t('multiSubject') }),
        getQuestionByIdsRequest(store.instance.metadata.questions),
      ]);
      store.questionsInfo = calculeInfoValues(
        questions.length,
        evaluationSystem.maxScale.number,
        evaluationSystem.minScaleToPromote.number
      );
      store.questions = questions;
      store.evaluationSystem = evaluationSystem;
      store.class = classe;

      store.loading = false;
      render();
    } catch (error) {
      console.log(error);
      addErrorAlert(error);
    }
  }

  React.useEffect(() => {
    if (params?.id && translations) init();
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
          backgroundColor: store.isFirstStep ? COLORS.mainWhite : COLORS.interactive03,
        },
      };
    }
    return {};
  }, [store.instance, store.class, store.isFirstStep]);

  const taskDeadlineProps = React.useMemo(() => {
    if (store.instance) {
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
    return {};
  }, [store.instance, store.isFirstStep]);

  const verticalStepperProps = React.useMemo(() => {
    if (store.instance) {
      const commonProps = { classes, t, store, render, cx, prevStep, nextStep, goToStep };
      const steps = [];
      const curriculumValues = getIfCurriculumSubjectsHaveValues(
        store.instance.assignable.subjects
      );
      if (
        store.instance?.assignable?.asset?.description ||
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
      if (store.instance?.assignable?.statement) {
        steps.push({
          label: t('statement'),
          status: 'OK',
          component: <Statement {...commonProps} />,
        });
      }

      const testProps = { styles, onStartQuestions };

      steps.push({
        label: t('development'),
        status: 'OK',
        component: <Development {...commonProps} {...testProps} />,
      });

      return {
        data: steps,
        calificationProps: {
          label: 'Aprobado',
          grade: 9,
          minimumGrade: 5,
        },
      };
    }
    return {};
  }, [store.instance, translations]);

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
        <TaskDeadline {...taskDeadlineProps} size={store.isFirstStep ? 'md' : 'sm'} />
      </Box>
      <Box className={classes.mainContent}>
        <Box className={classes.verticalStepper}>
          <VerticalStepper {...verticalStepperProps} currentStep={store.currentStep} />
        </Box>
        <Box className={classes.pages}>
          {verticalStepperProps.data[store.currentStep]
            ? React.cloneElement(verticalStepperProps.data[store.currentStep].component, {
                isFirstStep: !store.currentStep,
              })
            : null}
        </Box>
      </Box>
    </Box>
  );
}
