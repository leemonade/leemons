import React from 'react';
import {
  ActivityAccordion,
  ActivityAccordionPanel,
  ActivityAnswersBar,
  ActionButton,
  Badge,
  Text,
  Box,
  Button,
  ContextContainer,
  ImageLoader,
  PageContainer,
  Stack,
  useAccordionState,
  Table,
  createStyles,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { getQuestionForTable } from '@feedback/helpers/getQuestionForTable';
import { useStore } from '@common';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { useHistory, useParams } from 'react-router-dom';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import AssetList from '@leebrary/components/AssetList';
import { prepareAsset } from '@leebrary/helpers/prepareAsset';
import { addErrorAlert } from '@layout/alert';
import {
  PluginFeedbackIcon,
  EditIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from '@bubbles-ui/icons/outline';
import { getFeedbackRequest } from '@feedback/request';
import { map } from 'lodash';

const PreviewPageStyles = createStyles((theme) => ({
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
    history.push(`/private/feedback/assign/${store.test.id}`);
  }

  function goEditPage() {
    history.push(`/private/feedback/${store.test.id}`);
  }

  function toggleQuestionMode() {
    store.useQuestionMode = !store.useQuestionMode;
    render();
  }

  React.useEffect(() => {
    if (params?.id && (!store.currentId || store.currentId !== params.id) && t1V && t2V) init();
  }, [params, t1V, t2V]);

  // const accordion = [];
  // if (store.stats?.data.length && store.stats?.selectables.length) {
  //   accordion.push(
  //     <ActivityAccordionPanel
  //       key={1}
  //       label={t('chartLabel')}
  //       icon={
  //         <Box style={{ position: 'relative', width: '23px', height: '23px' }}>
  //           <ImageLoader className="stroke-current" src={'/public/tests/test-results-icon.svg'} />
  //         </Box>
  //       }
  //       color="solid"
  //     >
  //       <Box p={20}>
  //         <ActivityAnswersBar showBarIcon={false} withLegend={false} {...store.stats} />
  //       </Box>
  //     </ActivityAccordionPanel>
  //   );
  // }
  // if (store.test) {
  //   accordion.push(
  //     <ActivityAccordionPanel
  //       key={2}
  //       label={t('questions')}
  //       rightSection={
  //         <Box>
  //           <Badge
  //             label={store.test?.questions?.length}
  //             size="md"
  //             color="stroke"
  //             closable={false}
  //           />
  //         </Box>
  //       }
  //       icon={
  //         <Box style={{ position: 'relative', width: '22px', height: '24px' }}>
  //           <ImageLoader className="stroke-current" src={'/public/tests/questions-icon.svg'} />
  //         </Box>
  //       }
  //     >
  //       <Box>
  //         {store.useQuestionMode ? (
  //           <ViewModeQuestions viewMode={false} store={store.test} onReturn={toggleQuestionMode} />
  //         ) : (
  //           <>
  //             <Box className={styles.showTestBar}>
  //               <Button rounded rightIcon={<ChevronRightIcon />} onClick={toggleQuestionMode}>
  //                 {t('showInTests')}
  //               </Button>
  //             </Box>
  //             <QuestionsTable withStyle hideCheckbox questions={store.test?.questions} />
  //           </>
  //         )}
  //       </Box>
  //     </ActivityAccordionPanel>
  //   );
  // }

  const editQuestion = (i) => {
    console.log(i);
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
          <ActivityAccordion>
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
                  <Box onClick={toggleQuestionMode}>
                    {/* <Box className={classes.returnToTable} onClick={toggleQuestionMode}>
                      <ArrowLeftIcon />
                      <Box sx={(theme) => ({ paddingLeft: theme.spacing[3] })}>
                        <Text role="productive" size="md" color="primary">
                          {tP('returnToTable')}
                        </Text>
                      </Box>
                    </Box> */}
                    questionMode
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
                      data={map(store.feedback?.questions, (question, i) => ({
                        ...getQuestionForTable(question, tD),
                        actions: (
                          <Stack justifyContent="end" fullWidth>
                            <ActionButton icon={<EditIcon />} onClick={() => editQuestion(i)} />
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
