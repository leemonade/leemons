import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ActivityHeader from '@assignables/components/ActivityHeader';
import {
  ActivityUnavailable,
  ActivityUnavailableFooter,
  useActivityStates,
} from '@assignables/components/ActivityUnavailable';
import TotalLayoutStepContainerWithAccordion from '@assignables/components/TotalLayoutStepContainerWithAccordion/TotalLayoutStepContainerWithAccordion';
import useAssignations from '@assignables/requests/hooks/queries/useAssignations';
import {
  Button,
  HtmlText,
  LoadingOverlay,
  Stack,
  TotalLayoutContainer,
  TotalLayoutFooterContainer,
  useTheme,
} from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import { AlertInformationCircleIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useUpdateTimestamps } from '@tasks/components/Student/TaskDetail/__DEPRECATED__components/Steps/Steps';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';

import { AssetPlayerWrapperExecution } from '@leebrary/components/LibraryTool/AssetPlayerWrapperExecution';
import prefixPN from '@leebrary/helpers/prefixPN';
import useAssets from '@leebrary/request/hooks/queries/useAssets';

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

  const { isUnavailable } = useActivityStates({ instance, user });

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

  const isPdf = asset?.fileExtension === 'pdf';

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
              title: t('instructions'),
              icon: (
                <AlertInformationCircleIcon color={theme.other.global.content.color.icon.default} />
              ),
              children: <HtmlText>{instance?.metadata?.statement}</HtmlText>,
            }
          }
          scrollRef={scrollRef}
          Footer={
            isUnavailable ? (
              <ActivityUnavailableFooter scrollRef={scrollRef} singlePage />
            ) : (
              <TotalLayoutFooterContainer scrollRef={scrollRef} fixed>
                <Stack justifyContent="end" fullWidth spacing={4}>
                  {isPdf && (
                    <Button
                      leftIcon={<DownloadIcon />}
                      variant="outline"
                      onClick={() => window.open(asset.url, '_blank', 'noopener')}
                    >
                      {t('download')}
                    </Button>
                  )}
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
            )
          }
        >
          {isUnavailable ? (
            <ActivityUnavailable instance={instance} user={user} scrollRef={scrollRef} clean />
          ) : (
            <Stack fullWidth fullHeight justifyContent="center" alignItems="center">
              <AssetPlayerWrapperExecution asset={asset} />
            </Stack>
          )}
        </TotalLayoutStepContainerWithAccordion>
      </Stack>
    </TotalLayoutContainer>
  );
}
