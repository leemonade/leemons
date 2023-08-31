import React from 'react';
import {
  ActionButton,
  ActivityAccordion,
  ActivityAccordionPanel,
  Badge,
  Box,
  Button,
  ContextContainer,
  createStyles,
  ImageLoader,
  PageContainer,
  Stack,
  Table,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { getQuestionForTable } from '@feedback/helpers/getQuestionForTable';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { addErrorAlert } from '@layout/alert';
import { ChevronRightIcon, EditIcon, PluginFeedbackIcon } from '@bubbles-ui/icons/outline';
import { getFeedbackRequest } from '@feedback/request';
import { map } from 'lodash';
import QuestionsCard from '@feedback/pages/private/feedback/StudentInstance/components/QuestionsCard';

const PreviewPageStyles = createStyles((theme, { viewMode }) => ({
  firstTableHeader: {
    paddingLeft: `${theme.spacing[6]}px !important`,
  },
  tableHeader: {
    backgroundColor: theme.colors.interactive03h,
    paddingBottom: theme.spacing[2],
    paddingTop: theme.spacing[6],
    paddingLeft: theme.spacing[5],
  },
  tableCell: {
    paddingLeft: theme.spacing[4],
    paddingRight: theme.spacing[4],
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
  },
  showTestBar: {
    backgroundColor: theme.colors.uiBackground01,
    padding: theme.spacing[4],
    display: 'flex',
    justifyContent: 'end',
  },
  returnToTable: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
}));

export default function Preview() {
  const [tP, t1V] = useTranslateLoader(prefixPN('feedbackPreview'));
  const [tD, t2V] = useTranslateLoader(prefixPN('feedbackDetail'));
  const { classes, cx } = PreviewPageStyles({}, { name: 'FeedbackPreview' });

  const [store, render] = useStore({
    loading: true,
    statusAccordion: { 0: true },
  });

  const history = useHistory();
  const params = useParams();

  const tableHeaders = [
    {
      Header: tD('questionLabel'),
      accessor: 'question',
      className: cx(classes.tableHeader, classes.firstTableHeader),
    },
    {
      Header: tD('responsesLabel'),
      accessor: 'responses',
      className: classes.tableHeader,
    },
    {
      Header: tD('typeLabel'),
      accessor: 'type',
      className: classes.tableHeader,
    },
    {
      Header: tD('actionsHeader'),
      accessor: 'actions',
      className: classes.tableHeader,
    },
  ];

  // function getStats() {
  //   const selectables = [];
  //   const data = [];

  //   if (store.test?.questions) {
  //     let category = false;
  //     let level = false;
  //     let type = false;
  //     const levelsByValue = keyBy(levels, 'value');
  //     const categoriesById = keyBy(store.test.questionBank.categories, 'id');
  //     forEach(store.test.questions, (question) => {
  //       const d = {
  //         id: question.id,
  //         status: null,
  //       };
  //       if (question.level) {
  //         level = true;
  //         d.level = levelsByValue[question.level].label;
  //       } else {
  //         d.level = t('undefined');
  //       }
  //       if (question.category) {
  //         category = true;
  //         d.category = categoriesById[question.category].value;
  //       } else {
  //         d.category = t('undefined');
  //       }
  //       if (question.type) {
  //         type = true;
  //         d.type = t2(questionTypeT[question.type]);
  //       } else {
  //         d.type = t('undefined');
  //       }
  //       data.push(d);
  //     });
  //     if (category) {
  //       selectables.push({
  //         value: 'category',
  //         label: t('categories'),
  //       });
  //     }
  //     if (type) {
  //       selectables.push({
  //         value: 'type',
  //         label: t('questionTypes'),
  //       });
  //     }
  //     if (level) {
  //       selectables.push({
  //         value: 'level',
  //         label: t('levels'),
  //       });
  //     }
  //   }
  //   return { selectables, data, labels: { OK: t('ok'), KO: t('ko'), null: t('nsnc') } };
  // }

  async function init() {
    try {
      store.currentId = params.id;
      const { feedback } = await getFeedbackRequest(params.id);
      store.feedback = feedback;
      // const { evaluationSystem } = await getProgramEvaluationSystemRequest(test.program);
      // // console.log(test);
      // store.test = test;
      // store.stats = getStats();
      // store.test.questionResponses = {};
      // forEach(store.test.questions, ({ id }) => {
      //   store.test.questionResponses[id] = {
      //     clues: 0,
      //     points: 0,
      //     status: null,
      //   };
      // });
      // store.test.config = getConfigByInstance();
      // store.test.questionsInfo = calculeInfoValues(
      //   store.test.questions.length,
      //   evaluationSystem.maxScale.number,
      //   evaluationSystem.minScale.number,
      //   evaluationSystem.minScaleToPromote.number
      // );
      // store.evaluationSystem = evaluationSystem;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  function goAssignPage() {
    history.push(`/private/feedback/assign/${store.feedback.id}`);
  }

  function goEditPage() {
    history.push(`/private/feedback/${store.feedback.id}`);
  }

  function toggleQuestionMode() {
    store.useQuestionMode = !store.useQuestionMode;
    render();
  }

  React.useEffect(() => {
    if (params?.id && (!store.currentId || store.currentId !== params.id) && t1V && t2V) init();
  }, [params, t1V, t2V]);

  const editQuestion = () => {
    goEditPage();
  };

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
      <AdminPageHeader
        values={{
          title: store.feedback?.name,
        }}
        buttons={{
          duplicate: tP('edit'),
          edit: tP('assign'),
        }}
        icon={<PluginFeedbackIcon />}
        variant="teacher"
        onDuplicate={() => goEditPage()}
        onEdit={() => goAssignPage()}
      />
      <PageContainer noFlex>
        <Box sx={(theme) => ({ paddingBottom: theme.spacing[12] })}>
          <ActivityAccordion
            state={store.statusAccordion}
            onChange={(e) => {
              store.statusAccordion = e;
              render();
            }}
          >
            <ActivityAccordionPanel
              label={tP('questions')}
              rightSection={
                <Box>
                  <Badge
                    label={store.feedback?.questions?.length}
                    size="md"
                    color="stroke"
                    closable={false}
                  />
                </Box>
              }
              icon={
                <Box style={{ position: 'relative', width: '22px', height: '24px' }}>
                  <ImageLoader
                    className="stroke-current"
                    src={'/public/feedback/questions-icon.svg'}
                  />
                </Box>
              }
            >
              <Box>
                {store.useQuestionMode ? (
                  <Box>
                    <QuestionsCard
                      viewMode
                      returnToTable={toggleQuestionMode}
                      feedback={store.feedback}
                      defaultValues={{}}
                    />
                  </Box>
                ) : (
                  <>
                    <Box className={classes.showTestBar}>
                      <Button rounded rightIcon={<ChevronRightIcon />} onClick={toggleQuestionMode}>
                        {tP('showPreview')}
                      </Button>
                    </Box>
                    <Table
                      columns={tableHeaders}
                      data={map(store.feedback?.questions, (question) => ({
                        ...getQuestionForTable(question, tD),
                        actions: (
                          <Stack justifyContent="end" fullWidth>
                            <ActionButton icon={<EditIcon />} onClick={editQuestion} />
                          </Stack>
                        ),
                      }))}
                    />
                  </>
                )}
              </Box>
            </ActivityAccordionPanel>
          </ActivityAccordion>
        </Box>
      </PageContainer>
    </ContextContainer>
  );
}
