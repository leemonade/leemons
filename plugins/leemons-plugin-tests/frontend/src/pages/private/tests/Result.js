import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { useIsTeacher } from '@academic-portfolio/hooks';
import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
import ActivityHeader from '@assignables/components/ActivityHeader';
import AssignableUserNavigator from '@assignables/components/AssignableUserNavigator';
import TimeoutAlert from '@assignables/components/EvaluationFeedback/Alerts/TimeoutAlert';
import useNextActivityUrl from '@assignables/hooks/useNextActivityUrl';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import {
  ActivityAccordion,
  ActivityAccordionPanel,
  Box,
  Button,
  Text,
  Title,
  TotalLayoutContainer,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
  VerticalContainer,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { useSearchParams, useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useUpdateTimestamps } from '@tasks/components/Student/TaskDetail/__DEPRECATED__components/Steps/Steps';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import updateStudentRequest from '@tasks/request/instance/updateStudent';
import { forEach, orderBy } from 'lodash';

import {
  getQuestionByIdsRequest,
  getUserQuestionResponsesRequest,
  setInstanceTimestampRequest,
} from '../../../request';

import { ResultStyles } from './Result.style';
import { calculeInfoValues } from './StudentInstance/helpers/calculeInfoValues';
import { getConfigByInstance } from './StudentInstance/helpers/getConfigByInstance';
import { htmlToText } from './StudentInstance/helpers/htmlToText';
import EvaluationAndFeedback from './components/EvaluationAndFeedback';
import StudentResultsTable from './components/StudentResultsTable';

import prefixPN from '@tests/helpers/prefixPN';

export default function Result() {
  const [t] = useTranslateLoader(prefixPN('testResult'));
  const [accordionState, setAccordionState] = useState('evaluationAndFeedback');
  const { classes: styles, cx } = ResultStyles({}, { name: 'Result' });
  const scrollRef = useRef();

  const [store, render] = useStore({
    loading: true,
    useQuestionMode: false,
  });

  const nextActivityUrl = useNextActivityUrl(store.assignation);
  const history = useHistory();
  const params = useParams();
  const searchParams = useSearchParams();

  const { mutateAsync } = useStudentAssignationMutation();
  const updateTimestamps = useUpdateTimestamps(mutateAsync, store.assignation);

  const fromTest = useMemo(() => searchParams.has('fromTest'), []);
  const fromTimeout = searchParams.has('fromTimeout');

  const isTeacher = useIsTeacher();
  const isModuleActivity = !!store.assignation?.instance?.metadata?.module;

  useEffect(() => {
    if (!isTeacher && !isModuleActivity) {
      updateTimestamps('gradesViewed');
    }
  }, [isTeacher, updateTimestamps, isModuleActivity]);

  function getUserId() {
    if (params.user) return params.user;
    return null;
  }

  function onChangeUser(e) {
    if (e) {
      history.push(`/private/tests/result/${params.id}/${e}`);
    }
  }

  async function init() {
    try {
      store.loading = true;
      render();
      [store.instance, store.assignation] = await Promise.all([
        getAssignableInstance({ id: params.id }),
        getAssignation({ id: params.id, user: getUserId() }),
      ]);

      const [{ evaluationSystem }, { questions }, { responses }, { timestamps }] =
        await Promise.all([
          getProgramEvaluationSystemRequest(store.instance.subjects[0].program),
          getQuestionByIdsRequest(store.instance.metadata.questions, { categories: true }),
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
            points: 0,
            status: null,
          };
        }
      });
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
      store.idLoaded = params.id;
      store.userLoaded = params.user;
      store.loading = false;

      render();
    } catch (error) {
      console.log(error);
      addErrorAlert(error);
    }
  }

  useEffect(() => {
    if (
      params?.id &&
      params?.user &&
      (store.idLoaded !== params?.id || store.userLoaded !== params?.user)
    ) {
      init();
    }
  }, [params]);

  async function sendFeedback({ feedback, hideSuccessAlert }) {
    const originalGrade = store.assignation.grades[0];
    const currentGrade = originalGrade ?? {
      subject: store.instance.subjects[0].subject,
      type: 'main',
      grade: store.evaluationSystem?.minScale.number,
      feedback: null,
      visibleToStudent: true,
    };

    const hasValidFeedback = htmlToText(feedback).trim();
    currentGrade.feedback = hasValidFeedback ? feedback : null;

    try {
      if (hasValidFeedback || !!originalGrade) {
        await updateStudentRequest({
          instance: store.instance.id,
          student: store.assignation.user,
          grades: [currentGrade],
        });
      }

      store.assignation.grades = [currentGrade];

      if (!hideSuccessAlert) {
        addSuccessAlert(t('feedbackDone'));
      }
    } catch (e) {
      addErrorAlert(e);
    }
    render();
  }

  const userNote = parseFloat(
    store.assignation?.grades[0]?.grade || store.evaluationSystem?.minScale.number
  );

  let scale = null;
  forEach(orderBy(store.evaluationSystem?.scales, ['number'], ['asc']), (s) => {
    if (userNote >= s.number) {
      scale = s;
    } else if (scale) {
      const diff1 = userNote - scale.number;
      const diff2 = s.number - userNote;
      if (diff2 <= diff1) {
        scale = s;
      }
      return false;
    } else {
      scale = s;
      return false;
    }
    return false;
  });

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <ActivityHeader
          instance={store.instance}
          assignation={store.assignation}
          showClass
          showRole
          showEvaluationType
          showTime
          showDeadline
        />
      }
    >
      <VerticalContainer
        scrollRef={scrollRef}
        leftZone={
          <Box>
            {isTeacher ? (
              <>
                <Box sx={(theme) => ({ marginBottom: theme.spacing[1] })}>
                  <Text>{t('student')}</Text>
                </Box>
                <AssignableUserNavigator
                  onlySelect
                  onChange={onChangeUser}
                  value={params.user}
                  instance={store.instance || params.id}
                />
              </>
            ) : null}
          </Box>
        }
      >
        <TotalLayoutStepContainer
          Footer={
            fromTest &&
            !!store.instance?.metadata?.module && (
              <TotalLayoutFooterContainer
                fixed
                scrollRef={scrollRef}
                rightZone={
                  <Link
                    to={
                      nextActivityUrl ??
                      `/private/learning-paths/modules/dashboard/${store.instance?.metadata?.module?.id}`
                    }
                  >
                    <Button rightIcon={!!nextActivityUrl && <ChevRightIcon />}>
                      {nextActivityUrl ? t('nextActivity') : t('goToModule')}
                    </Button>
                  </Link>
                }
              />
            )
          }
        >
          {!!params.user && !store.loading && (
            <Box>
              <Box className={styles.content}>
                {fromTimeout && (
                  <TimeoutAlert
                    onClose={() => {
                      searchParams.delete('fromTimeout');
                      history.replace({ search: searchParams.toString() });
                    }}
                  />
                )}
                <ActivityAccordion
                  value={accordionState}
                  onChange={setAccordionState}
                  withoutDivider
                >
                  <ActivityAccordionPanel
                    key={1}
                    itemValue={'evaluationAndFeedback'}
                    hideIcon={true}
                    title={<Title order={3}>{t('evaluationAndFeedback')}</Title>}
                  >
                    <EvaluationAndFeedback
                      t={t}
                      assignation={store.assignation}
                      subject={store?.instance?.subjects?.[0]?.subject}
                      questions={store.questions}
                      questionResponses={store.questionResponses}
                      isTeacher={isTeacher}
                      onSaveFeedback={sendFeedback}
                    />
                  </ActivityAccordionPanel>

                  {(store.instance?.showCorrectAnswers || isTeacher) && (
                    <ActivityAccordionPanel
                      key={2}
                      itemValue={'responsesDetailTable'}
                      hideIcon={true}
                      title={
                        <Title order={3}>{`${t('questions')} (${store.questions?.length})`}</Title>
                      }
                      compact
                    >
                      <StudentResultsTable
                        {...store}
                        t={t}
                        styles={styles}
                        cx={cx}
                        scrollRef={scrollRef}
                        studentUserAgentId={store.userLoaded}
                        afterSaveCorrection={init}
                        containerStyles={{
                          paddingBlock: 16,
                          paddingInline: 22, // Accordeon title padding
                        }}
                      />
                    </ActivityAccordionPanel>
                  )}
                </ActivityAccordion>
              </Box>
            </Box>
          )}
        </TotalLayoutStepContainer>
      </VerticalContainer>
    </TotalLayoutContainer>
  );
}
