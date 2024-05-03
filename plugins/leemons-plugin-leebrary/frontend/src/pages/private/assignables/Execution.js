import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  HtmlText,
  LoadingOverlay,
  Stack,
  TotalLayoutContainer,
  TotalLayoutFooterContainer,
  useTheme,
} from '@bubbles-ui/components';
import { AlertInformationCircleIcon } from '@bubbles-ui/icons/solid';
import { useHistory, useParams } from 'react-router-dom';

import ActivityHeader from '@assignables/components/ActivityHeader';
import useAssignations from '@assignables/requests/hooks/queries/useAssignations';
import useAssets from '@leebrary/request/hooks/queries/useAssets';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { useUpdateTimestamps } from '@tasks/components/Student/TaskDetail/__DEPRECATED__components/Steps/Steps';
import TotalLayoutStepContainerWithAccordion from '@assignables/components/TotalLayoutStepContainerWithAccordion/TotalLayoutStepContainerWithAccordion';
import prefixPN from '@leebrary/helpers/prefixPN';
import { AssetPlayerWrapperExecution } from '@leebrary/components/LibraryTool/AssetPlayerWrapperExecution';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

export default function Execution() {
  const [t] = useTranslateLoader(prefixPN('assignableExecution'));
  const { id, user } = useParams();
  const scrollRef = useRef();
  const history = useHistory();
  const theme = useTheme();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: assignation, isLoading } = useAssignations({
    query: { instance: id, user },
    fetchInstance: true,
  });
  const instance = assignation?.instance;
  const assignable = instance?.assignable;

  const isFinished = assignation?.timestamps?.end;
  const correctionUrl = `${assignable?.roleDetails?.evaluationDetailUrl
    ?.replace(':id', id)
    ?.replace(':user', user)}?fromExecution`;

  const { mutateAsync } = useStudentAssignationMutation();
  const updateTimestamps = useUpdateTimestamps(mutateAsync, assignation);

  useEffect(() => {
    updateTimestamps('open');
    updateTimestamps('start');
  }, [updateTimestamps]);

  const { data: asset } = useAssets({
    ids: [assignable?.metadata?.leebrary?.asset],
    filters: { indexable: false, showPublic: true },
    enabled: !!assignable?.metadata?.leebrary?.asset,
    select: (assets) => assets?.[0] ?? null,
  });

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
          showClass
          showDeadline
          showEvaluationType
          showRole
          showCountdown
          onTimeout={() => history.push(correctionUrl)}
        />
      }
    >
      <Stack justifyContent="center" style={{ overflowY: 'auto' }} ref={scrollRef}>
        <TotalLayoutStepContainerWithAccordion
          accordion={
            !!instance?.metadata?.statement && {
              title: t('information'),
              icon: (
                <AlertInformationCircleIcon color={theme.other.global.content.color.icon.default} />
              ),
              children: <HtmlText>{instance?.metadata?.statement}</HtmlText>,
            }
          }
          scrollRef={scrollRef}
          Footer={
            <TotalLayoutFooterContainer scrollRef={scrollRef} fixed>
              <Stack justifyContent="end" fullWidth>
                <Button
                  loading={isSubmitting}
                  disabled={isFinished}
                  onClick={async () => {
                    setIsSubmitting(true);
                    await updateTimestamps('end');
                    setIsSubmitting(false);
                    history.push(correctionUrl);
                  }}
                >
                  {t('finish')}
                </Button>
              </Stack>
            </TotalLayoutFooterContainer>
          }
        >
          <Stack fullWidth fullHeight justifyContent="center" alignItems="center">
            <AssetPlayerWrapperExecution asset={asset} />
          </Stack>
        </TotalLayoutStepContainerWithAccordion>
      </Stack>
    </TotalLayoutContainer>
  );
}
