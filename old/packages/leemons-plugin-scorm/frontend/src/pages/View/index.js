import React, { useEffect, useMemo, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, LoadingOverlay, Button, createStyles } from '@bubbles-ui/components';
import { ActivityContainer } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert } from '@layout/alert';
import { prefixPN } from '@scorm/helpers';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import useAssignableInstances from '@assignables/hooks/assignableInstance/useAssignableInstancesQuery';
import usePackage from '@scorm/request/hooks/queries/usePackage';
import useAssignation from '@scorm/request/hooks/queries/useAssignation';
import { updateStatus } from '@scorm/request/assignation';
import useClassData from '@assignables/hooks/useClassDataQuery';
import { useLocale } from '@common';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { useUpdateTimestamps } from '@tasks/components/Student/TaskDetail/components/Steps/Steps';
import useNextActivityUrl from '@assignables/hooks/useNextActivityUrl';
import { useLayout } from '@layout/context';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import { ScormRender } from '@scorm/components/ScormRender';
import { useScorm } from '../../hooks/useScorm';

function onSetValue({ instance, user, commit, LatestCommit }) {
  if (!isEmpty(commit)) {
    LatestCommit.current = { ...commit, leemonsCommitDate: new Date() };
  }

  updateStatus({ instance, user, state: commit }).catch((e) => addErrorAlert(e.message));
}

function useData({ id, user }) {
  const { data: instance, isLoading: instanceIsLoading } = useAssignableInstances({
    id,
    enabled: !!id,
  });

  const { data: scormAssignation, isLoading: assignationIsLoading } = useAssignation({
    instance: id,
    user,
    enabled: !!id && !!user,
  });

  const { assignation, scormStatus: state } = scormAssignation ?? {};

  const assignationWithInstance = useMemo(
    () => ({ ...assignation, instance }),
    [assignation, instance]
  );

  const { data: scormPackage, isLoading: scormIsLoading } = usePackage({
    id: instance?.assignable?.id,
    enabled: !!instance?.assignable?.id,
  });

  const { data: classData, isLoading: classDataIsLoading } = useClassData(instance);
  const coverUrl = React.useMemo(
    () => getFileUrl(scormPackage?.asset?.cover?.id ?? scormPackage?.asset?.cover),
    [scormPackage?.asset?.cover]
  );

  return {
    instance,
    scormAssignation,

    scormPackage,
    assignation: assignationWithInstance,
    state,

    classData,
    coverUrl,

    isLoading: instanceIsLoading || assignationIsLoading || scormIsLoading || classDataIsLoading,
  };
}

const useViewStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
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
  };
});

function useOnScormComplete({
  updateTimestamps,
  nextActivityUrl,
  moduleId,
  id,
  user,
  LatestCommit,
}) {
  const [t] = useTranslateLoader(prefixPN('scormView'));
  const { openConfirmationModal } = useLayout();
  const history = useHistory();

  const onCompletedAttempt = async () => {
    updateTimestamps('end');

    if (!nextActivityUrl) {
      openConfirmationModal({
        title: t('completionModal.title'),
        description: t('completionModal.description'),
        labels: {
          cancel: moduleId ? t('completionModal.module') : t('completionModal.ongoing'),
          confirm: t('completionModal.results'),
        },
        onConfirm: async () => history.push(`/private/scorm/result/${id}/${user}`),
        onCancel: async () =>
          moduleId
            ? history.push(`/private/learning-paths/modules/dashboard/${moduleId}`)
            : history.push('/private/assignables/ongoing'),
      })();
    } else {
      openConfirmationModal({
        title: t('completionModal.title'),
        description: t('completionModal.description'),
        labels: {
          cancel: t('completionModal.results'),
          confirm: t('nextActivity'),
        },
        onCancel: async () => history.push(`/private/scorm/result/${id}/${user}`),
        onConfirm: async () => history.push(nextActivityUrl),
      })();
    }
  };

  const onIncompletedAttempt = () => {
    openConfirmationModal({
      title: t('incompleteAttemptModal.title'),
      description: t('incompleteAttemptModal.description'),
      labels: {
        cancel: t('incompleteAttemptModal.finish'),
        confirm: t('incompleteAttemptModal.review'),
      },
      onCancel: () => setImmediate(onCompletedAttempt),
    })();
  };

  const onComplete = () => {
    if (
      LatestCommit?.current?.cmi?.completion_status === 'completed' ||
      ['completed', 'failed', 'passed'].includes(LatestCommit?.current?.cmi?.core?.lesson_status)
    ) {
      onCompletedAttempt();
    } else {
      onIncompletedAttempt();
    }
  };

  return { onComplete };
}

export default function View() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('scormView'));
  const locale = useLocale();
  const { classes } = useViewStyles();
  const LatestCommit = useRef({});

  // ----------------------------------------------------------------------
  // Data
  const { id, user } = useParams();

  const {
    instance,
    state,
    assignation,
    scormPackage,
    classData,
    coverUrl,
    isLoading: dataIsLoading,
  } = useData({ id, user });

  const nextActivityUrl = useNextActivityUrl(assignation);
  const { mutateAsync } = useStudentAssignationMutation();
  const updateTimestamps = useUpdateTimestamps(mutateAsync, assignation);

  useScorm({
    onInitialize: () => {
      updateTimestamps('open');
      updateTimestamps('start');
    },
    onSetValue: (commit) => onSetValue({ instance: id, user, commit, LatestCommit }),
  });

  useEffect(() => {
    if (dayjs(state?.leemonsCommitDate).isAfter(dayjs(LatestCommit.current?.leemonsCommitDate))) {
      LatestCommit.current = state;
    }
  }, [state]);
  // ----------------------------------------------------------------------
  // Handlers

  const { onComplete } = useOnScormComplete({
    id,
    LatestCommit,
    nextActivityUrl,
    moduleId: instance?.metadata?.module?.id,
    updateTimestamps,
    user,
  });

  // ----------------------------------------------------------------------
  // COMPONENT

  if (dataIsLoading || tLoading) return <LoadingOverlay visible />;

  return (
    <Box
      sx={{
        'div div:nth-child(2)': {
          overflow: 'hidden',
        },
      }}
    >
      <ActivityContainer
        header={{
          title: scormPackage?.asset?.name,
          subtitle: classData?.name,
          icon: classData?.icon,
          color: classData?.color,
          image: coverUrl,
        }}
        deadline={
          instance?.dates?.deadline && {
            label: t('deadline'),
            deadline:
              instance?.dates?.deadline instanceof Date
                ? instance?.dates?.deadline
                : new Date(instance?.dates?.deadline),
            locale,
          }
        }
        collapsed
      >
        <ScormRender scormPackage={scormPackage} state={state} onSetValue={onSetValue} />
      </ActivityContainer>
      <Box className={classes.buttonContainer}>
        {!scormPackage.gradable && !!nextActivityUrl ? (
          <Button onClick={onComplete}>{t('nextActivity')}</Button>
        ) : (
          <Button onClick={onComplete}>{t('markAsFinish')}</Button>
        )}
      </Box>
    </Box>
  );
}
