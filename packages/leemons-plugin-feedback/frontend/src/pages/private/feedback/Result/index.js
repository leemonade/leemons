import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { htmlToText, useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import {
  ActivityAccordion,
  ActivityAccordionPanel,
  Badge,
  Box,
  Button,
  Stack,
  Text,
  Title,
  TextClamp,
} from '@bubbles-ui/components';
import { getFeedbackRequest, getFeedbackResultsRequest } from '@feedback/request';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import {
  DataFileBarsQuestionIcon,
  FormImageIcon,
  GaugeDashboardIcon,
  NavigationMenuLeftIcon,
  PluginRankingIcon,
  QuestionExclamationIcon,
  DownloadIcon,
} from '@bubbles-ui/icons/outline';
import { NPSStatistics } from '@feedback/pages/private/feedback/Result/components/NPSStatistics';
import { LikertStatistics } from '@feedback/pages/private/feedback/Result/components/LikertStatistics';
import { addErrorAlert } from '@layout/alert';
import { createDatasheet } from '@feedback/helpers/createDatasheet';
import ResultStyles from './Result.styles';
import { OpenResponse, SelectResponse } from './components';

const questionsByType = {
  likertScale: <LikertStatistics />,
  singleResponse: <SelectResponse />,
  multiResponse: <SelectResponse />,
  netPromoterScore: <NPSStatistics />,
  openResponse: <OpenResponse />,
};

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export default function Result() {
  const [t] = useTranslateLoader(prefixPN('feedbackResult'));
  const [store, render] = useStore({
    loading: true,
    accordionState: { 0: true },
  });

  const { classes } = ResultStyles({}, { name: 'Result' });

  const history = useHistory();
  const params = useParams();

  async function init() {
    try {
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
    } catch (err) {
      await addErrorAlert(err.code ? t(`errorCode${err.code}`) : err.message);
      if (err.code === 6001) {
        history.push('/private/assignables/ongoing');
      }
    }
  }

  const getQuestionBadges = (question) => {
    const questionTypes = {
      likertScale: 'Likert',
      singleResponse: t('singleResponse'),
      multiResponse: t('multiResponse'),
      netPromoterScore: 'NPS',
      openResponse: t('openResponse'),
    };
    return (
      <Stack spacing={2}>
        <Badge label={questionTypes[question.type]} closable={false} />
        <Badge label={question.required ? t('required') : t('notRequired')} closable={false} />
      </Stack>
    );
  };

  const getQuestionIcons = (questionType, hasImage) => {
    const questionTypes = {
      likertScale: <PluginRankingIcon />,
      singleResponse: hasImage ? <FormImageIcon /> : <QuestionExclamationIcon />,
      multiResponse: hasImage ? <FormImageIcon /> : <QuestionExclamationIcon />,
      netPromoterScore: <GaugeDashboardIcon />,
      openResponse: <NavigationMenuLeftIcon />,
    };

    return questionTypes[questionType];
  };

  const renderQuestions = () => {
    const questionBoxs = store.feedback.questions.map((question, index) => (
      <ActivityAccordionPanel
        label={
          <TextClamp>
            <Text role="productive" color="primary" stronger size="md">{`${index + 1}. ${htmlToText(
              question.question
            )}`}</Text>
          </TextClamp>
        }
        color="solid"
        icon={getQuestionIcons(question.type, question.properties.withImages)}
        key={question.id}
        rightSection={getQuestionBadges(question)}
      >
        <Box>
          {React.cloneElement(questionsByType[question.type], {
            question,
            responses: store.result.questionsInfo[question.id] || {},
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

  function downloadDatasheet(format) {
    createDatasheet(
      store.feedback.name,
      store.feedback.questions,
      store.result.questionsInfo,
      format
    );
  }

  React.useEffect(() => {
    if (params.id) init();
  }, [params.id]);

  if (store.loading) return null;

  return (
    <Stack justifyContent="center" fullWidth className={classes.root}>
      <Stack direction="column" spacing={4} className={classes.container}>
        <Stack justifyContent="flex-end" spacing={3}>
          <Button
            variant="outline"
            rightIcon={<DownloadIcon />}
            onClick={() => downloadDatasheet('csv')}
          >
            CSV
          </Button>
          <Button
            variant="outline"
            rightIcon={<DownloadIcon />}
            onClick={() => downloadDatasheet('xls')}
          >
            XLS
          </Button>
        </Stack>
        <Box className={classes.resultHeader}>
          <Title order={5} role="productive" color="quartiary">
            {t('feedback')}
          </Title>
          <Title order={3} style={{ marginTop: 2 }}>
            {store.feedback.name}
          </Title>
        </Box>
        <ActivityAccordion
          state={store.accordionState}
          onChange={(e) => {
            store.accordionState = e;
            render();
          }}
        >
          <ActivityAccordionPanel
            label={t('generalInformation')}
            color="solid"
            icon={<DataFileBarsQuestionIcon />}
          >
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
                <Text className={classes.infoText}>{`${
                  store.result.generalInfo.completionPercentage || 0
                }%`}</Text>
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
