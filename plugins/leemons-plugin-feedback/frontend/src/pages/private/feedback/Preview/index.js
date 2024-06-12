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
import { useHistory, useParams } from 'react-router-dom';
import { addErrorAlert } from '@layout/alert';
import { getFeedbackRequest } from '@feedback/request';
import QuestionsCard from '@feedback/pages/private/feedback/StudentInstance/components/QuestionsCard';
import IntroductionStep from '../StudentInstance/components/IntroductionStep';

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
  const scrollRef = useRef();
  const [showIntroduction, setShowIntroduction] = useState(true);

  const [store, render] = useStore({
    loading: true,
    statusAccordion: { 0: true },
  });

  const history = useHistory();
  const params = useParams();

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
          <Box style={{ display: 'flex', gap: 16 }}>
            <Button variant="outline" onClick={() => goEditPage()}>
              {tP('edit')}
            </Button>
            <Button variant="primary" onClick={() => goAssignPage()}>
              {tP('assign')}
            </Button>
          </Box>
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
