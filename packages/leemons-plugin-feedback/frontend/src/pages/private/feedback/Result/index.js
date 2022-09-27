import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { useStore } from '@common';
import { useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Title,
  ActivityAccordion,
  ActivityAccordionPanel,
} from '@bubbles-ui/components';
import { getFeedbackRequest, getFeedbackResultsRequest } from '@feedback/request';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import ResultStyles from './Result.styles';

const Empty = () => <Box>HELLO</Box>;

const questionsByType = {
  singleResponse: <Empty />,
  multiResponse: <Empty multi />,
  likertScale: <Empty />,
  netPromoterScore: <Empty />,
  openResponse: <Empty />,
};

export default function Result() {
  const [t] = useTranslateLoader(prefixPN('feedbackResult'));
  const [store, render] = useStore({
    loading: true,
    isNew: false,
    currentStep: 0,
    data: {
      metadata: {},
    },
  });

  const { classes } = ResultStyles({}, { name: 'Result' });

  const params = useParams();

  async function init() {
    store.loading = true;
    render();
    const instance = await getAssignableInstance({ id: params.id });

    const [result, feedback] = await Promise.all([
      getFeedbackResultsRequest(params.id),
      getFeedbackRequest(instance.assignable.id),
    ]);

    store.result = result;
    store.feedback = feedback.feedback;
    store.loading = false;
    render();
  }

  const renderQuestions = () => {
    const questionBoxs = store.feedback.questions.map((question, index) => (
      <ActivityAccordionPanel
        label={t('question', { i: index + 1 })}
        color="solid"
        key={question.id}
      >
        <Box className={classes.question}>hola</Box>
        <Box>
          {React.cloneElement(questionsByType[question.type], {
            question,
            responses: store.result.questionsInfo[question.id],
          })}
        </Box>
      </ActivityAccordionPanel>
    ));
    return questionBoxs;
  };

  React.useEffect(() => {
    if (params.id) init();
  }, [params.id]);

  if (store.loading) return null;

  return (
    <Stack justifyContent="center" fullWidth fullHeight className={classes.root}>
      <Stack direction="column" spacing={4} className={classes.container}>
        <Box className={classes.resultHeader}>
          <Title order={5} role="productive" color="quartiary">
            {t('feedback')}
          </Title>
          <Title order={3} style={{ marginTop: 2 }}>
            {store.feedback.name}
          </Title>
        </Box>
        <ActivityAccordion>
          <ActivityAccordionPanel label={t('generalInformation')} color="solid">
            <Box>hola</Box>
          </ActivityAccordionPanel>
          {renderQuestions()}
        </ActivityAccordion>
      </Stack>
    </Stack>
  );
}
