import React, { useRef } from 'react';
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
  TextClamp,
  ContextContainer,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { getFeedbackRequest, getFeedbackResultsRequest } from '@feedback/request';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import {
  DataFileBarsQuestionIcon,
  DownloadIcon,
  FormImageIcon,
  GaugeDashboardIcon,
  NavigationMenuLeftIcon,
  PluginRankingIcon,
  QuestionExclamationIcon,
} from '@bubbles-ui/icons/outline';
import { NPSStatistics } from '@feedback/pages/private/feedback/Result/components/NPSStatistics';
import { LikertStatistics } from '@feedback/pages/private/feedback/Result/components/LikertStatistics';
import { addErrorAlert } from '@layout/alert';
import { createDatasheet } from '@feedback/helpers/createDatasheet';
import ActivityHeader from '@assignables/components/ActivityHeader/index';
import useInstances from '@assignables/requests/hooks/queries/useInstances';

import { useIsTeacher } from '@academic-portfolio/hooks';
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
  });
  const [accordionState, setAccordionState] = React.useState(['info']);

  const isTeacher = useIsTeacher();
  const history = useHistory();
  const params = useParams();
  const scrollRef = useRef();

  const { data: dynamicInstance } = useInstances({ id: params.id });
  const { classes } = ResultStyles({}, { name: 'Result' });

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
      store.instanceId = params.id;
      store.instance = instance;
      store.instanceState = {
        isClosed: instance?.dates?.closed,
        isArchived: instance.dates?.archived,
      };
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
        <Badge closable={false} size="xs" className={classes.badge}>
          <Text className={classes.badgeText}>{questionTypes[question.type]?.toUpperCase()}</Text>
        </Badge>
        <Badge className={classes.badge} closable={false} size="xs">
          <Text className={classes.badgeText}>
            {question.required ? t('required').toUpperCase() : t('notRequired').toUpperCase()}
          </Text>
        </Badge>
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

  const renderQuestions = () =>
    store.feedback.questions.map((question, index) => (
      <ActivityAccordionPanel
        itemValue={question.id}
        label={
          <TextClamp>
            <Text sx={(theme) => ({ ...theme.other.global.content.typo.heading.xsm })}>{`${
              index + 1
            }. ${htmlToText(question.question)}`}</Text>
          </TextClamp>
        }
        icon={getQuestionIcons(question.type, question.properties.withImages)}
        key={question.id}
        rightSection={getQuestionBadges(question)}
      >
        <Box className={classes.questionBox}>
          {React.cloneElement(questionsByType[question.type], {
            question,
            responses: store.result.questionsInfo[question.id] || {},
            t,
          })}
        </Box>
      </ActivityAccordionPanel>
    ));

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
    createDatasheet(store.feedback.name, store.feedback.questions, store.instanceId, format, {
      timeMarkerLabel: t('timeMarker'),
      option: t('optionPlaceholder'),
    });
  }

  React.useEffect(() => {
    if (params.id) init();
  }, [params.id]);

  if (store.loading) return null;

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <ActivityHeader
          instance={dynamicInstance}
          showClass
          showRole
          showEvaluationType
          showTime
          showDeadline
          action={t('evaluation')}
          showCloseButtons={isTeacher}
          allowEditDeadline={isTeacher}
        />
      }
    >
      <Stack justifyContent="center" ref={scrollRef} style={{ overflow: 'auto' }}>
        <TotalLayoutStepContainer
          Footer={
            isTeacher && (
              <TotalLayoutFooterContainer
                fixed
                scrollRef={scrollRef}
                rightZone={
                  <>
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
                  </>
                }
              />
            )
          }
        >
          <Stack direction="column">
            <ContextContainer title={t('responsesTitleLabel')} style={{ gap: '16px' }}>
              <ActivityAccordion
                multiple
                state={accordionState}
                onChange={setAccordionState}
                compact
                style={{ gap: '16px' }}
              >
                <ActivityAccordionPanel
                  itemValue={'info'}
                  label={
                    <TextClamp>
                      <Text sx={(theme) => ({ ...theme.other.global.content.typo.heading.xsm })}>
                        {t('generalInformation')}
                      </Text>
                    </TextClamp>
                  }
                  icon={<DataFileBarsQuestionIcon />}
                >
                  <Stack fullWidth fullHeight spacing={2} className={classes.generalInformation}>
                    <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                      <Text className={classes.infoText}>{store.result.generalInfo.started}</Text>
                      <Text role="productive" color="primary" size="xs">
                        {t('started')}
                      </Text>
                    </Box>
                    <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                      <Text className={classes.infoText}>{store.result.generalInfo.finished}</Text>
                      <Text role="productive" color="primary" size="xs">
                        {t('sent')}
                      </Text>
                    </Box>
                    <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                      <Text className={classes.infoText}>{`${
                        store.result.generalInfo.completionPercentage || 0
                      }%`}</Text>
                      <Text role="productive" color="primary" size="xs">
                        {t('completed')}
                      </Text>
                    </Box>
                    <Box className={classes.infoBox}>
                      <Text className={classes.infoText}>{getAvgTime()}</Text>
                      <Text role="productive" color="primary" size="xs">
                        {t('timeToComplete')}
                      </Text>
                    </Box>
                  </Stack>
                </ActivityAccordionPanel>
                {renderQuestions()}
              </ActivityAccordion>
            </ContextContainer>
          </Stack>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
  //     <Stack direction="column" spacing={4} className={classes.container}>
  //       {isTeacher && (
  //         <Stack justifyContent="space-between">
  //           <Stack spacing={5}>
  //             <Switch
  //               label={t('closeFeedback')}
  //               checked={store.instanceState.isClosed}
  //               onChange={onCloseFeedback}
  //             />
  //             <Switch
  //               label={t('archiveFeedback')}
  //               checked={store.instanceState.isArchived}
  //               onChange={onArchiveFeedback}
  //             />
  //           </Stack>
  //           <Stack spacing={3}>
  //             <Button
  //               variant="outline"
  //               rightIcon={<DownloadIcon />}
  //               onClick={() => downloadDatasheet('csv')}
  //             >
  //               CSV
  //             </Button>
  //             <Button
  //               variant="outline"
  //               rightIcon={<DownloadIcon />}
  //               onClick={() => downloadDatasheet('xls')}
  //             >
  //               XLS
  //             </Button>
  //           </Stack>
  //         </Stack>
  //       )}
  //       <Box className={classes.resultHeader}>
  //         <Title order={5} role="productive" color="quartiary">
  //           {t('feedback')}
  //         </Title>
  //         <Title order={3} style={{ marginTop: 2 }}>
  //           {store.feedback.name}
  //         </Title>
  //       </Box>
  //       <ActivityAccordion multiple state={accordionState} onChange={setAccordionState}>
  //         <ActivityAccordionPanel
  //           itemValue={'info'}
  //           label={t('generalInformation')}
  //           color="solid"
  //           icon={<DataFileBarsQuestionIcon />}
  //         >
  //           <Stack fullWidth fullHeight spacing={2} className={classes.generalInformation}>
  //             <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
  //               <Text role="productive" color="primary" size="xs">
  //                 {t('started')}
  //               </Text>
  //               <Text className={classes.infoText}>{store.result.generalInfo.started}</Text>
  //             </Box>
  //             <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
  //               <Text role="productive" color="primary" size="xs">
  //                 {t('sent')}
  //               </Text>
  //               <Text className={classes.infoText}>{store.result.generalInfo.finished}</Text>
  //             </Box>
  //             <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
  //               <Text role="productive" color="primary" size="xs">
  //                 {t('completed')}
  //               </Text>
  //               <Text className={classes.infoText}>{`${
  //                 store.result.generalInfo.completionPercentage || 0
  //               }%`}</Text>
  //             </Box>
  //             <Box className={classes.infoBox}>
  //               <Text role="productive" color="primary" size="xs">
  //                 {t('timeToComplete')}
  //               </Text>
  //               <Text className={classes.infoText}>{getAvgTime()}</Text>
  //             </Box>
  //           </Stack>
  //         </ActivityAccordionPanel>
  //         {renderQuestions()}
  //       </ActivityAccordion>
  //     </Stack>
  //   </Stack>
  // );
}
