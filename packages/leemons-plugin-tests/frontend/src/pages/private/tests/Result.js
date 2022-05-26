import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { find, forEach, map, uniq } from 'lodash';
import { TextEditorInput } from '@bubbles-ui/editors';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import getAssignation from '@assignables/requests/assignations/getAssignation';
import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
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
  useAccordionState,
} from '@bubbles-ui/components';
import { ChevronRightIcon, SendMessageIcon } from '@bubbles-ui/icons/outline';

import { CutStarIcon, StarIcon } from '@bubbles-ui/icons/solid';
import useLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/hooks/useLevelsOfDifficulty';
import AssignableUserNavigator from '@assignables/components/AssignableUserNavigator';
import { calculeInfoValues } from './StudentInstance/helpers/calculeInfoValues';
import {
  getFeedbackRequest,
  getQuestionByIdsRequest,
  getUserQuestionResponsesRequest,
  setFeedbackRequest,
  setInstanceTimestampRequest,
} from '../../../request';
import { ResultStyles } from './Result.style';
import { htmlToText } from './StudentInstance/helpers/htmlToText';
import ViewModeQuestions from '../../../components/ViewModeQuestions';

export default function Result() {
  const [t] = useTranslateLoader(prefixPN('testResult'));

  const { classes: styles, cx } = ResultStyles({}, { name: 'Result' });
  const [store, render] = useStore({
    loading: true,
    useQuestionMode: false,
  });

  const [accordionState, accordionFunctions] = useAccordionState({ initialState: {} });

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
    const { feedback } = await getFeedbackRequest(params.id, getUserId());
    store.isTeacher = feedback.isTeacher;
    render();
  }

  async function init() {
    try {
      store.loading = true;
      render();
      [store.instance, store.assignation] = await Promise.all([
        getAssignableInstance({ id: params.id }),
        getAssignation({ id: params.id, user: getUserId() }),
      ]);

      const [{ evaluationSystem }, { questions }, { responses }, { timestamps }, { feedback }] =
        await Promise.all([
          getProgramEvaluationSystemRequest(store.instance.assignable.subjects[0].program),
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
      store.questionsInfo = calculeInfoValues(
        questions.length,
        evaluationSystem.maxScale.number,
        evaluationSystem.minScale.number,
        evaluationSystem.minScaleToPromote.number
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
        if (store.questionResponses[question.id].status) {
          const d = {
            id: question.id,
            status: store.questionResponses[question.id].status.toUpperCase(),
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
        }
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
    return { selectables, data };
  }, [store.questions, levels, t]);

  function onChangeType(e) {
    store.graphicHeight = uniq(map(graphData.data, e)).length * 25 + 50;
    render();
  }

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
        console.log(e);
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
          <ActivityAnswersBar
            {...graphData}
            graphicHeight={store.graphicHeight}
            onChangeType={onChangeType}
          />
        </Box>
      </ActivityAccordionPanel>
    );
  }
  accordion.push(
    <ActivityAccordionPanel
      key={2}
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
  if (store.isTeacher || (!store.isTeacher && store.feedback)) {
    accordion.push(
      <ActivityAccordionPanel
        key={2}
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
                    grade:
                      store.assignation.grades[0]?.grade || store.evaluationSystem.minScale.number,
                    label: null,
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
                <ActivityAccordion
                  state={accordionState}
                  onChange={(e) => {
                    accordionFunctions.setState(e);
                  }}
                >
                  {accordion}
                </ActivityAccordion>
                {store.isTeacher ? (
                  <Box
                    sx={(theme) => ({
                      display: 'flex',
                      justifyContent: 'end',
                      marginTop: theme.spacing[4],
                    })}
                  >
                    <Button
                      onClick={() => {
                        if (!accordionState[2]) {
                          accordionFunctions.toggle(2);
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
            </Box>
          ) : null}
        </Box>
      </Box>
    </ContextContainer>
  );
}
