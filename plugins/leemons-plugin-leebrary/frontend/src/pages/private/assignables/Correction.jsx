import React, { useRef } from 'react';

import {
  ActivityAccordion,
  ActivityAccordionPanel,
  Box,
  Button,
  ContextContainer,
  createStyles,
  HtmlText,
  ImageLoader,
  LoadingOverlay,
  Stack,
  TotalLayoutContainer,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { InfoIcon } from '@bubbles-ui/icons/solid';
import { useSearchParams } from '@common';
import { Link, useParams } from 'react-router-dom';

import { useIsStudent } from '@academic-portfolio/hooks';
import ActivityHeader from '@assignables/components/ActivityHeader';
import ActivityFeedbackAlertManager from '@assignables/components/EvaluationFeedback/Alerts/ActivityFeedbackAlertManager';
import useNextActivityUrl from '@assignables/hooks/useNextActivityUrl';
import useAssignations from '@assignables/requests/hooks/queries/useAssignations';
import { AssetEmbedList } from '@leebrary/components/AssetEmbedList';
import prefixPN from '@leebrary/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

const useCorrectionStyles = createStyles(() => ({
  accordionPanel: {
    paddingLeft: 34,
    paddingRight: 16,
  },
}));

export default function Correction() {
  const { id, user } = useParams();
  const scrollRef = useRef();
  const { classes } = useCorrectionStyles();
  const [t] = useTranslateLoader(prefixPN('assignableCorrection'));

  const isStudent = useIsStudent();
  const params = useSearchParams();
  const fromExecution = useRef(params.has('fromExecution')).current;

  const { data: assignation, isLoading } = useAssignations({
    query: { instance: id, user },
    fetchInstance: true,
  });

  const { instance } = assignation ?? {};
  const { assignable } = instance ?? {};

  const nextActivityUrl = useNextActivityUrl(assignation);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <ActivityHeader
          assignation={assignation}
          instance={instance}
          action={t('action')}
          showClass
          showRole
          showEvaluationType
          showTime
          showDeadline
          showStatusBadge
        />
      }
    >
      <Stack justifyContent="center" style={{ overflowY: 'auto' }} ref={scrollRef}>
        <TotalLayoutStepContainer
          Footer={
            isStudent &&
            fromExecution &&
            !!instance?.metadata?.module && (
              <TotalLayoutFooterContainer
                scrollRef={scrollRef}
                fixed
                rightZone={
                  <Link
                    to={
                      nextActivityUrl ??
                      `/private/learning-paths/modules/dashboard/${instance?.metadata?.module?.id}`
                    }
                  >
                    <Button rightIcon={!!nextActivityUrl && <ChevRightIcon />}>
                      {nextActivityUrl ? t('nextActivity') : t('goToModule')}
                    </Button>
                  </Link>
                }
              />
            )
          }
        >
          <Stack direction="column" spacing="xl">
            <ActivityFeedbackAlertManager assignation={assignation} />
            <ContextContainer title={t('summary')}>
              <ActivityAccordion>
                {!!instance?.metadata?.statement && (
                  <ActivityAccordionPanel label={t('information')} icon={<InfoIcon />}>
                    <Box className={classes.accordionPanel}>
                      <HtmlText>{instance?.metadata?.statement}</HtmlText>
                    </Box>
                  </ActivityAccordionPanel>
                )}
                <ActivityAccordionPanel
                  label={t('resources')}
                  icon={
                    <Box
                      sx={{
                        position: 'relative',
                        width: 22,
                        height: 22,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ImageLoader src="/public/leebrary/media-files.svg" />
                    </Box>
                  }
                >
                  <Box className={classes.accordionPanel}>
                    <AssetEmbedList assets={[assignable.metadata.leebrary.asset]} />
                  </Box>
                </ActivityAccordionPanel>
              </ActivityAccordion>
            </ContextContainer>
          </Stack>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
