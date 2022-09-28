import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { useStore } from '@common';
import { useParams } from 'react-router-dom';
import {
  ActivityAccordion,
  ActivityAccordionPanel,
  Box,
  Stack,
  Text,
  Title,
} from '@bubbles-ui/components';
import { getFeedbackRequest, getFeedbackResultsRequest } from '@feedback/request';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import { NavigationMenuLeftIcon } from '@bubbles-ui/icons/outline';
import { StarIcon } from '@bubbles-ui/icons/solid';

import { NPSStatistics } from '@feedback/pages/private/feedback/Result/components/NPSStatistics';
import ResultStyles from './Result.styles';

const Empty = () => <Box>HELLO</Box>;

const questionsByType = {
  singleResponse: <Empty />,
  multiResponse: <Empty multi />,
  likertScale: <Empty />,
  netPromoterScore: <NPSStatistics />,
  openResponse: <Empty />,
};

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

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
        icon={<NavigationMenuLeftIcon />}
        key={question.id}
      >
        <Box className={classes.question}>hola</Box>
        <Box>
          {React.cloneElement(questionsByType[question.type], {
            question,
            responses: store.result.questionsInfo[question.id],
            t,
          })}
        </Box>
      </ActivityAccordionPanel>
    ));
    return questionBoxs;
  };

  function getAvgTime() {
    const milliseconds = store.result.generalInfo.avgTimeOfCompletion;
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds %= 60;
    minutes %= 60;
    hours %= 24;
    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
  }

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
          <ActivityAccordionPanel label={t('generalInformation')} color="solid" icon={<StarIcon />}>
            <Stack fullWidth fullHeight spacing={2} className={classes.generalInformation}>
              <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                <Text role="productive" color="primary" size="xs">
                  {t('started')}
                </Text>
                <Text className={classes.infoText}>{store.result.generalInfo.started}</Text>
              </Box>
              <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                <Text role="productive" color="primary" size="xs">
                  {t('sent')}
                </Text>
                <Text className={classes.infoText}>{store.result.generalInfo.finished}</Text>
              </Box>
              <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                <Text role="productive" color="primary" size="xs">
                  {t('completed')}
                </Text>
                <Text
                  className={classes.infoText}
                >{`${store.result.generalInfo.completionPercentage}%`}</Text>
              </Box>
              <Box className={classes.infoBox}>
                <Text role="productive" color="primary" size="xs">
                  {t('timeToComplete')}
                </Text>
                <Text className={classes.infoText}>{getAvgTime()}</Text>
              </Box>
            </Stack>
          </ActivityAccordionPanel>
          {renderQuestions()}
        </ActivityAccordion>
      </Stack>
    </Stack>
  );
}
