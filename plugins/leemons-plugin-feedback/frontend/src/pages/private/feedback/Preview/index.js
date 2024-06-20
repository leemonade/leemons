import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  createStyles,
  Stack,
  TotalLayoutContainer,
  TotalLayoutHeader,
  AssetFeedbackIcon,
  VerticalStepperContainer,
} from '@bubbles-ui/components';
// TODO: fix this import from @common plugin
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { useStore } from '@common';
import { useHistory, useParams, Link } from 'react-router-dom';
import { addErrorAlert } from '@layout/alert';
import { ChevRightIcon, EditIcon } from '@bubbles-ui/icons/outline';
import { getFeedbackRequest } from '@feedback/request';
import QuestionsCard from '@feedback/pages/private/feedback/StudentInstance/components/QuestionsCard';
import IntroductionStep from '../StudentInstance/components/IntroductionStep';

const PreviewPageStyles = createStyles((theme) => ({
  firstTableHeader: {
    paddingLeft: `${theme.spacing[6]}px !important`,
  },
  tableHeader: {
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
  const scrollRef = useRef();
  const [showIntroduction, setShowIntroduction] = useState(true);
  const isModulePreview = window?.location?.href?.includes('moduleId');
  const moduleId = window?.location?.href?.split('moduleId=')[1];

  const [store, render] = useStore({
    loading: true,
    statusAccordion: { 0: true },
  });

  const history = useHistory();
  const params = useParams();

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

  const advanceToQuestions = () => {
    setShowIntroduction(false);
  };

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          title={store.feedback?.name}
          cancelable={false}
          icon={<AssetFeedbackIcon />}
          direction="row"
        >
          {isModulePreview ? (
            <Link to={`/private/learning-paths/modules/${moduleId}/view`}>
              <Button variant="outline">{tP('goBackToDashboardPreview')}</Button>
            </Link>
          ) : (
            <Box style={{ display: 'flex', gap: 16 }}>
              <Button variant="outline" onClick={() => goEditPage()}>
                {tP('edit')}
              </Button>
              <Button variant="primary" onClick={() => goAssignPage()}>
                {tP('assign')}
              </Button>
            </Box>
          )}
        </TotalLayoutHeader>
      }
    >
      <Stack
        justifyContent="center"
        ref={scrollRef}
        style={{ overflow: 'auto' }}
        fullWidth
        fullHeight
      >
        <VerticalStepperContainer
          scrollRef={scrollRef}
          currentStep={showIntroduction ? 0 : 1}
          data={[
            { label: 'Introduction', status: 'OK' },
            { label: 'Questions', status: 'OK' },
          ]}
        >
          {showIntroduction ? (
            <IntroductionStep
              feedback={store.feedback ?? {}}
              t={tP}
              onNext={advanceToQuestions}
              scrollRef={scrollRef}
            />
          ) : (
            <QuestionsCard
              setShowIntroduction={setShowIntroduction}
              scrollRef={scrollRef}
              returnToTable={toggleQuestionMode}
              feedback={store.feedback ?? { questions: [] }}
              defaultValues={{}}
            />
          )}
        </VerticalStepperContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
