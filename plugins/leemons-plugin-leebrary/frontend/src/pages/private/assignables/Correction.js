import ActivityHeader from '@assignables/components/ActivityHeader';
import useAssignations from '@assignables/requests/hooks/queries/useAssignations';
import {
  LoadingOverlay,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  Stack,
  HtmlText,
  ActivityAccordion,
  ActivityAccordionPanel,
  ContextContainer,
  Box,
  ImageLoader,
  createStyles,
} from '@bubbles-ui/components';
import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { InfoIcon } from '@bubbles-ui/icons/solid';
import { AssetEmbedList } from '@leebrary/components/AssetEmbedList';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@leebrary/helpers/prefixPN';
import ActivityFeedbackAlertManager from '@assignables/components/EvaluationFeedback/Alerts/ActivityFeedbackAlertManager';

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

  const { data: assignation, isLoading } = useAssignations({
    query: { instance: id, user },
    fetchInstance: true,
  });
  const { instance } = assignation ?? {};
  const { assignable } = instance ?? {};

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
        <TotalLayoutStepContainer>
          <Stack direction="column" spacing="xl">
            <ActivityFeedbackAlertManager assignation={assignation} />
            <ContextContainer title={t('summary')}>
              <ActivityAccordion>
                {!!instance.metadata.statement && (
                  <ActivityAccordionPanel label={t('information')} icon={<InfoIcon />}>
                    <Box className={classes.accordionPanel}>
                      <HtmlText>{instance.metadata.statement}</HtmlText>
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
