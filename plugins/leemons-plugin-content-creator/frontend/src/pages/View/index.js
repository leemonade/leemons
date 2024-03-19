import React, { useEffect, useRef } from 'react';
import {
  Box,
  Stack,
  LoadingOverlay,
  Button,
  createStyles,
  ActivityAccordion,
  ActivityAccordionPanel,
  HtmlText,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import ActivityHeader from '@assignables/components/ActivityHeader/index';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@content-creator/helpers/prefixPN';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';
import { useParams, useHistory } from 'react-router-dom';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import useAssignations from '@assignables/hooks/assignations/useAssignationsQuery';
import useClassData from '@assignables/hooks/useClassDataQuery';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import useDocument from '@content-creator/request/hooks/queries/useDocument';
import { useUpdateTimestamps } from '@tasks/components/Student/TaskDetail/__DEPRECATED__components/Steps/Steps';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import useNextActivityUrl from '@assignables/hooks/useNextActivityUrl';
import { AlertInformationCircleIcon } from '@bubbles-ui/icons/solid';
import TotalLayoutStepContainerWithAccordion from '@assignables/components/TotalLayoutStepContainerWithAccordion/TotalLayoutStepContainerWithAccordion';

function useDocumentData({ id, user }) {
  const { data: assignation, isLoading: assignationIsLoading } = useAssignations(
    { instance: id, user },
    true,
    { enabled: !!id && !!user }
  );

  const { data: instanceData, isLoading: instancesIsLoading } = useInstances({
    id,
    enabled: !!id && !user,
  });

  const instance = instanceData ?? assignation?.instance;

  const { data: assignable, isLoading: assignableIsLoading } = useDocument({
    id: instance?.assignable?.id,
    enabled: !!instance?.assignable?.id,
  });
  const asset = assignable?.asset;

  const { data: classData, isLoading: classDataIsLoading } = useClassData(instance);
  const coverUrl = React.useMemo(
    () => getFileUrl(asset?.cover?.id ?? asset?.cover),
    [asset?.cover]
  );

  return {
    assignation,
    instance,
    assignable,
    asset,
    classData,
    coverUrl,
    isLoading:
      (assignationIsLoading && instancesIsLoading) || classDataIsLoading || assignableIsLoading,
  };
}

const useDocumentViewStyles = createStyles((theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    background: theme.white,
    borderTop: '1px solid #BAC2D0',
    padding: 10,
  },
}));

export default function DocumentView() {
  const scrollRef = useRef();
  const [t, , , tLoading] = useTranslateLoader(prefixPN('contentCreatorDetail'));
  const history = useHistory();
  const { theme } = useDocumentViewStyles();

  // ----------------------------------------------------------------------
  // SETTINGS
  const { id, user } = useParams();

  const { instance, assignable, assignation, isLoading } = useDocumentData({
    id,
    user,
  });
  const nextActivityUrl = useNextActivityUrl(assignation);

  const { mutateAsync } = useStudentAssignationMutation();
  const updateTimestamps = useUpdateTimestamps(mutateAsync, assignation);

  useEffect(() => {
    updateTimestamps('open');
    updateTimestamps('start');
  }, [updateTimestamps]);

  if (isLoading || tLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <ActivityHeader
          instance={instance}
          showClass
          showRole
          showEvaluationType
          showTime
          showDeadline
        />
      }
    >
      <Stack justifyContent="center" ref={scrollRef} style={{ overflowY: 'auto' }}>
        <TotalLayoutStepContainerWithAccordion
          Footer={
            <TotalLayoutFooterContainer
              scrollRef={scrollRef}
              rightZone={
                <Box>
                  {nextActivityUrl ? (
                    <Button
                      rightIcon={<ChevRightIcon />}
                      onClick={() =>
                        updateTimestamps('end').then(() => {
                          history.push(nextActivityUrl);
                        })
                      }
                    >
                      {t('nextActivity')}
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        updateTimestamps('end').then(() => {
                          history.push('/private/assignables/ongoing');
                        })
                      }
                    >
                      {t('markRead')}
                    </Button>
                  )}
                </Box>
              }
              fixed
            />
          }
          accordion={
            !!instance?.metadata?.statement && {
              title: t('instructions'),
              icon: (
                <AlertInformationCircleIcon color={theme.other.global.content.color.icon.default} />
              ),
              children: <HtmlText>{instance?.metadata?.statement}</HtmlText>,
            }
          }
          noHorizontalPadding
          noVerticalPadding
        >
          <ContentEditorInput
            useSchema
            compact
            fullWidth
            schemaLabel={t('schemaLabel')}
            labels={{
              format: t('formatLabel'),
            }}
            value={assignable?.content}
            openLibraryModal={false}
            readOnly
          />
        </TotalLayoutStepContainerWithAccordion>
      </Stack>
    </TotalLayoutContainer>
  );
}
