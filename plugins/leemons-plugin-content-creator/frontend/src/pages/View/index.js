import React, { useEffect } from 'react';
import {
  Box,
  LoadingOverlay,
  Button,
  createStyles,
  ActivityAccordion,
  ActivityAccordionPanel,
  HtmlText,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useLocale } from '@common';
import prefixPN from '@content-creator/helpers/prefixPN';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';
import { useParams, useHistory } from 'react-router-dom';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import useAssignations from '@assignables/hooks/assignations/useAssignationsQuery';
import useClassData from '@assignables/hooks/useClassDataQuery';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { ActivityContainer } from '@bubbles-ui/leemons';
import useDocument from '@content-creator/request/hooks/queries/useDocument';
import { useUpdateTimestamps } from '@tasks/components/Student/TaskDetail/components/Steps/Steps';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import useNextActivityUrl from '@assignables/hooks/useNextActivityUrl';
import { AlertInformationCircleIcon } from '@bubbles-ui/icons/solid';

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
  const [t, , , tLoading] = useTranslateLoader(prefixPN('contentCreatorDetail'));
  const locale = useLocale();
  const history = useHistory();
  const { classes, theme } = useDocumentViewStyles();

  // ----------------------------------------------------------------------
  // SETTINGS
  const { id, user } = useParams();

  const { classData, asset, coverUrl, instance, assignable, assignation, isLoading } =
    useDocumentData({
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
    <ActivityContainer
      header={{
        title: asset?.name,
        subtitle: classData?.name,
        icon: classData?.icon,
        color: classData?.color,
        image: coverUrl,
      }}
      deadline={
        instance?.dates?.deadline && {
          deadline:
            instance?.dates?.deadline instanceof Date
              ? instance?.dates?.deadline
              : new Date(instance?.dates?.deadline),
          locale,
        }
      }
      collapsed
    >
      <>
        {!!instance?.metadata?.statement && (
          <ActivityAccordion defaultValue="instructions">
            <ActivityAccordionPanel
              itemValue="instructions"
              label={t('instructions')}
              icon={
                <AlertInformationCircleIcon color={theme.other.global.content.color.icon.default} />
              }
            >
              <Box
                sx={(th) => ({
                  padding: th.other.global.spacing.padding.sm,
                  paddingLeft: 25,
                })}
              >
                <HtmlText>{instance?.metadata?.statement}</HtmlText>
              </Box>
            </ActivityAccordionPanel>
          </ActivityAccordion>
        )}
        <ContentEditorInput
          useSchema
          schemaLabel={t('schemaLabel')}
          labels={{
            format: t('formatLabel'),
          }}
          value={assignable?.content}
          openLibraryModal={false}
          readOnly
        />
        <Box className={classes.buttonContainer}>
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
      </>
    </ActivityContainer>
  );
}
