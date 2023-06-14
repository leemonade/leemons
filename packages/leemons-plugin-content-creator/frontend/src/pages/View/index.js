import React, { useEffect } from 'react';
import {
  Box,
  PageHeader,
  LoadingOverlay,
  Stack,
  Button,
  createStyles,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useLocale, useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import { DocumentIcon } from '@content-creator/components/icons';
import prefixPN from '@content-creator/helpers/prefixPN';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import { useParams, useHistory } from 'react-router-dom';
import { getDocumentRequest } from '@content-creator/request';
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
  const { classes } = useDocumentViewStyles();

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

  // const [store, render] = useStore({
  //   loading: true,
  //   isNew: false,
  //   titleValue: '',
  //   document: {},
  //   preparedAsset: {},
  //   isConfigPage: false,
  //   openShareDrawer: false,
  // });

  // async function init() {
  //   try {
  //     store.loading = true;
  //     render();
  //     store.instance = await getAssignableInstance({ id: params.id });
  //     const { document } = await getDocumentRequest(store.instance.assignable.id);
  //     store.document = document;
  //     store.idLoaded = params.id;
  //     store.loading = false;
  //     render();
  //   } catch (error) {
  //     addErrorAlert(error);
  //   }
  // }

  // React.useEffect(() => {
  //   if (params?.id && store.idLoaded !== params?.id) init();
  // }, [params]);

  // if (store.loading || tLoading) return <LoadingOverlay visible />;

  // return (
  //   <Box style={{ height: '100vh' }}>
  //     <Stack direction="column" fullHeight>
  //       <PageHeader
  //         values={{
  //           title: store.document.name,
  //         }}
  //         icon={!store.isConfigPage ? <DocumentIcon /> : null}
  //         loading={store.saving}
  //         fullWidth
  //       />
  //       <ContentEditorInput
  //         useSchema
  //         schemaLabel={t('schemaLabel')}
  //         labels={{
  //           format: t('formatLabel'),
  //         }}
  //         value={store.document.content}
  //         openLibraryModal={false}
  //         readOnly
  //       />
  //     </Stack>
  //   </Box>
  // );
}
