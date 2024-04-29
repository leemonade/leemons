import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import {
  ActivityAccordion,
  ActivityAccordionPanel,
  ActivityAnswersBar,
  Box,
  Button,
  ContextContainer,
  HtmlText,
  ImageLoader,
  Stack,
  Switch,
  Table,
  Text,
  TotalLayoutContainer,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
  VerticalContainer,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevRightIcon, SendMessageIcon } from '@bubbles-ui/icons/outline';
import { useSearchParams, useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import hooks from 'leemons-hooks';
import { find, forEach, map, orderBy } from 'lodash';
import React, { useMemo } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import AssignableUserNavigator from '@assignables/components/AssignableUserNavigator';
import useLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/hooks/useLevelsOfDifficulty';
import { CheckBoldIcon, RemoveBoldIcon, SlashIcon, StatisticsIcon } from '@bubbles-ui/icons/solid';
import ChatDrawer from '@comunica/components/ChatDrawer/ChatDrawer';
import ActivityHeader from '@assignables/components/ActivityHeader';
import EvaluationFeedback from '@assignables/components/EvaluationFeedback/EvaluationFeedback';
import useNextActivityUrl from '@assignables/hooks/useNextActivityUrl';
import updateStudentRequest from '@tasks/request/instance/updateStudent';
import { useIsTeacher } from '@academic-portfolio/hooks';
import TimeoutAlert from '@assignables/components/EvaluationFeedback/Alerts/TimeoutAlert';
import ViewModeQuestions from '../../../components/ViewModeQuestions';
import {
  getQuestionByIdsRequest,
  getUserQuestionResponsesRequest,
  setInstanceTimestampRequest,
} from '../../../request';
import { ResultStyles } from './Result.style';
import { calculeInfoValues } from './StudentInstance/helpers/calculeInfoValues';
import { getConfigByInstance } from './StudentInstance/helpers/getConfigByInstance';
import { htmlToText } from './StudentInstance/helpers/htmlToText';

export default function Result() {
  const [t] = useTranslateLoader(prefixPN('testResult'));
  const scrollRef = React.useRef();

  const { classes: styles, cx } = ResultStyles({}, { name: 'Result' });
  const [store, render] = useStore({
    loading: true,
    useQuestionMode: false,
  });

  const [canShowFeedback, setCanShowFeedback] = React.useState(false);
  const [accordionState, setAccordionState] = React.useState([]);
  const [accordionGraphState, setAccordionGraphState] = React.useState(['1']);

  const nextActivityUrl = useNextActivityUrl(store.assignation);

  const levels = useLevelsOfDifficulty();
  const history = useHistory();
  const params = useParams();
  const searchParams = useSearchParams();

  const fromTest = useMemo(() => searchParams.has('fromTest'), []);
  const fromTimeout = searchParams.has('fromTimeout');

  const isTeacher = useIsTeacher();

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

      const score = store.assignation.grades?.[0] ?? {};
      store.feedback = score.feedback ?? null;
      if (store.feedback) {
        setCanShowFeedback(true);
      }
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

  React.useEffect(() => {
    if (
      params?.id &&
      params?.user &&
      (store.idLoaded !== params?.id || store.userLoaded !== params?.user)
    ) {
      init();
    }
  }, [params]);

  const graphData = React.useMemo(() => {
    const selectables = [];
    const data = [];

    if (store.questions) {
      let category = false;
      let level = false;
      forEach(store.questions, (question) => {
        const d = {
          id: question.id,
          status: store.questionResponses[question.id].status
            ? store.questionResponses[question.id].status.toUpperCase()
            : null,
        };
        if (question.category) {
          category = true;
          d.category = question.category.category;
        } else {
          d.category = t('undefined');
        }
        if (levels) {
          if (question.level) {
            level = true;
            d.level = find(levels, { value: question.level }).label;
          } else {
            d.level = t('undefined');
          }
        }
        data.push(d);
      });
      if (category) {
        selectables.push({
          value: 'category',
          label: t('category'),
        });
      }
      if (level) {
        selectables.push({
          value: 'level',
          label: t('level'),
        });
      }
    }
    return { selectables, data, labels: { OK: t('ok'), KO: t('ko'), null: t('nsnc') } };
  }, [store.questions, levels, t]);

  function toggleQuestionMode() {
    store.useQuestionMode = !store.useQuestionMode;
    render();
  }

  const tableHeaders = React.useMemo(
    () => [
      {
        Header: t('question'),
        accessor: 'question',
        className: cx(styles.tableHeader, styles.firstTableHeader),
      },
      {
        Header: t('result'),
        accessor: 'result',
        className: styles.tableHeaderResults,
      },
      {
        Header: t('category'),
        accessor: 'category',
        className: styles.tableHeader,
      },
      {
        Header: t('level'),
        accessor: 'level',
        className: styles.tableHeader,
      },
    ],
    [t]
  );

  const tableData = React.useMemo(
    () =>
      store.questions
        ? map(store.questions, (question, i) => {
            let result = '';
            if (store.questionResponses[question.id].status === 'ok') {
              result = (
                <Box
                  style={{ minWidth: '100px', color: '#5CBC6A', textAlign: 'center' }}
                  className={styles.tableCell}
                >
                  <CheckBoldIcon height={12} width={12} />
                </Box>
              );
            } else if (store.questionResponses[question.id].status === 'ko') {
              result = (
                <Box
                  style={{ minWidth: '100px', color: '#D13B3B', textAlign: 'center' }}
                  className={styles.tableCell}
                >
                  <RemoveBoldIcon height={12} width={12} />
                </Box>
              );
            } else {
              result = (
                <Box
                  style={{ minWidth: '100px', color: '#4D5358', textAlign: 'center' }}
                  className={styles.tableCell}
                >
                  <SlashIcon height={10} width={10} />
                </Box>
              );
            }
            return {
              question: (
                <Box className={styles.tableCell}>
                  {i + 1}. {htmlToText(question.question)}
                </Box>
              ),
              category: (
                <Box style={{ minWidth: '130px' }} className={styles.tableCell}>
                  {question.category?.category || '-'}
                </Box>
              ),
              level: (
                <Box style={{ minWidth: '130px' }} className={styles.tableCell}>
                  {question.level ? find(levels, { value: question.level }).label : '-'}
                </Box>
              ),
              result,
            };
          })
        : [],
    [store.questions, store.questionResponses, levels]
  );

  async function sendFeedback(fromSwitch, remove) {
    store.feedbackError = false;

    const originalGrade = store.assignation.grades[0];
    const currentGrade = originalGrade ?? {
      subject: store.instance.subjects[0].subject,
      type: 'main',
      grade: store.evaluationSystem?.minScale.number,
      feedback: null,
      visibleToStudent: true,
    };

    if (remove || !htmlToText(store.feedback).trim()) {
      currentGrade.feedback = null;
    } else {
      currentGrade.feedback = store.feedback;
    }

    try {
      if ((currentGrade.feedback && !remove) || !!originalGrade) {
        await updateStudentRequest({
          instance: store.instance.id,
          student: store.assignation.user,
          grades: [currentGrade],
        });
      }

      store.assignation.grades = [currentGrade];

      if (!fromSwitch) {
        addSuccessAlert(t('feedbackDone'));
      }
    } catch (e) {
      addErrorAlert(e);
    }
    render();
  }

  const accordion = [];
  const accordionGraph = [];

  if (graphData.data.length && graphData.selectables.length) {
    accordionGraph.push(
      <ActivityAccordionPanel
        key={1}
        itemValue={'1'}
        hideIcon={true}
        title={
          <Text
            sx={(theme) => ({
              alignItems: 'center',
              display: 'flex',
              gap: theme.spacing[2],
              width: '100%!important',
            })}
          >
            <StatisticsIcon /> {t('testResult')}
          </Text>
        }
      >
        <Box p={20}>
          <ActivityAnswersBar {...graphData} />
        </Box>
      </ActivityAccordionPanel>
    );
  }

  // if (!store.room) {
  if (isTeacher || store.feedback) {
    accordion.push(
      <ActivityAccordionPanel
        key={3}
        itemValue={'3'}
        label={t('feedbackForStudent')}
        icon={
          <Box style={{ position: 'relative', width: '24px', height: '24px' }}>
            <ImageLoader src={'/public/tests/feedback-for-student.svg'} />
          </Box>
        }
      >
        {isTeacher ? (
          <Box sx={(theme) => ({ padding: theme.spacing[6] })}>
            <TextEditorInput
              value={store.feedback}
              error={store.feedbackError ? t('feedbackRequired') : null}
              editorStyles={{ minHeight: '96px' }}
              onChange={(e) => {
                store.feedback = e;
                store.feedbackError = false;
                render();
              }}
            />
            <Box
              sx={(theme) => ({
                display: 'flex',
                justifyContent: 'end',
                marginTop: theme.spacing[4],
              })}
            >
              <Button
                onClick={() => {
                  if (!accordionState.includes('2')) {
                    setAccordionState([...accordionState, '2']);
                  } else {
                    sendFeedback();
                  }
                }}
                rightIcon={<SendMessageIcon />}
              >
                {t('sendFeedback')}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={(theme) => ({ padding: theme.spacing[4] })}>
            <Box className={styles.feedbackUser}>
              <HtmlText>{store.feedback}</HtmlText>
            </Box>
          </Box>
        )}
      </ActivityAccordionPanel>
    );
  }
  // }

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
  });

  return (
    <>
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
            {params.user && !store.loading ? (
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
                  <EvaluationFeedback
                    onChatClick={() => {
                      hooks.fireEvent('chat:onRoomOpened', store.room);
                      store.chatOpened = true;
                      render();
                    }}
                    assignation={store.assignation}
                    subject={store?.instance?.subjects?.[0]?.subject}
                  />

                  {isTeacher && !store.instance.dates.evaluationClosed ? (
                    <>
                      <Switch
                        label={t('feedbackForStudent')}
                        onChange={(e) => {
                          setCanShowFeedback(e);
                          sendFeedback(true, true);
                        }}
                        checked={canShowFeedback}
                      />
                      {canShowFeedback ? (
                        <Box sx={(theme) => ({ paddingLeft: theme.spacing[10] })}>
                          <TextEditorInput
                            value={store.feedback}
                            error={store.feedbackError ? t('feedbackRequired') : null}
                            editorStyles={{ minHeight: '96px' }}
                            onChange={(e) => {
                              store.feedback = e;
                              store.feedbackError = false;
                              render();
                            }}
                          />
                        </Box>
                      ) : null}
                    </>
                  ) : null}

                  <Stack justifyContent="end" spacing={2}>
                    {isTeacher && canShowFeedback ? (
                      <Button
                        leftIcon={<SendMessageIcon />}
                        onClick={() => setTimeout(() => sendFeedback(), 100)}
                      >
                        {t('saveAndSendFeedback')}
                      </Button>
                    ) : null}
                  </Stack>

                  <ContextContainer title={t('responses')}>
                    <ActivityAccordion
                      value={accordionGraphState}
                      onChange={setAccordionGraphState}
                    >
                      {accordionGraph}
                    </ActivityAccordion>
                  </ContextContainer>

                  {store.instance?.showCorrectAnswers || isTeacher ? (
                    <ContextContainer
                      titleRightZone={
                        <Button variant="link" onClick={toggleQuestionMode}>
                          {store.useQuestionMode ? t('returnToTable') : t('showInTests')}
                        </Button>
                      }
                      title={`${t('questions')} (${store.questions?.length})`}
                    >
                      <Box>
                        {store.useQuestionMode ? (
                          <ViewModeQuestions store={store} onReturn={toggleQuestionMode} />
                        ) : (
                          <Table columns={tableHeaders} data={tableData} />
                        )}
                      </Box>
                    </ContextContainer>
                  ) : null}
                </Box>
              </Box>
            ) : null}
          </TotalLayoutStepContainer>
        </VerticalContainer>
      </TotalLayoutContainer>
      {!store.loading ? (
        <>
          <ChatDrawer
            onClose={() => {
              hooks.fireEvent('chat:closeDrawer');
              store.chatOpened = false;
              render();
            }}
            opened={store.chatOpened}
            onRoomLoad={(room) => {
              store.room = room;
              render();
            }}
            onMessage={() => {
              store.room.unreadMessages += 1;
              render();
            }}
            onMessagesMarkAsRead={() => {
              store.room.unreadMessages = 0;
              render();
            }}
            room={`assignables.subject|${store?.instance?.subjects?.[0]?.subject}.assignation|${
              store.assignation.id
            }.userAgent|${getUserId()}`}
          />
        </>
      ) : null}
    </>
  );
}
