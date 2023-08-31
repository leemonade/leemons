import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import {
  ActivityAccordion,
  ActivityAccordionPanel,
  ActivityAnswersBar,
  Badge,
  Box,
  Button,
  ContextContainer,
  HtmlText,
  ImageLoader,
  ScoreFeedback,
  Stack,
  Table,
  Text,
  Title,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevronRightIcon, SendMessageIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import hooks from 'leemons-hooks';
import { find, forEach, map, orderBy } from 'lodash';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import AssignableUserNavigator from '@assignables/components/AssignableUserNavigator';
import useLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/hooks/useLevelsOfDifficulty';
import { CutStarIcon, PluginComunicaIcon, StarIcon } from '@bubbles-ui/icons/solid';
import ChatButton from '@comunica/components/ChatButton';
import ChatDrawer from '@comunica/components/ChatDrawer/ChatDrawer';
import ViewModeQuestions from '../../../components/ViewModeQuestions';
import {
  getFeedbackRequest,
  getQuestionByIdsRequest,
  getUserQuestionResponsesRequest,
  setFeedbackRequest,
  setInstanceTimestampRequest,
} from '../../../request';
import { ResultStyles } from './Result.style';
import { calculeInfoValues } from './StudentInstance/helpers/calculeInfoValues';
import { getConfigByInstance } from './StudentInstance/helpers/getConfigByInstance';
import { htmlToText } from './StudentInstance/helpers/htmlToText';

export default function Result() {
  const [t] = useTranslateLoader(prefixPN('testResult'));

  const { classes: styles, cx } = ResultStyles({}, { name: 'Result' });
  const [store, render] = useStore({
    loading: true,
    useQuestionMode: false,
  });

  const [accordionState, setAccordionState] = React.useState([]);

  const levels = useLevelsOfDifficulty();
  const history = useHistory();
  const params = useParams();

  function getUserId() {
    if (params.user) return params.user;
    return null;
  }

  function onChangeUser(e) {
    if (e) {
      history.push(`/private/tests/result/${params.id}/${e}`);
    } else {
      history.push(`/private/tests/result/${params.id}`);
    }
  }

  async function getIfTeacher() {
    try {
      const { feedback } = await getFeedbackRequest(params.id, getUserId());
      store.isTeacher = feedback.isTeacher;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  async function init() {
    try {
      store.loading = true;
      render();
      console.log('init');
      [store.instance, store.assignation] = await Promise.all([
        getAssignableInstance({ id: params.id }),
        getAssignation({ id: params.id, user: getUserId() }),
      ]);

      console.log('store.instance');
      console.log(store.instance);

      const [{ evaluationSystem }, { questions }, { responses }, { timestamps }, { feedback }] =
        await Promise.all([
          getProgramEvaluationSystemRequest(store.instance.subjects[0].program),
          getQuestionByIdsRequest(store.instance.metadata.questions, { categories: true }),
          getUserQuestionResponsesRequest(params.id, getUserId()),
          setInstanceTimestampRequest(params.id, 'open', getUserId()),
          getFeedbackRequest(store.instance.id, getUserId()),
        ]);
      store.isTeacher = feedback.isTeacher;
      store.feedback = feedback.feedback;
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
    } else {
      getIfTeacher();
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
        className: styles.tableHeader,
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
        ? map(store.questions, (question) => {
            let result = '';
            if (store.questionResponses[question.id].status === 'ok') {
              result = (
                <Box style={{ minWidth: '100px' }} className={styles.tableCell}>
                  <Box style={{ width: '20px', height: '20px', position: 'relative' }}>
                    <ImageLoader src={'/public/tests/question-done.svg'} />
                  </Box>
                </Box>
              );
            } else if (store.questionResponses[question.id].status === 'ko') {
              result = (
                <Box style={{ minWidth: '100px' }} className={styles.tableCell}>
                  <Box style={{ width: '20px', height: '20px', position: 'relative' }}>
                    <ImageLoader src={'/public/tests/question-error.svg'} />
                  </Box>
                </Box>
              );
            } else {
              result = (
                <Box style={{ minWidth: '100px' }} className={styles.tableCell}>
                  <Box
                    sx={(theme) => ({
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: theme.colors.ui01,
                    })}
                  />
                </Box>
              );
            }
            return {
              question: <Box className={styles.tableCell}>{htmlToText(question.question)}</Box>,
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

  async function sendFeedback() {
    store.feedbackError = false;
    if (!htmlToText(store.feedback).trim()) {
      store.feedbackError = true;
    } else {
      try {
        await setFeedbackRequest(store.instance.id, getUserId(), store.feedback);
        addSuccessAlert(t('feedbackDone'));
      } catch (e) {
        addErrorAlert(e);
      }
    }
    render();
  }

  const accordion = [];
  if (graphData.data.length && graphData.selectables.length) {
    accordion.push(
      <ActivityAccordionPanel
        key={1}
        label={t('testResult')}
        icon={
          <Box style={{ position: 'relative', width: '23px', height: '23px' }}>
            <ImageLoader className="stroke-current" src={'/public/tests/test-results-icon.svg'} />
          </Box>
        }
        color="solid"
      >
        <Box p={20}>
          <ActivityAnswersBar {...graphData} />
        </Box>
      </ActivityAccordionPanel>
    );
  }
  if (store.instance?.showCorrectAnswers || store.isTeacher) {
    accordion.push(
      <ActivityAccordionPanel
        key={2}
        itemValue={'2'}
        label={t('questions')}
        rightSection={
          <Box>
            <Badge label={store.questions?.length} size="md" color="stroke" closable={false} />
          </Box>
        }
        icon={
          <Box style={{ position: 'relative', width: '22px', height: '24px' }}>
            <ImageLoader className="stroke-current" src={'/public/tests/questions-icon.svg'} />
          </Box>
        }
      >
        <Box>
          {store.useQuestionMode ? (
            <ViewModeQuestions store={store} onReturn={toggleQuestionMode} />
          ) : (
            <>
              <Box className={styles.showTestBar}>
                <Button rounded rightIcon={<ChevronRightIcon />} onClick={toggleQuestionMode}>
                  {t('showInTests')}
                </Button>
              </Box>
              <Table columns={tableHeaders} data={tableData} />
            </>
          )}
        </Box>
      </ActivityAccordionPanel>
    );
  }
  if (!store.room) {
    if (store.isTeacher || (!store.isTeacher && store.feedback)) {
      accordion.push(
        <ActivityAccordionPanel
          key={2}
          itemValue={'2'}
          label={t('feedbackForStudent')}
          icon={
            <Box style={{ position: 'relative', width: '24px', height: '24px' }}>
              <ImageLoader src={'/public/tests/feedback-for-student.svg'} />
            </Box>
          }
        >
          {store.isTeacher ? (
            <Box sx={(theme) => ({ padding: theme.spacing[6] })}>
              <TextEditorInput
                value={store.feedback}
                error={store.feedbackError ? t('feedbackRequired') : null}
                onChange={(e) => {
                  store.feedback = e;
                  store.feedbackError = false;
                  render();
                }}
              />
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
  });

  return (
    <ContextContainer
      sx={(theme) => ({
        backgroundColor: theme.colors.uiBackground02,
        paddingBottom: theme.spacing[12],
        overflow: 'auto',
      })}
      fullHeight
      fullWidth
    >
      <Box
        sx={(theme) => ({
          width: '100%',
          maxWidth: theme.breakpoints.lg,
          paddingLeft: store.isTeacher ? 0 : theme.spacing[8],
          paddingRight: theme.spacing[5],
        })}
      >
        <Box className={styles.container}>
          {store.isTeacher ? (
            <Box className={styles.leftContent}>
              <AssignableUserNavigator
                onChange={onChangeUser}
                value={params.user}
                instance={store.instance || params.id}
              />
            </Box>
          ) : null}
          {params.user && !store.loading ? (
            <Box
              className={cx(
                styles.rightContent,
                store.isTeacher ? styles.rightContentTeacher : null
              )}
            >
              <Box className={styles.header}>
                <Text role="productive">
                  {store.instance.gradable ? t('gradable') : t('notGradable')}{' '}
                  {store.instance.gradable ? <StarIcon /> : <CutStarIcon />}
                </Text>
              </Box>
              <Box className={styles.content}>
                <ScoreFeedback
                  calification={{
                    minimumGrade: store.evaluationSystem.minScaleToPromote.number,
                    grade: userNote,
                    label: scale.letter,
                    showOnlyLabel: false,
                  }}
                >
                  <Stack
                    fullWidth
                    fullHeight
                    direction="column"
                    justifyContent="center"
                    style={{
                      padding: 24,
                    }}
                  >
                    <Text size="md" role="productive" strong>
                      Test
                    </Text>
                    <Title order={3}>{store.instance.assignable.asset.name}</Title>
                  </Stack>
                </ScoreFeedback>
                <ActivityAccordion multiple value={accordionState} onChange={setAccordionState}>
                  {accordion}
                </ActivityAccordion>
                {store.isTeacher && !store.room ? (
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
                ) : null}
              </Box>
              <Box sx={(theme) => ({ marginTop: theme.spacing[10] })}>
                <ContextContainer alignItems="center">
                  <Text size="md" color="primary" strong>
                    {store.isTeacher ? t('chatTeacherDescription') : t('chatDescription')}
                  </Text>
                  <Box>
                    <Button
                      rounded
                      rightIcon={<PluginComunicaIcon />}
                      onClick={() => {
                        hooks.fireEvent('chat:onRoomOpened', store.room);
                        store.chatOpened = true;
                        render();
                      }}
                    >
                      {store.isTeacher ? t('chatButtonStudent') : t('chatButtonTeacher')}
                    </Button>
                  </Box>
                </ContextContainer>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>

      {/**/}
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
            room={`plugins.assignables.subject|${
              store?.instance?.subjects?.[0]?.subject
            }.assignation|${store.assignation.id}.userAgent|${getUserId()}`}
          />
        </>
      ) : null}
    </ContextContainer>
  );
}
